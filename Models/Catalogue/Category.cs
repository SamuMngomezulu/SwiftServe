using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SwiftServe.Models.Catalogue
{
    public class Category
    {
        [Key]
        public int CategoryID { get; set; }

        [Required]
        [StringLength(50)]
        public string CategoryName { get; set; }


        [JsonIgnore]
        public ICollection<Product> Products { get; set; }
    }
}
