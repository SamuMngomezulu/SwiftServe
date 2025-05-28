using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwiftServe.Interfaces;
using System.Security.Claims;

using SwiftServe.Dtos;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CheckoutController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : (int?)null;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CheckoutResultDto>> Checkout([FromBody] CheckoutRequestDto request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            try
            {
                var result = await _cartService.CheckoutAsync(userId.Value, request.DeliveryOption);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error during checkout",
                    error = ex.Message
                });
            }
        }
    }
}