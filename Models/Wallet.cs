using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwiftServe.Models
{
    public class Wallet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WalletID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal Balance { get; set; } = 0;


        //FK Navigation
        public virtual User User { get; set; }
    }
}
