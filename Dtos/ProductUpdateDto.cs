using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SwiftServe.Dtos
{
    public class ProductUpdateDto
    {
        [Required]
        public string ProductName { get; set; }

        public string? ProductDescription { get; set; }

        [Required]
        [Range(0.01, 10000.00)]
        public decimal ProductPrice { get; set; }

        public IFormFile? ImageFile { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int ProductStockQuantity { get; set; }

        [Required]
        public bool IsAvailable { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int CategoryID { get; set; }
    }
}