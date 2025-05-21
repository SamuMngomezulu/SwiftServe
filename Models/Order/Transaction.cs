using SwiftServe.Models.Users;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwiftServe.Models.Orders
{
    public class Transaction
    {
        [Key]
        public int TransactionID { get; set; }

        [Required]
        [ForeignKey("Wallet")]
        public int WalletID { get; set; }

        [ForeignKey("Order")]
        public int? OrderID { get; set; }

        [Required]
        [ForeignKey("TransactionType")]
        public int TransactionTypeID { get; set; }

        [Required]
        [ForeignKey("TransactionStatus")]
        public int TransactionStatusID { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TransactionAmount { get; set; }

        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

        public virtual Wallet Wallet { get; set; }
        public virtual Order Order { get; set; }
        public virtual TransactionType TransactionType { get; set; }
        public virtual TransactionStatus TransactionStatus { get; set; }
    }
}
