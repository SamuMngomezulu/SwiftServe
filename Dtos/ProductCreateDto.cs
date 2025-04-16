using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SwiftServe.DTOs
{
    public class ProductCreateDto
    {
        [Required]
        [StringLength(100)]
        public string ProductName { get; set; }

        [StringLength(255)]
        public string ProductDescription { get; set; }

        [Required]
        [Range(0.01, 9999999.99)]
        public decimal ProductPrice { get; set; }

        [Required]
        public IFormFile ImageFile { get; set; } // Changed from ImageURL to ImageFile

        [Required]
        [Range(0, int.MaxValue)]
        public int ProductStockQuantity { get; set; }

        [Required]
        public bool IsAvailable { get; set; } 

        [Required]
        public int CategoryID { get; set; }
    }
}