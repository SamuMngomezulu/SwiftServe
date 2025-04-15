using SwiftServe.Models.Catalogue;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


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

        [Column(TypeName = "decimal(10, 2)")]
        [Range(0.01, 999999.99, ErrorMessage = "Price must be positive.")]
        public decimal ProductPrice { get; set; }

        [StringLength(255)]
        public string ImageURL { get; set; }

        public int ProductStockQuantity { get; set; }

        public bool IsAvailable { get; set; } = true;

        // Foreign Key
        public int CategoryID { get; set; }
        public virtual Category Category { get; set; }

        public ICollection<ProductSupplier> ProductSuppliers { get; set; }
    }

}
