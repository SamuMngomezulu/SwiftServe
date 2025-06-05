using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using SwiftServe.Data;
using SwiftServe.Models;
using SwiftServe.Dtos;
using SwiftServe.Models.Users;
using SwiftServe.Interfaces;
using System.Security.Claims;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserRepository userRepository, ILogger<UsersController> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto dto)
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
                if (await _userRepository.UserExistsByEmailAsync(dto.Email))
                {
                    return Conflict(new
                    {
                        Success = false,
                        Message = "Email already registered"
                    });
                }

                var user = await _userRepository.RegisterUserAsync(dto);

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
                _logger.LogError(ex, "Registration error");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred during registration"
                });
            }
        }

        [HttpGet("{userId}")]
        [Authorize(Roles = "Admin, Super User, User")]
        public async Task<IActionResult> GetUser(int userId)
        {
            // Ensure a user can only fetch their own data unless they are an Admin or Super User
            if (User.IsInRole("User") && User.FindFirstValue(ClaimTypes.NameIdentifier) != userId.ToString())
            {
                return Forbid();
            }


            // Admin and Super User can access any user’s data
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) return NotFound();

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



        [HttpPut("{userId}/role")]
        [Authorize(Roles = "Super User")] // Only Super Users can update roles
        public async Task<IActionResult> UpdateRole(int userId, [FromBody] RoleUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!await _userRepository.RoleExistsAsync(dto.RoleID))
                return BadRequest("Invalid role ID");

            var result = await _userRepository.UpdateUserRoleAsync(userId, dto.RoleID);
            if (!result) return NotFound();

            return Ok(new
            {
                Success = true,
                Message = "Role updated successfully",
                UserId = userId,
                RoleID = dto.RoleID
            });
        }

        [HttpDelete("{userId}")]
        [Authorize(Roles = "Super User")] // Only Super Users can delete users
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var result = await _userRepository.DeleteUserAsync(userId);
            if (!result) return NotFound();

            return Ok(new
            {
                Success = true,
                Message = "User and wallet deleted successfully"
            });    


        }

        // Controllers/UsersController.cs
        [HttpGet]
        [Authorize(Roles = "Admin, Super User")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            var userDtos = users.Select(u => new UserDto
            {
                UserID = u.UserID,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.UserEmail,
                Role = u.Role.RoleName,
                Balance = u.Wallet.Balance
            });

            return Ok(userDtos);
        }

        [HttpPost]
        [Authorize(Roles = "Super User")]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto dto)
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
                if (await _userRepository.UserExistsByEmailAsync(dto.Email))
                {
                    return Conflict(new
                    {
                        Success = false,
                        Message = "Email already registered"
                    });
                }

                var user = await _userRepository.RegisterUserAsync(new UserRegistrationDto
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    Password = dto.Password
                });

                // Update role if different from default
                if (dto.RoleID != 3)
                {
                    await _userRepository.UpdateUserRoleAsync(user.UserID, dto.RoleID);
                }

                return Ok(new
                {
                    Success = true,
                    Message = "User created successfully",
                    UserId = user.UserID
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "User creation error");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred during user creation"
                });
            }
        }

        [HttpPut("{userId}")]
        [Authorize(Roles = "Super User")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] UserUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _userRepository.UpdateUserAsync(userId, dto);
            if (!result) return NotFound();

            return Ok(new
            {
                Success = true,
                Message = "User updated successfully"
            });
        }
    }
}
