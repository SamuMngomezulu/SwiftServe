namespace SwiftServe.Dtos
{
    public class OrderDto
    {
        public int OrderID { get; set; }
        public int CartID { get; set; }
        public string StatusName { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string DeliveryOption { get; set; } // "PickUp" or "Deliver"
        public List<CartItemResponseDto> Items { get; set; }
    }
}