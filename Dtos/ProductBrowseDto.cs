using SwiftServe.Models.Catalogue;

namespace SwiftServe.DTOs
{
    public class ProductBrowseDto
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }
        public decimal ProductPrice { get; set; }
        public int ProductStockQuantity { get; set; }
        public bool IsAvailable { get; set; }
        public string ImageURL { get; set; }

        // Optional for display
        public string CategoryName { get; set; }
    }
}
