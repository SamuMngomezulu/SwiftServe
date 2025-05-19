using AutoMapper;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SwiftServe.Dtos;
using SwiftServe.Interfaces;
using SwiftServe.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SwiftServe.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtSettings _jwtSettings;
        private readonly IMapper _mapper;

        public AuthService(IUserRepository userRepository, IOptions<JwtSettings> jwtSettings, IMapper mapper)
        {
            _userRepository = userRepository;
            _jwtSettings = jwtSettings.Value;
            _mapper = mapper;
        }

        public async Task<AuthResultDto> AuthenticateAsync(UserLoginDto loginDto)
        {
            try
            {
                var user = await _userRepository.GetUserByEmailAsync(loginDto.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    return new AuthResultDto
                    {
                        Success = false,
                        ErrorMessage = "Invalid email or password."
                    };
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_jwtSettings.Key);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                new Claim(ClaimTypes.Email, user.UserEmail),
                new Claim(ClaimTypes.Role, user.Role.RoleName)
            }),
                    Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes),
                    Issuer = _jwtSettings.Issuer,
                    Audience = _jwtSettings.Audience,
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return new AuthResultDto
                {
                    Success = true,
                    Token = tokenHandler.WriteToken(token),
                    Message = $"Login successful. Welcome back, {user.FirstName}!"
                };
            }
            catch (Exception)
            {
                return new AuthResultDto
                {
                    Success = false,
                    ErrorMessage = "An unexpected error occurred during login. Please try again later."
                };
            }
        }

    }
}
