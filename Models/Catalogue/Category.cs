using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SwiftServe.Models.Catalogue
{
    public class Category
    {
        [Key]
        public int CategoryID { get; set; }

        [Required]
        [StringLength(50)]
        public string CategoryName { get; set; }

        public ICollection<Product> Products { get; set; }
    }
}
