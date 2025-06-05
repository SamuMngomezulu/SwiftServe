using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SwiftServe.Data;
using SwiftServe.Dtos;
using SwiftServe.Interfaces;
using SwiftServe.Models.Orders;


namespace SwiftServe.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly test_SwiftServeDbContext _context;
        private readonly IMapper _mapper;
        private readonly IWalletService _walletService;

        public OrderService(
            test_SwiftServeDbContext context,
            IMapper mapper,
            IWalletService walletService)
        {
            _context = context;
            _mapper = mapper;
            _walletService = walletService;
        }

        public async Task<List<OrderDto>> GetUserOrdersAsync(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.Cart)
                    .ThenInclude(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .Include(o => o.OrderStatus)
                .Where(o => o.Cart.UserID == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => MapToOrderDto(o)).ToList();
        }

        public async Task<OrderDto> GetOrderDetailsAsync(int userId, int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.Cart)
                    .ThenInclude(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .Include(o => o.OrderStatus)
                .FirstOrDefaultAsync(o => o.OrderID == orderId && o.Cart.UserID == userId);

            if (order == null)
                return null;

            return MapToOrderDto(order);
        }

        public async Task UpdateOrderStatusAsync(int orderId, int statusId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                throw new ArgumentException("Order not found");

            var statusExists = await _context.OrderStatuses.AnyAsync(s => s.OrderStatusID == statusId);
            if (!statusExists)
                throw new ArgumentException("Invalid status ID");

            order.OrderStatusID = statusId;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task<List<OrderStatusDto>> GetOrderStatusesAsync()
        {
            var statuses = await _context.OrderStatuses.ToListAsync();
            return _mapper.Map<List<OrderStatusDto>>(statuses);
        }

        public async Task CancelOrderAsync(int userId, int orderId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.Orders
                    .Include(o => o.Cart)
                    .Include(o => o.Transactions)
                    .FirstOrDefaultAsync(o => o.OrderID == orderId && o.Cart.UserID == userId);

                if (order == null)
                    throw new ArgumentException("Order not found");

                // Check if order can be canceled (e.g., not already completed or canceled)
                if (order.OrderStatusID == 3 || order.OrderStatusID == 4) // Assuming 3 is Completed, 4 is Canceled
                    throw new InvalidOperationException("Order cannot be canceled in its current state");

                // Refund to wallet
                var transactionRecord = order.Transactions.FirstOrDefault();
                if (transactionRecord != null)
                {
                    await _walletService.AddFundsAsync(userId, transactionRecord.TransactionAmount);
                }

                // Restore product stock
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.CartID == order.CartID);

                foreach (var item in cart.CartItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductID);
                    if (product != null)
                    {
                        product.ProductStockQuantity += item.Quantity;
                        product.IsAvailable = product.ProductStockQuantity > 0;
                        _context.Products.Update(product);
                    }
                }

                // Update order status to Canceled
                order.OrderStatusID = 4; // Assuming 4 is Canceled
                _context.Orders.Update(order);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderStatus)
                .ToListAsync();

            return _mapper.Map<List<OrderDto>>(orders);
        }


        private OrderDto MapToOrderDto(Order order)
        {
            var dto = _mapper.Map<OrderDto>(order);
            dto.StatusName = order.OrderStatus?.StatusName ?? "Unknown";
            dto.DeliveryOption = order.DeliveryOption.ToString();
            dto.Items = _mapper.Map<List<CartItemResponseDto>>(order.Cart.CartItems);

            // Calculate total if not already set
            if (dto.TotalAmount <= 0)
            {
                dto.TotalAmount = order.Cart.CartItems.Sum(ci => ci.Quantity * ci.Product.ProductPrice);
            }

            return dto;
        }
    }
}