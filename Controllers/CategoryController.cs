using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using SwiftServe.DTOs;
using SwiftServe.Interfaces;

namespace SwiftServe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryController(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryRepository.GetAllCategoriesAsync();

            return Ok(new
            {
                success = true,
                message = "Categories retrieved successfully.",
                data = categories
            });
        }

        [HttpGet("{id}/products")]
        public async Task<IActionResult> GetProductsByCategory(int id, int page = 1, int pageSize = 10)
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(id);

            if (category == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Category not found."
                });
            }

            var (products, totalItems) = await _categoryRepository.GetProductsByCategoryAsync(id, page, pageSize);

            if (!products.Any())
            {
                return Ok(new
                {
                    success = true,
                    message = "No products found in this category.",
                    data = Array.Empty<object>()
                });
            }

            var productDtos = _mapper.Map<List<ProductBrowseDto>>(products);
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            return Ok(new
            {
                success = true,
                message = "Products retrieved successfully.",
                data = new
                {
                    category = category.CategoryName,
                    pagination = new
                    {
                        currentPage = page,
                        pageSize,
                        totalItems,
                        totalPages
                    },
                    products = productDtos
                }
            });
        }
    }
}
