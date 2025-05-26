using Microsoft.EntityFrameworkCore;
using SwiftServe.Data;
using SwiftServe.Dtos;
using SwiftServe.Interfaces;
using SwiftServe.Models.Orders;
using SwiftServe.Models.Users;


namespace SwiftServe.Implementations
{
    public class WalletService : IWalletService
    {
        private readonly test_SwiftServeDbContext _context;

        public WalletService(test_SwiftServeDbContext context)
        {
            _context = context;
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

            var wallet = await GetWalletWithTransactions(userId);

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
                TransactionStatusID = 2, // Completed
                TransactionAmount = amount,
                TransactionDate = DateTime.UtcNow
            };

            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();

            return MapToTransactionDto(transaction);
        }

        public async Task<Transaction> CreatePurchaseTransactionAsync(int userId, int orderId, decimal amount)
        {
            var wallet = await GetWalletWithTransactions(userId);
            if (wallet == null)
                throw new ArgumentException("Wallet not found");

            // Verify sufficient funds first
            if (!await HasSufficientFundsAsync(userId, amount))
                throw new InvalidOperationException("Insufficient funds");

            var transaction = new Transaction
            {
                WalletID = wallet.WalletID,
                OrderID = orderId,
                TransactionTypeID = 2, // Purchase
                TransactionStatusID = 1, // Pending
                TransactionAmount = amount,
                TransactionDate = DateTime.UtcNow
            };

            // Deduct balance immediately for purchase
            wallet.Balance -= amount;
            _context.Wallets.Update(wallet);

            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();

            return transaction;
        }

        public async Task<List<TransactionDto>> GetTransactionHistoryAsync(int userId)
        {
            var wallet = await GetWalletWithTransactions(userId);
            if (wallet == null) return new List<TransactionDto>();

            return wallet.Transactions
                .Select(MapToTransactionDto)
                .ToList();
        }

        public async Task<List<TransactionDto>> GetDepositHistoryAsync(int userId)
        {
            var wallet = await GetWalletWithTransactions(userId);
            if (wallet == null) return new List<TransactionDto>();

            return wallet.Transactions
                .Where(t => t.TransactionTypeID == 1) // Deposit transactions
                .Select(MapToTransactionDto)
                .ToList();
        }

        public async Task<List<TransactionDto>> GetPurchaseHistoryAsync(int userId)
        {
            var wallet = await GetWalletWithTransactions(userId);
            if (wallet == null) return new List<TransactionDto>();

            return wallet.Transactions
                .Where(t => t.TransactionTypeID == 2) // Purchase transactions
                .Select(MapToTransactionDto)
                .ToList();
        }

        private async Task<Wallet> GetWalletWithTransactions(int userId)
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

        private TransactionDto MapToTransactionDto(Transaction transaction)
        {
            return new TransactionDto
            {
                TransactionID = transaction.TransactionID,
                TransactionAmount = transaction.TransactionAmount,
                TypeName = transaction.TransactionType?.TypeName ?? "Unknown",
                StatusName = transaction.TransactionStatus?.StatusName ?? "Unknown",
                Date = transaction.TransactionDate,
                OrderID = transaction.OrderID
            };
        }
    }
}