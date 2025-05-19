namespace SwiftServe.Dtos
{
    public class CartItemResponseDto
    {
        public int CartItemID { get; set; }

        public int ProductID { get; set; }
        
        public string ProductName { get; set; }

        public string ImageURL { get; set; }

        public decimal ProductPrice { get; set; }

        public int Quantity { get; set; }

        public DateTime DateAdded { get; set; }

        public decimal LineTotal { get; set; }
    }
}
