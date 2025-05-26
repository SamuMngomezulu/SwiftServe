using System.ComponentModel.DataAnnotations;

namespace SwiftServe.Models.Orders
{
    public class TransactionType
    {
        [Key]
        public int TransactionTypeID { get; set; }

        [Required]
        [StringLength(50)]
        public string TypeName { get; set; }
    }
}