using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SwiftServe.Models.Catalogue;

namespace SwiftServe.Models
{
    public class Supplier
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SupplierID { get; set; }

        [Required]
        [StringLength(100)]
        public string SupplierName { get; set; }

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string ContactEmail { get; set; }

        // Navigation property
        public virtual ICollection<Product> Products { get; set; }
    }
}
