using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SwiftServe.Models.Carts;

namespace SwiftServe.Models.Orders
{
    public enum DeliveryOption
    {
        PickUp = 1,
        Deliver = 2
    }

    public class Order
    {
        [Key]
        public int OrderID { get; set; }

        [Required]
        [ForeignKey("Cart")]
        public int CartID { get; set; }

        [Required]
        [ForeignKey("OrderStatus")]
        public int OrderStatusID { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        // New property added for delivery method
        public DeliveryOption DeliveryOption { get; set; }

        public virtual Cart Cart { get; set; }
        public virtual OrderStatus OrderStatus { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
