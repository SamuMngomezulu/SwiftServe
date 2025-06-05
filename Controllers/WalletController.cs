using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwiftServe.Dtos;
using SwiftServe.Interfaces;
using System.Globalization;
using System.Security.Claims;
using SwiftServe.Models.Users; // Add this using directive for User model

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WalletController : ControllerBase
    {
        private readonly IWalletService _walletService;
        private readonly IUserRepository _userRepository; // Declare IUserRepository

        // Update the constructor to inject IUserRepository
        public WalletController(IWalletService walletService, IUserRepository userRepository)
        {
            _walletService = walletService;
            _userRepository = userRepository; // Initialize IUserRepository
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : (int?)null;
        }

        [HttpGet("balance")]
        [Authorize]
        public async Task<ActionResult<decimal>> GetBalance()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            return Ok(await _walletService.GetWalletBalanceAsync(userId.Value));
        }

        [HttpPost("deposit")]
        [Authorize]
        public async Task<ActionResult<TransactionDto>> Deposit([FromBody] DepositRequestDto request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var transaction = await _walletService.AddFundsAsync(userId.Value, request.Amount);
                return Ok(transaction);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // New endpoint for Super User to add funds to any user's wallet
        [HttpPost("{userId}/deposit-by-admin")] // Distinct route for clarity
        [Authorize(Roles = "Super User")] // Only Super Users can access this
        public async Task<ActionResult<TransactionDto>> DepositFundsByAdmin(int userId, [FromBody] DepositRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Fetch the user to get their name
                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new
                    {
                        Success = false,
                        Message = $"User with ID {userId} not found."
                    });
                }

                var transaction = await _walletService.AddFundsAsync(userId, request.Amount);

                // Define the South African culture
                CultureInfo saCulture = new CultureInfo("en-ZA");

                // Use the user's name in the success message
                string userName = $"{user.FirstName} {user.LastName}";

                return Ok(new
                {
                    Success = true,
                    Message = $"Successfully added {request.Amount.ToString("C", saCulture)} to {userName}'s wallet.",
                    Transaction = transaction
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                // _logger.LogError(ex, "Error adding funds to user {UserId}'s wallet by admin.", userId);
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while processing the deposit."
                });
            }
        }


        [HttpGet("transactions")]
        [Authorize]
        public async Task<ActionResult<List<TransactionDto>>> GetAllTransactions()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            return Ok(await _walletService.GetTransactionHistoryAsync(userId.Value));
        }

        [HttpGet("transactions/deposits")]
        [Authorize]
        public async Task<ActionResult<List<TransactionDto>>> GetDepositTransactions()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            return Ok(await _walletService.GetDepositHistoryAsync(userId.Value));
        }

        [HttpGet("transactions/purchases")]
        [Authorize]
        public async Task<ActionResult<List<TransactionDto>>> GetPurchaseTransactions()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            return Ok(await _walletService.GetPurchaseHistoryAsync(userId.Value));
        }
    }
}