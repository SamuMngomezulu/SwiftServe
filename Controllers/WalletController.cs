﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwiftServe.Interfaces;
using SwiftServe.Dtos;
using System.Security.Claims;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WalletController : ControllerBase
    {
        private readonly IWalletService _walletService;

        public WalletController(IWalletService walletService)
        {
            _walletService = walletService;
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

        [HttpGet("transactions")]
        [Authorize]
        public async Task<ActionResult<List<TransactionDto>>> GetTransactions()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var transactions = await _walletService.GetTransactionDtosByUserIdAsync(userId.Value);
            return Ok(transactions);
        }
    }
}
