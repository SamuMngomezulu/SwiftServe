using System.ComponentModel.DataAnnotations;

namespace SwiftServe.Dtos
{
    public class UpdateCartItemRequestDto
    {
        [Range(1, 100)]
        public int Quantity { get; set; }
    }
}
