using System.ComponentModel.DataAnnotations;
using Castle.Components.DictionaryAdapter;

namespace SwiftServe.Models.Orders
{
    public class OrderStatus
    {
 
        public int OrderStatusID { get; set; }

        [Required]
        [StringLength(50)]
        public string StatusName { get; set; } = string.Empty;
    }
}
