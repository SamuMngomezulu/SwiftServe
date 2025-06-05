using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwiftServe.Dtos;
using SwiftServe.Interfaces;
using SwiftServe.Models.Orders;
using System.Security.Claims;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ICartService _cartService;

        public OrdersController(IOrderService orderService, ICartService cartService)
        {
            _orderService = orderService;
            _cartService = cartService;
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : (int?)null;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetUserOrders()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            var orders = await _orderService.GetUserOrdersAsync(userId.Value);
            return Ok(orders);
        }

        [HttpGet("{orderId}")]
        public async Task<ActionResult<OrderDto>> GetOrderDetails(int orderId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            var order = await _orderService.GetOrderDetailsAsync(userId.Value, orderId);
            if (order == null) return NotFound("Order not found");

            return Ok(order);
        }

        [HttpPut("{orderId}/status")]
        [Authorize(Roles = "Super User")]
        public async Task<ActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusDto request)
        {
            try
            {
                await _orderService.UpdateOrderStatusAsync(orderId, request.OrderStatusID);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Super User")]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }


        [HttpGet("statuses")]
        public async Task<ActionResult<List<OrderStatusDto>>> GetOrderStatuses()
        {
            var statuses = await _orderService.GetOrderStatusesAsync();
            return Ok(statuses);
        }

        [HttpPost("{orderId}/cancel")]
        public async Task<ActionResult> CancelOrder(int orderId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("User ID not found in token.");

            try
            {
                await _orderService.CancelOrderAsync(userId.Value, orderId);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}