using System.ComponentModel.DataAnnotations.Schema;


namespace SwiftServe.Models.Catalogue
{
    public class ProductSupplier
    {
        public int ProductID { get; set; }
        public Product Product { get; set; }

        public int SupplierID { get; set; }
        public Supplier Supplier { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal PurchasePrice { get; set; }
    }

}
