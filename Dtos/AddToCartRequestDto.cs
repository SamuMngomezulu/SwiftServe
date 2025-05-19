using System.ComponentModel.DataAnnotations;

namespace SwiftServe.Dtos
{
    public class AddToCartRequestDto
    {
        public int ProductID { get; set; }

        [Required]
        [Range(1, 100, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }
      
    }
}
