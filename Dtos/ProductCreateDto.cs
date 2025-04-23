using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SwiftServe.DTOs
{
    public class ProductCreateDto
    {
        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(100, ErrorMessage = "Product name cannot exceed 100 characters.")]
        public string ProductName { get; set; }

        [StringLength(255, ErrorMessage = "Description cannot exceed 255 characters.")]
        public string? ProductDescription { get; set; }

        [Required(ErrorMessage = "Price is required.")]
        [Range(0.01, 9999999.99, ErrorMessage = "Price must be greater than 0.01")]
        public decimal ProductPrice { get; set; }

        [Required(ErrorMessage = "Product image is required.")]
        public IFormFile ImageFile { get; set; }

        [Required(ErrorMessage = "Stock quantity is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative.")]
        public int ProductStockQuantity { get; set; }

        [Required(ErrorMessage = "Availability status is required.")]
        public bool IsAvailable { get; set; }

        [Required(ErrorMessage = "Category is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid Category ID.")]
        public int CategoryID { get; set; }
    }
}
