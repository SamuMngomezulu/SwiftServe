using Microsoft.EntityFrameworkCore;
using SwiftServe.Data;
using SwiftServe.Dtos;
using SwiftServe.Interfaces;
using SwiftServe.Models.Users;

namespace SwiftServe.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly test_SwiftServeDbContext _context;

        public UserRepository(test_SwiftServeDbContext context)
        {
            _context = context;
        }

        public async Task<bool> UserExistsByEmailAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.UserEmail == email);
        }

        public async Task<User> RegisterUserAsync(UserRegistrationDto dto)
        {
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                UserEmail = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleID = 3,
                Wallet = new Wallet { Balance = 0 }
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Wallet)
                .FirstOrDefaultAsync(u => u.UserID == userId);
        }

        public async Task<bool> RoleExistsAsync(int roleId)
        {
            return await _context.Roles.AnyAsync(r => r.RoleID == roleId);
        }

        public async Task<bool> UpdateUserRoleAsync(int userId, int roleId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.RoleID = roleId;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _context.Users.Include(u => u.Wallet).FirstOrDefaultAsync(u => u.UserID == userId);
            if (user == null) return false;

            _context.Users.Remove(user);
            _context.Wallets.Remove(user.Wallet);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserEmail == email);
        }

    }
}
