using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using SwiftServe.Data;
using SwiftServe.DTOs;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly test_SwiftServeDbContext _context;
        private readonly IMapper _mapper;

        public CategoriesController(test_SwiftServeDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/categories
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.Categories.ToListAsync();

            return Ok(new
            {
                message = "Categories retrieved successfully",
                categories
            });
        }

        // GET: api/categories/{id}/products?page=1&pageSize=10
        [HttpGet("{id}/products")]
        public async Task<IActionResult> GetProductsByCategory(int id, int page = 1, int pageSize = 10)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            var query = _context.Products
                .Where(p => p.CategoryID == id)
                .Include(p => p.Category)
                .Include(p => p.ProductSuppliers)
                    .ThenInclude(ps => ps.Supplier)
                .AsQueryable();

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            if (products.Count == 0)
            {
                return NotFound(new { message = "No products found in this category." });
            }

            var productDtos = _mapper.Map<List<ProductBrowseDto>>(products);

            return Ok(new
            {
                message = "Products retrieved successfully",
                category = category.CategoryName,
                pagination = new
                {
                    currentPage = page,
                    pageSize,
                    totalItems,
                    totalPages
                },
                products = productDtos
            });
        }
    }
}
