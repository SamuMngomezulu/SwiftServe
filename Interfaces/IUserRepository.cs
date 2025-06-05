using SwiftServe.Dtos;
using SwiftServe.Models.Users;

// Interfaces/IUserRepository.cs
namespace SwiftServe.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> UserExistsByEmailAsync(string email);
        Task<User> RegisterUserAsync(UserRegistrationDto registrationDto);
        Task<User?> GetUserByIdAsync(int userId);
        Task<bool> RoleExistsAsync(int roleId);
        Task<bool> UpdateUserRoleAsync(int userId, int roleId);
        Task<bool> DeleteUserAsync(int userId);
        Task<User?> GetUserByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllUsersAsync(); // New method
        Task<bool> UpdateUserAsync(int userId, UserUpdateDto updateDto); // New method
    }
}