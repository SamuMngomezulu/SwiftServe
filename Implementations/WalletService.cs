using Microsoft.EntityFrameworkCore;
using SwiftServe.Data;
using SwiftServe.Interfaces;
using SwiftServe.Models.Users;
using SwiftServe.Models.Orders;
using SwiftServe.Dtos;

namespace SwiftServe.Implementations
{
    public class WalletService : IWalletService
    {
        private readonly test_SwiftServeDbContext _context;

        public WalletService(test_SwiftServeDbContext context)
        {
            _context = context;
        }

        public async Task<Wallet> GetWalletByUserIdAsync(int userId)
        {
            return await _context.Wallets
                .Include(w => w.Transactions)
                    .ThenInclude(t => t.TransactionType)
                .Include(w => w.Transactions)
                    .ThenInclude(t => t.TransactionStatus)
                .Include(w => w.Transactions)
                    .ThenInclude(t => t.Order)
                .FirstOrDefaultAsync(w => w.UserID == userId);
        }

        public async Task<decimal> GetWalletBalanceAsync(int userId)
        {
            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserID == userId);
            return wallet?.Balance ?? 0;
        }

        public async Task<bool> HasSufficientFundsAsync(int userId, decimal amount)
        {
            var balance = await GetWalletBalanceAsync(userId);
            return balance >= amount;
        }

        public async Task<TransactionDto> AddFundsAsync(int userId, decimal amount)
        {
            if (amount <= 0)
                throw new ArgumentException("Amount must be greater than zero");

            var wallet = await GetWalletByUserIdAsync(userId);

            if (wallet == null)
            {
                wallet = new Wallet
                {
                    UserID = userId,
                    Balance = amount
                };
                await _context.Wallets.AddAsync(wallet);
            }
            else
            {
                wallet.Balance += amount;
                _context.Wallets.Update(wallet);
            }

            var transaction = new Transaction
            {
                WalletID = wallet.WalletID,
                TransactionTypeID = 1, // Deposit
                TransactionStatusID = 1, // Completed
                TransactionAmount = amount,
                TransactionDate = DateTime.UtcNow
            };

            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();

            return new TransactionDto
            {
                TransactionID = transaction.TransactionID,
                TransactionAmount = transaction.TransactionAmount,
                TypeName = "Deposit",
                StatusName = "Completed",
                Date = transaction.TransactionDate,
                OrderID = null
            };
        }

        public async Task<Transaction> CreateTransactionAsync(int userId, int orderId, decimal amount)
        {
            var wallet = await GetWalletByUserIdAsync(userId);
            if (wallet == null)
                throw new ArgumentException("Wallet not found");

            var transaction = new Transaction
            {
                WalletID = wallet.WalletID,
                OrderID = orderId,
                TransactionTypeID = 2, // Purchase
                TransactionStatusID = 1, // Completed
                TransactionAmount = amount,
                TransactionDate = DateTime.UtcNow
            };

            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();

            return transaction;
        }

        public async Task<List<TransactionDto>> GetTransactionDtosByUserIdAsync(int userId)
        {
            var wallet = await GetWalletByUserIdAsync(userId);
            if (wallet == null) return new List<TransactionDto>();

            return wallet.Transactions.Select(t => new TransactionDto
            {
                TransactionID = t.TransactionID,
                TransactionAmount = t.TransactionAmount,
                TypeName = t.TransactionType?.TypeName ?? "Unknown",
                StatusName = t.TransactionStatus?.StatusName ?? "Unknown",
                Date = t.TransactionDate,
                OrderID = t.OrderID
            }).ToList();
        }
    }
}
