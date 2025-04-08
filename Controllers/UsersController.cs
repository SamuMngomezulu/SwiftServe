using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using SwiftServe.Data;
using SwiftServe.Models;
using SwiftServe.Dtos;
using System.ComponentModel.DataAnnotations;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly SwiftServeDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(SwiftServeDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

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

                var user = new User
                {
                    FirstName = registrationDto.FirstName,
                    LastName = registrationDto.LastName,
                    UserEmail = registrationDto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password),
                    Role = new Role { RoleName = "User" }, 
                    Wallet = new Wallet { Balance = 0 }
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Success = true,
                    Message = "User registered successfully",
                    UserId = user.UserID
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
    }
}
