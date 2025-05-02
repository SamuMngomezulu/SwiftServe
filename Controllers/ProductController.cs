using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using SwiftServe.DTOs;
using SwiftServe.Interfaces;
using SwiftServe.Models.Catalogue;
using SwiftServe.Services;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepo;
        private readonly ICategoryRepository _categoryRepo;
        private readonly CloudinaryService _cloudinaryService;
        private readonly IMapper _mapper;

        public ProductsController(
            IProductRepository productRepo,
            ICategoryRepository categoryRepo,
            CloudinaryService cloudinaryService,
            IMapper mapper)
        {
            _productRepo = productRepo;
            _categoryRepo = categoryRepo;
            _cloudinaryService = cloudinaryService;
            _mapper = mapper;
        }

        [Authorize(Roles = "Super User, Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateDto productDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate that the CategoryID exists
            if (!await _categoryRepo.CategoryExistsAsync(productDto.CategoryID))
            {
                var validCategories = await _categoryRepo.GetAllCategoriesAsync();
                return BadRequest(new
                {
                    message = $"Category with ID {productDto.CategoryID} does not exist.",
                    validCategories
                });
            }

            var uploadResult = await _cloudinaryService.AddImageAsync(productDto.ImageFile);
            if (uploadResult.Error != null)
                return BadRequest(new { message = "Image upload failed", error = uploadResult.Error.Message });

            var product = _mapper.Map<Product>(productDto);
            product.ImageURL = uploadResult.SecureUrl.ToString();
            product.ImagePublicID = uploadResult.PublicId;

            await _productRepo.CreateProductAsync(product);

            return CreatedAtAction(nameof(GetProductById), new { id = product.ProductID }, new
            {
                message = "Product created successfully",
                product
            });
        }

        [Authorize(Roles = "Super User, Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductCreateDto productDto)
        {
            var product = await _productRepo.GetProductByIdAsync(id);
            if (product == null)
                return NotFound();

            if (!await _categoryRepo.CategoryExistsAsync(productDto.CategoryID))
            {
                var validCategories = await _categoryRepo.GetAllCategoriesAsync();
                return BadRequest(new
                {
                    message = $"Category with ID {productDto.CategoryID} does not exist.",
                    validCategories
                });
            }

            if (productDto.ImageFile != null)
            {
                if (!string.IsNullOrEmpty(product.ImagePublicID))
                    await _cloudinaryService.DeleteImageAsync(product.ImagePublicID);

                var uploadResult = await _cloudinaryService.AddImageAsync(productDto.ImageFile);
                if (uploadResult.Error != null)
                    return BadRequest(new { message = "Image upload failed", error = uploadResult.Error.Message });

                product.ImageURL = uploadResult.SecureUrl.ToString();
                product.ImagePublicID = uploadResult.PublicId;
            }

            _mapper.Map(productDto, product);
            await _productRepo.UpdateProductAsync(product);

            return Ok(new { message = "Product updated successfully", product });
        }

        [Authorize(Roles = "Super User, Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _productRepo.GetProductByIdAsync(id);
            if (product == null)
                return NotFound();

            if (!string.IsNullOrEmpty(product.ImagePublicID))
                await _cloudinaryService.DeleteImageAsync(product.ImagePublicID);

            var success = await _productRepo.DeleteProductAsync(product);
            if (!success)
                return StatusCode(500, new { message = "Failed to delete product" });

            return Ok(new { message = "Product deleted successfully" });
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productRepo.GetProductByIdAsync(id);
            if (product == null)
                return NotFound(new { message = $"Product with ID {id} not found" });

            return Ok(new
            {
                message = "Product retrieved successfully",
                product
            });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productRepo.GetAllProductsAsync();

            if (!products.Any())
                return Ok(new { message = "No products found", products = Array.Empty<object>() });

            return Ok(new
            {
                message = "Products retrieved successfully",
                products = products.Select(p => new {
                    p.ProductID,
                    p.ProductName,
                    p.ProductDescription,
                    p.ProductPrice,
                    p.ImageURL,
                    p.ProductStockQuantity,
                    p.IsAvailable,
                    Category = p.Category != null ? new
                    {
                        p.Category.CategoryID,
                        p.Category.CategoryName
                    } : null
                }).ToList()
            });
        }
    }
}