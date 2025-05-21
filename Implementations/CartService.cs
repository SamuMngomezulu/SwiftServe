using Microsoft.EntityFrameworkCore;
using AutoMapper;
using SwiftServe.Data;
using SwiftServe.Interfaces;
using SwiftServe.Models.Carts;
using SwiftServe.Models.Orders;
using SwiftServe.Dtos;
using SwiftServe.Models.Catalogue;
using Microsoft.Extensions.Logging;

namespace SwiftServe.Implementations
{
    public class CartService : ICartService
    {
        private readonly test_SwiftServeDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<CartService> _logger;

        public CartService(test_SwiftServeDbContext context, IMapper mapper, ILogger<CartService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Cart?> GetCartByUserIdAsync(int userId)
        {
            return await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserID == userId && c.IsActive);
        }

        private async Task<Cart> EnsureActiveCartAsync(int userId)
        {
            var cart = await GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                cart = new Cart
                {
                    UserID = userId,
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }
            return cart;
        }

        private void UpdateProductStock(Product product, int quantityDelta)
        {
            product.ProductStockQuantity -= quantityDelta;
            if (product.ProductStockQuantity <= 0)
            {
                product.ProductStockQuantity = 0;
                product.IsAvailable = false;
            }
            else
            {
                product.IsAvailable = true;
            }
            _context.Products.Update(product);
        }

        private async Task UpdateAndSaveCartTotal(Cart cart)
        {
            var oldTotal = cart.TotalPrice;
            cart.UpdateTotal();

            _context.Carts.Update(cart);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Updated cart {cart.CartID} total from {oldTotal} to {cart.TotalPrice}");
        }

        public async Task<CartItemResponseDto> AddToCartAsync(int userId, AddToCartRequestDto request)
        {
            if (request.Quantity <= 0)
                throw new ArgumentException("Quantity must be greater than zero");

            var product = await _context.Products.FindAsync(request.ProductID);
            if (product == null || !product.IsAvailable)
                throw new ArgumentException("Product not available");

            if (product.ProductStockQuantity < request.Quantity)
                throw new ArgumentException("Insufficient stock available");

            var cart = await EnsureActiveCartAsync(userId);
            var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductID == request.ProductID);

            if (existingItem != null)
            {
                if (product.ProductStockQuantity < request.Quantity)
                    throw new ArgumentException("Insufficient stock available");

                existingItem.Quantity += request.Quantity;
            }
            else
            {
                existingItem = new CartItem
                {
                    ProductID = request.ProductID,
                    Quantity = request.Quantity,
                    DateAdded = DateTime.UtcNow
                };
                cart.CartItems.Add(existingItem);
            }

            UpdateProductStock(product, request.Quantity);
            await UpdateAndSaveCartTotal(cart);

            return _mapper.Map<CartItemResponseDto>(existingItem);
        }

        public async Task<CartItemResponseDto?> UpdateCartItemAsync(int cartItemId, UpdateCartItemRequestDto request)
        {
            if (request.Quantity <= 0)
                throw new ArgumentException("Quantity must be greater than zero");

            var cartItem = await _context.CartItems
                .Include(ci => ci.Product)
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.CartItemID == cartItemId);

            if (cartItem == null) return null;

            int quantityDifference = request.Quantity - cartItem.Quantity;
            var product = cartItem.Product;

            if (quantityDifference > 0 && product.ProductStockQuantity < quantityDifference)
                throw new ArgumentException("Insufficient stock available");

            cartItem.Quantity = request.Quantity;
            UpdateProductStock(product, quantityDifference);
            await UpdateAndSaveCartTotal(cartItem.Cart);

            return _mapper.Map<CartItemResponseDto>(cartItem);
        }

        public async Task<bool> RemoveFromCartAsync(int cartItemId)
        {
            var cartItem = await _context.CartItems
                .Include(ci => ci.Cart)
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.CartItemID == cartItemId);

            if (cartItem == null) return false;

            var product = cartItem.Product;
            if (product != null)
            {
                UpdateProductStock(product, -cartItem.Quantity);
            }

            var cart = cartItem.Cart;
            _context.CartItems.Remove(cartItem);
            await UpdateAndSaveCartTotal(cart);

            return true;
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            var cart = await GetCartByUserIdAsync(userId);
            if (cart == null) return false;

            foreach (var item in cart.CartItems)
            {
                var product = await _context.Products.FindAsync(item.ProductID);
                if (product != null)
                {
                    UpdateProductStock(product, -item.Quantity);
                }
            }

            _context.CartItems.RemoveRange(cart.CartItems);
            cart.IsActive = true;
            await UpdateAndSaveCartTotal(cart);

            return true;
        }

        public async Task<CartResponseDto> GetCartDtoAsync(int userId)
        {
            var cart = await GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return new CartResponseDto
                {
                    UserID = userId,
                    Items = new List<CartItemResponseDto>(),
                    TotalPrice = 0,
                    IsTotalValid = false
                };
            }

            await UpdateAndSaveCartTotal(cart);
            var dto = _mapper.Map<CartResponseDto>(cart);
            dto.IsTotalValid = dto.Items != null && dto.Items.Count > 0 && dto.TotalPrice > 0;

            return dto;
        }

        public async Task<decimal> GetTotalPriceAsync(int userId)
        {
            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserID == userId && c.IsActive);
            return cart?.TotalPrice ?? 0;
        }

        public async Task<bool> ProductExistsInCartAsync(int userId, int productId)
        {
            var cart = await GetCartByUserIdAsync(userId);
            return cart?.CartItems.Any(ci => ci.ProductID == productId) ?? false;
        }

        public async Task<CheckoutResultDto> CheckoutAsync(int userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var cart = await GetCartByUserIdAsync(userId);
                if (cart == null || !cart.CartItems.Any())
                    throw new ArgumentException("Cart is empty");

                // Force total recalculation before checkout
                await UpdateAndSaveCartTotal(cart);

                var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserID == userId);
                if (wallet == null || wallet.Balance < cart.TotalPrice)
                    throw new ArgumentException("Insufficient wallet balance");

                foreach (var item in cart.CartItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductID);
                    if (product == null || !product.IsAvailable || product.ProductStockQuantity < item.Quantity)
                    {
                        throw new InvalidOperationException($"Product {product?.ProductName ?? item.ProductID.ToString()} is not available in the requested quantity.");
                    }
                }

                var order = new Order
                {
                    CartID = cart.CartID,
                    OrderStatusID = 1, // Processing
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = cart.TotalPrice
                };
                _context.Orders.Add(order);

                wallet.Balance -= cart.TotalPrice;
                _context.Wallets.Update(wallet);

                var transactionRecord = new Transaction
                {
                    WalletID = wallet.WalletID,
                    Order = order,
                    TransactionTypeID = 2, // Purchase
                    TransactionStatusID = 1, // Completed
                    TransactionAmount = cart.TotalPrice,
                    TransactionDate = DateTime.UtcNow
                };
                _context.Transactions.Add(transactionRecord);

                cart.IsActive = false;
                _context.Carts.Update(cart);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new CheckoutResultDto
                {
                    Success = true,
                    OrderID = order.OrderID,
                    TotalAmount = order.TotalAmount,
                    OrderStatus = "Processing"
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}