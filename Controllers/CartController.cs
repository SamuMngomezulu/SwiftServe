using Microsoft.AspNetCore.Mvc;
using SwiftServe.Interfaces;
using SwiftServe.Dtos;
using System.Security.Claims;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null && int.TryParse(userIdClaim.Value, out var id) ? id : (int?)null;
        }

        [HttpGet]
        public async Task<ActionResult<CartResponseDto>> GetCart()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            var cartDto = await _cartService.GetCartDtoAsync(userId.Value);
            return Ok(cartDto);
        }

        [HttpGet("items")]
        public async Task<ActionResult<List<CartItemResponseDto>>> GetCartItems()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            var cart = await _cartService.GetCartDtoAsync(userId.Value);
            var items = cart?.Items ?? new List<CartItemResponseDto>();
            return Ok(items);
        }

        [HttpGet("total")]
        public async Task<ActionResult<decimal>> GetCartTotal()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            var total = await _cartService.GetTotalPriceAsync(userId.Value);
            return Ok(total);
        }

        [HttpPost("add")]
        public async Task<ActionResult<CartItemResponseDto>> AddToCart([FromBody] AddToCartRequestDto request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            try
            {
                var cartItem = await _cartService.AddToCartAsync(userId.Value, request);
                return CreatedAtAction(nameof(GetCartItems), null, cartItem);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update/{cartItemId}")]
        public async Task<ActionResult<CartItemResponseDto>> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemRequestDto request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            try
            {
                var updatedItem = await _cartService.UpdateCartItemAsync(cartItemId, request);
                if (updatedItem == null) return NotFound("Cart item not found");
                return Ok(updatedItem);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("remove/{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int cartItemId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            var success = await _cartService.RemoveFromCartAsync(cartItemId);
            if (!success) return NotFound("Cart item not found");
            return NoContent();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            var success = await _cartService.ClearCartAsync(userId.Value);
            if (!success) return NotFound("Cart not found or already empty");
            return NoContent();
        }
    }
}
