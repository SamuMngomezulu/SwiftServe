using System.Text.Json.Serialization;

namespace SwiftServe.Dtos
{
    public class CartResponseDto
    {
        public int CartID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedDate { get; set; }

        [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
        public decimal TotalPrice { get; set; }
        public DateTime LastUpdated { get; set; }

        public List<CartItemResponseDto> Items { get; set; } = new();
        public bool IsTotalValid { get; set; }
    }
}