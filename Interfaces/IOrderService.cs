using SwiftServe.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SwiftServe.Interfaces
{
    public interface IOrderService
    {
        Task<List<OrderDto>> GetUserOrdersAsync(int userId);
        Task<OrderDto> GetOrderDetailsAsync(int userId, int orderId);
        Task UpdateOrderStatusAsync(int orderId, int statusId);
        Task<List<OrderStatusDto>> GetOrderStatusesAsync();
        Task CancelOrderAsync(int userId, int orderId);
    }
}