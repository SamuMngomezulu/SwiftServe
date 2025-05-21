using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SwiftServe.Dtos
{
    public class CartItemResponseDto
    {
        public int CartItemID { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ImageURL { get; set; }
        public decimal ProductPrice { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        public DateTime DateAdded { get; set; }
        public decimal LineTotal { get; set; }
    }
}