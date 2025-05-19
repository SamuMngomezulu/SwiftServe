namespace SwiftServe.Dtos
{
    public class CartResponseDto
    {
        public int CartID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedDate { get; set; }
        public decimal TotalPrice { get; set; }

        public DateTime LastUpdated { get; set; }
        public List<CartItemResponseDto> Items { get; set; } = new List<CartItemResponseDto>();
        public bool IsTotalValid { get; set; }
    }
}
