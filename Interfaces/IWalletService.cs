using SwiftServe.Dtos;
using SwiftServe.Models.Orders;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SwiftServe.Interfaces
{
    public interface IWalletService
    {
        Task<decimal> GetWalletBalanceAsync(int userId);
        Task<bool> HasSufficientFundsAsync(int userId, decimal amount);
        Task<TransactionDto> AddFundsAsync(int userId, decimal amount);
        Task<Transaction> CreatePurchaseTransactionAsync(int userId, int orderId, decimal amount);
        Task<List<TransactionDto>> GetTransactionHistoryAsync(int userId);
        Task<List<TransactionDto>> GetDepositHistoryAsync(int userId);
        Task<List<TransactionDto>> GetPurchaseHistoryAsync(int userId);
    }
}