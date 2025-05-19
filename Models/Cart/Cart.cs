using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SwiftServe.Models.Users;

namespace SwiftServe.Models.Cart
{
    public class Cart
    {
        [Key]
        public int CartID { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; private set; }

        public DateTime LastUpdated { get; private set; }

        [ForeignKey("User")]
        [Required]
        public int UserID { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

        [NotMapped]
        public decimal CalculatedTotal =>
            CartItems?.Sum(ci => ci.Quantity * ci.Product?.ProductPrice ?? 0) ?? 0;

        public void UpdateTotal()
        {
            TotalPrice = CalculatedTotal;
            LastUpdated = DateTime.UtcNow;
        }

        public bool VerifyTotal() => Math.Abs(TotalPrice - CalculatedTotal) < 0.01m;
    }
}