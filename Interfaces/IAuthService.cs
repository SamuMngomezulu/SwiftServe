using System.Threading.Tasks;
using SwiftServe.Dtos;

namespace SwiftServe.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResultDto> AuthenticateAsync(UserLoginDto loginDto);
    }
}
