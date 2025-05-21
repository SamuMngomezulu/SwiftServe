using System.ComponentModel.DataAnnotations;

namespace SwiftServe.Dtos
{
    public class DepositRequestDto
    {
        [Range(0.01, 10000)]
        public decimal Amount { get; set; }
    }
}
