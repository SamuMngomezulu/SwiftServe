namespace SwiftServe.Dtos
{
    public class CheckoutResultDto
    {
        public bool Success { get; set; }
        public int OrderID { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; }
        public string DeliveryOption { get; set; }
    }
}
