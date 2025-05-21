using SwiftServe.Models.Users;
using SwiftServe.Models.Orders;
using SwiftServe.Dtos;

namespace SwiftServe.Interfaces
{
    public interface IWalletService
    {
        Task<Wallet> GetWalletByUserIdAsync(int userId);
        Task<decimal> GetWalletBalanceAsync(int userId);
        Task<bool> HasSufficientFundsAsync(int userId, decimal amount);
        Task<TransactionDto> AddFundsAsync(int userId, decimal amount);
        Task<List<TransactionDto>> GetTransactionDtosByUserIdAsync(int userId);
    }
}
