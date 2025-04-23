using SwiftServe.Models.Catalogue;

namespace SwiftServe.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product> CreateProductAsync(Product product);
        Task<Product> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(Product product);
        Task<bool> ProductExistsAsync(int id);
        Task<bool> CategoryExistsAsync(int categoryId);
    }
}
