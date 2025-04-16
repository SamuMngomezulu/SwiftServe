using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SwiftServe.Models.Catalogue;

namespace SwiftServe.Models.Catalogue
{
    public class Product
    {
        [Key]
        public int ProductID { get; set; }

        [Required]
        [StringLength(100)]
        public string ProductName { get; set; }

        [StringLength(255)]
        public string ProductDescription { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ProductPrice { get; set; }

        public string ImagePublicID { get; set; } // Stores Cloudinary public ID
        public string ImageURL { get; set; }      // Stores Cloudinary URL

        [Required]
        public int ProductStockQuantity { get; set; }

        [Required]
        public bool IsAvailable { get; set; } 

        [ForeignKey("Category")]
        public int CategoryID { get; set; }

        // Navigation properties
        public virtual Category Category { get; set; }
        public virtual ICollection<ProductSupplier> ProductSuppliers { get; set; }
    }
}