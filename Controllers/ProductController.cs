using Microsoft.AspNetCore.Mvc;
using SwiftServe.Models;
using SwiftServe.DTOs;
using SwiftServe.Data;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SwiftServe.Services;
using Microsoft.AspNetCore.Http;
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
        private readonly CloudinaryService _cloudinaryService;

        public ProductsController(
            test_SwiftServeDbContext context,
            IMapper mapper,
            CloudinaryService cloudinaryService)
        {
            _context = context;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateDto productCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Upload image to Cloudinary
            var uploadResult = await _cloudinaryService.AddImageAsync(productCreateDto.ImageFile);
            if (uploadResult.Error != null)
            {
                return BadRequest(new { message = "Image upload failed", error = uploadResult.Error.Message });
            }

            var product = _mapper.Map<Product>(productCreateDto);
            product.ImageURL = uploadResult.SecureUrl.ToString();
            product.ImagePublicID = uploadResult.PublicId;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById),
                new { id = product.ProductID },
                new { message = "Product created successfully", product });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductCreateDto productDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // If new image provided
            if (productDto.ImageFile != null)
            {
                // Delete old image if exists
                if (!string.IsNullOrEmpty(product.ImagePublicID))
                {
                    await _cloudinaryService.DeleteImageAsync(product.ImagePublicID);
                }

                // Upload new image
                var uploadResult = await _cloudinaryService.AddImageAsync(productDto.ImageFile);
                if (uploadResult.Error != null)
                {
                    return BadRequest(new { message = "Image upload failed", error = uploadResult.Error.Message });
                }

                product.ImageURL = uploadResult.SecureUrl.ToString();
                product.ImagePublicID = uploadResult.PublicId;
            }

            _mapper.Map(productDto, product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product updated successfully", product });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // Delete image from Cloudinary if exists
            if (!string.IsNullOrEmpty(product.ImagePublicID))
            {
                await _cloudinaryService.DeleteImageAsync(product.ImagePublicID);
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product deleted successfully" });
        }

        // ... keep your existing Get methods unchanged ...

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