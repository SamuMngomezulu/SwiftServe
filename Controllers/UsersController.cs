using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using SwiftServe.Data;
using SwiftServe.Models;
using SwiftServe.Dtos;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly test_SwiftServeDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(test_SwiftServeDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Create User
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto registrationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    Success = false,
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }

            try
            {
                if (await _context.Users.AnyAsync(u => u.UserEmail == registrationDto.Email))
                {
                    return Conflict(new
                    {
                        Success = false,
                        Message = "Email already registered"
                    });
                }

                // Default to "User" role
                var user = new User
                {
                    FirstName = registrationDto.FirstName,
                    LastName = registrationDto.LastName,
                    UserEmail = registrationDto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password),
                    RoleID = 3,
                    Wallet = new Wallet { Balance = 0 }
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Success = true,
                    Message = "User registered successfully",
                    UserId = user.UserID,
                    Role = "User"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while processing your request"
                });
            }
        }

        // GET Method by User ID
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(int userId)
        {
            var user = await _context.Users.Include(u => u.Role).Include(u => u.Wallet).FirstOrDefaultAsync(u => u.UserID == userId);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.UserEmail,
                Role = user.Role.RoleName,
                Balance = user.Wallet.Balance
            });
        }

        // Update User's Role
        [HttpPut("{userId}/role")]
        //[Authorize(Roles = "Super User,Admin")]
        public async Task<IActionResult> UpdateRole(int userId, [FromBody] RoleUpdateDto roleUpdate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var roleExists = await _context.Roles.AnyAsync(r => r.RoleID == roleUpdate.RoleID);
            if (!roleExists)
            {
                return BadRequest("Invalid role ID");
            }

            user.RoleID = roleUpdate.RoleID;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Success = true,
                Message = "Role updated successfully",
                UserId = user.UserID,
                RoleID = user.RoleID
            });
        }

        // Delete User
        [HttpDelete("{userId}")]
        //[Authorize(Roles = "Super User,Admin")] //Disabled for CRUD tests
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var user = await _context.Users.Include(u => u.Wallet).FirstOrDefaultAsync(u => u.UserID == userId);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            _context.Wallets.Remove(user.Wallet);  // Remove associated wallet
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Success = true,
                Message = "User and associated wallet deleted successfully"
            });
        }
    }
}
