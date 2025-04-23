using SwiftServe.Dtos;
using SwiftServe.Models;
using SwiftServe.Models.User.User;
using System.Threading.Tasks;

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
    }
}
