using Microsoft.EntityFrameworkCore;
using SwiftServe.Data;
using SwiftServe.Interfaces;
using SwiftServe.Models.Catalogue;

namespace SwiftServe.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly test_SwiftServeDbContext _context;

        public ProductRepository(test_SwiftServeDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductSuppliers)
                    .ThenInclude(ps => ps.Supplier)
                .ToListAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductSuppliers)
                    .ThenInclude(ps => ps.Supplier)
                .FirstOrDefaultAsync(p => p.ProductID == id);
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> DeleteProductAsync(Product product)
        {
            _context.Products.Remove(product);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ProductExistsAsync(int id)
        {
            return await _context.Products.AnyAsync(p => p.ProductID == id);
        }

        public async Task<bool> CategoryExistsAsync(int categoryId)
        {
            return await _context.Categories.AnyAsync(c => c.CategoryID == categoryId);
        }
    }
}
