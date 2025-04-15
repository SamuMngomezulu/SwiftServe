using Microsoft.AspNetCore.Mvc;
using SwiftServe.Models;
using SwiftServe.Dtos;
using SwiftServe.Data;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SwiftServe.DTOs.Catalogue;
using SwiftServe.Models.Catalogue;
using System.Text.Json;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly test_SwiftServeDbContext _context;
        private readonly IMapper _mapper;

        public ProductsController(test_SwiftServeDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // POST: api/products
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductCreateDto productCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid product data", errors = ModelState });
            }

            var product = _mapper.Map<Product>(productCreateDto);
            _context.Products.Add(product);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Error saving product", detail = ex.Message });
            }

            return CreatedAtAction(nameof(GetProductById), new { id = product.ProductID }, new
            {
                message = "Product created successfully",
                product
            });
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductSuppliers)
                    .ThenInclude(ps => ps.Supplier)
                .FirstOrDefaultAsync(p => p.ProductID == id);

            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }

            return Ok(new
            {
                message = "Product retrieved successfully",
                product
            });
        }

        // PUT: api/products/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductCreateDto productDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }

            _mapper.Map(productDto, product);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Error updating product", detail = ex.Message });
            }

            return Ok(new
            {
                message = $"Product with ID {id} updated successfully",
                product
            });
        }

        // DELETE: api/products/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }

            _context.Products.Remove(product);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Error deleting product", detail = ex.Message });
            }

            return Ok(new { message = $"Product with ID {id} deleted successfully" });
        }

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductSuppliers)
                    .ThenInclude(ps => ps.Supplier)
                .ToListAsync();

            if (products == null || products.Count == 0)
            {
                return NotFound(new { message = "No products found" });
            }

            var options = new JsonSerializerOptions
            {
                ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve,
                WriteIndented = true
            };

            var json = JsonSerializer.Serialize(new
            {
                message = "Products retrieved successfully",
                products
            }, options);

            return Content(json, "application/json");
        }


    }
}
