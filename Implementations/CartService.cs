using Microsoft.EntityFrameworkCore;
using AutoMapper;
using SwiftServe.Data;
using SwiftServe.Interfaces;
using SwiftServe.Models.Cart;
using SwiftServe.Dtos;


namespace SwiftServe.Implementations
{
    public class CartService : ICartService
    {
        private readonly test_SwiftServeDbContext _context;
        private readonly IMapper _mapper;

        public CartService(test_SwiftServeDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Cart?> GetCartByUserIdAsync(int userId)
        {
            return await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserID == userId && c.IsActive);
        }

        public async Task<CartItemResponseDto> AddToCartAsync(int userId, AddToCartRequestDto request)
        {
            var product = await _context.Products.FindAsync(request.ProductID);
            if (product == null || !product.IsAvailable)
                throw new ArgumentException("Product not available");

            var cart = await GetCartByUserIdAsync(userId) ?? new Cart
            {
                UserID = userId,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            };

            if (cart.CartID == 0)
                _context.Carts.Add(cart);

            var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductID == request.ProductID);
            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductID = request.ProductID,
                    Quantity = request.Quantity,
                    DateAdded = DateTime.UtcNow
                });
            }

            cart.UpdateTotal();
            await _context.SaveChangesAsync();

            return _mapper.Map<CartItemResponseDto>(
                existingItem ?? cart.CartItems.First(ci => ci.ProductID == request.ProductID));
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

            cartItem.Quantity = request.Quantity;
            cartItem.Cart.UpdateTotal();
            await _context.SaveChangesAsync();

            return _mapper.Map<CartItemResponseDto>(cartItem);
        }

        public async Task<bool> RemoveFromCartAsync(int cartItemId)
        {
            var cartItem = await _context.CartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.CartItemID == cartItemId);

            if (cartItem == null) return false;

            _context.CartItems.Remove(cartItem);
            cartItem.Cart.UpdateTotal();
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            var cart = await GetCartByUserIdAsync(userId);
            if (cart == null) return false;

            _context.CartItems.RemoveRange(cart.CartItems);
            cart.UpdateTotal();
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CartResponseDto> GetCartDtoAsync(int userId)
        {
            var cart = await GetCartByUserIdAsync(userId);
            return cart == null
                ? new CartResponseDto { UserID = userId }
                : _mapper.Map<CartResponseDto>(cart);
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
    }
}