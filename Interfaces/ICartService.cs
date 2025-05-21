using SwiftServe.Models.Carts;
using SwiftServe.Dtos;

namespace SwiftServe.Interfaces
{
    public interface ICartService
    {
        Task<Cart?> GetCartByUserIdAsync(int userId);
        Task<CartItemResponseDto> AddToCartAsync(int userId, AddToCartRequestDto request);
        Task<CartItemResponseDto?> UpdateCartItemAsync(int cartItemId, UpdateCartItemRequestDto request);
        Task<bool> RemoveFromCartAsync(int cartItemId);
        Task<bool> ClearCartAsync(int userId);
        Task<CartResponseDto> GetCartDtoAsync(int userId);
        Task<decimal> GetTotalPriceAsync(int userId);
        Task<bool> ProductExistsInCartAsync(int userId, int productId);

        // Add this method
        Task<CheckoutResultDto> CheckoutAsync(int userId);
    }
}