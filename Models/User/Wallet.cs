using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SwiftServe.Models.Orders;

namespace SwiftServe.Models.Users
{
    public class Wallet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WalletID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Balance { get; set; } = 0;

        // Navigation Properties
        public virtual User User { get; set; }

        // Link to related transactions
        public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
