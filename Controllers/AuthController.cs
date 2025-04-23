using Microsoft.AspNetCore.Mvc;
using SwiftServe.Dtos;
using SwiftServe.Interfaces;
using System.Linq;
using System.Threading.Tasks;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResultDto>> Login(UserLoginDto loginDto)
        {
            var response = await _authService.AuthenticateAsync(loginDto); 

            if (!response.Success)
            {
                return Unauthorized(new { response.ErrorMessage });
            }

            return Ok(response); 
        }


    }
}
