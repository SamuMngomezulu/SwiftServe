using System.ComponentModel.DataAnnotations;

namespace SwiftServe.Models.Orders
{
    public class TransactionStatus
    {
        [Key]
        public int TransactionStatusID { get; set; }

        [Required]
        [StringLength(50)]
        public string StatusName { get; set; }
    }
}
