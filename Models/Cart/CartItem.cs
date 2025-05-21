using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SwiftServe.Models.Catalogue;

namespace SwiftServe.Models.Carts
{
    public class CartItem
    {
        public int CartItemID { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required]
        [ForeignKey("Cart")]
        public int CartID { get; set; }

        [ForeignKey("Product")]
        [Required]
        public int ProductID { get; set; }

        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

        public virtual Cart Cart { get; set; }
        public virtual Product Product { get; set; }

        [NotMapped]
        public decimal LineTotal => Quantity * (Product?.ProductPrice ?? 0);
    }
}