namespace SwiftServe.Dtos
{
    public class OrderDto
    {
        public int OrderID { get; set; }
        public int CartID { get; set; }
        public string StatusName { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public List<CartItemResponseDto> Items { get; set; }
    }
}
