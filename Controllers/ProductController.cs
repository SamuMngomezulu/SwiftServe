using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using SwiftServe.DTOs;
using SwiftServe.Interfaces;
using SwiftServe.Models.Catalogue;
using SwiftServe.Services;
using Microsoft.AspNetCore.Authorization;
using SwiftServe.Dtos;

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
            {
                return BadRequest(new
                {
                    message = "Invalid product data",
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }

            try
            {
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
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error creating product",
                    error = ex.Message
                });
            }
        }

        [Authorize(Roles = "Super User, Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateDto productDto)
        {
            try
            {
                var product = await _productRepo.GetProductByIdAsync(id);
                if (product == null)
                    return NotFound(new { message = $"Product with ID {id} not found" });

                if (!await _categoryRepo.CategoryExistsAsync(productDto.CategoryID))
                {
                    var validCategories = await _categoryRepo.GetAllCategoriesAsync();
                    return BadRequest(new
                    {
                        message = $"Category with ID {productDto.CategoryID} does not exist.",
                        validCategories
                    });
                }

                // Handle image update only if a new image was provided
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

                // Update other properties
                product.ProductName = productDto.ProductName;
                product.ProductDescription = productDto.ProductDescription;
                product.ProductPrice = productDto.ProductPrice;
                product.ProductStockQuantity = productDto.ProductStockQuantity;
                product.IsAvailable = productDto.IsAvailable;
                product.CategoryID = productDto.CategoryID;

                await _productRepo.UpdateProductAsync(product);

                return Ok(new
                {
                    message = "Product updated successfully",
                    product = _mapper.Map<ProductBrowseDto>(product)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error updating product",
                    error = ex.Message
                });
            }
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

        // ProductController.cs - Update GetAllProducts method
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
