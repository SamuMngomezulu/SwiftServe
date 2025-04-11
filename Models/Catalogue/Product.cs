using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwiftServe.Models.Catalogue
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductID { get; set; }

        [Required]
        [StringLength(100)]
        public string ProductName { get; set; }

        [StringLength(255)]
        public string ProductDescription { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal ProductPrice { get; set; }

        [Required]
        public int ProductStockQuantity { get; set; }

        public string? ImageUrl { get; set; }

        public bool IsAvailable { get; set; } = false;

        // Foreign Keys
        [ForeignKey("Category")]
        public int CategoryID { get; set; }

        [ForeignKey("Supplier")]
        public int SupplierID { get; set; }

        // Navigation Properties
        public virtual Category Category { get; set; }
        public virtual Supplier Supplier { get; set; }

    }
}
