using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SwiftServe.Models.Catalogue;

namespace SwiftServe.Models.Catalogue
{
    public class Product
    {
        [Key]
        public int ProductID { get; set; }

        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(100, ErrorMessage = "Product name cannot exceed 100 characters.")]
        public string ProductName { get; set; }

        [StringLength(255, ErrorMessage = "Description cannot exceed 255 characters.")]
        public string? ProductDescription { get; set; }

        [Required(ErrorMessage = "Product price is required.")]
        [Range(0.01, 10000.00, ErrorMessage = "Price must be between 0.01 and 10,000.")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ProductPrice { get; set; }

        [StringLength(255, ErrorMessage = "Image public ID is too long.")]
        public string ImagePublicID { get; set; }

        [Url(ErrorMessage = "Image URL must be a valid URL.")]
        public string ImageURL { get; set; }

        [Required(ErrorMessage = "Stock quantity is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity must be zero or more.")]
        public int ProductStockQuantity { get; set; }

        [Required(ErrorMessage = "Product availability must be specified.")]
        public bool IsAvailable { get; set; }

        [Required(ErrorMessage = "Category ID is required.")]
        [ForeignKey("Category")]
        public int CategoryID { get; set; }


        // Navigation properties
        public virtual Category Category { get; set; }
        public virtual ICollection<ProductSupplier> ProductSuppliers { get; set; }
    }
}