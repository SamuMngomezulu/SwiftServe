using Microsoft.EntityFrameworkCore;
using SwiftServe.Data;
using SwiftServe.Interfaces;
using SwiftServe.Models;
using SwiftServe.Models.Catalogue;

namespace SwiftServe.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly test_SwiftServeDbContext _context;

        public CategoryRepository(test_SwiftServeDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<Category?> GetCategoryByNameAsync(string name)
        {
            return await _context.Categories
                .FirstOrDefaultAsync(c => c.CategoryName.ToLower() == name.ToLower());
        }

        public async Task<(IEnumerable<Product>, int)> GetProductsByCategoryAsync(int categoryId, int page, int pageSize)
        {
            var query = _context.Products
                .Where(p => p.CategoryID == categoryId)
                .Include(p => p.Category)
                .Include(p => p.ProductSuppliers)
                    .ThenInclude(ps => ps.Supplier);

            var totalItems = await query.CountAsync();
            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (products, totalItems);
        }
    }
}


//Mhlaba was here:)