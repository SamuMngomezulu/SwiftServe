using System.ComponentModel.DataAnnotations;


namespace SwiftServe.Models.Catalogue
{
    public class Supplier
    {
        [Key]
        public int SupplierID { get; set; }

        [Required]
        [StringLength(50)]
        public string SupplierName { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string ContactEmail { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        public ICollection<ProductSupplier> ProductSuppliers { get; set; }
    }

}
