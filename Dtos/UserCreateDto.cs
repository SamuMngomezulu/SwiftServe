using System.ComponentModel.DataAnnotations;
using Xunit.Sdk;

namespace SwiftServe.Dtos
{
    public class UserCreateDto : UserRegistrationDto
    {
        [Required]
        [Range(1, 3, ErrorMessage = "Role ID must be 1 (Super User), 2 (Admin), or 3 (User)")]
        public int RoleID { get; set; } = 3;
    }
}
