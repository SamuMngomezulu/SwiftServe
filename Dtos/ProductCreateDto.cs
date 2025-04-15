using System.ComponentModel.DataAnnotations;

namespace SwiftServe.DTOs.Catalogue
{
    public class ProductCreateDto
    {
        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(100, ErrorMessage = "Product name cannot exceed 100 characters.")]
        public string ProductName { get; set; } = string.Empty;

        [StringLength(255, ErrorMessage = "Description cannot exceed 255 characters.")]
        public string? ProductDescription { get; set; }

        [Required(ErrorMessage = "Product price is required.")]
        [Range(0.01, 9999999.99, ErrorMessage = "Product price must be between 0.01 and 9,999,999.99.")]
        public decimal ProductPrice { get; set; }

        [StringLength(255, ErrorMessage = "Image URL cannot exceed 255 characters.")]
        [Url(ErrorMessage = "Image URL must be a valid URL.")]
        public string? ImageURL { get; set; }

        [Required(ErrorMessage = "Stock quantity is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative.")]
        public int ProductStockQuantity { get; set; }

        [Required(ErrorMessage = "Availability status must be specified.")]
        public bool IsAvailable { get; set; } = true;

        [Required(ErrorMessage = "CategoryID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "CategoryID must be a valid positive number.")]
        public int CategoryID { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "SupplierID must be a valid positive number.")]
        public int? SupplierID { get; set; }
    }
}
