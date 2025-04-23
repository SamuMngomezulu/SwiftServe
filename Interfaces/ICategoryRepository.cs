using SwiftServe.Models;
using SwiftServe.Models.Catalogue;

namespace SwiftServe.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category?> GetCategoryByIdAsync(int id);
        Task<Category?> GetCategoryByNameAsync(string name);
        Task<(IEnumerable<Product>, int totalItems)> GetProductsByCategoryAsync(int categoryId, int page, int pageSize);
    }

}
