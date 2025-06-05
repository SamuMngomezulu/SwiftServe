using System.ComponentModel.DataAnnotations;
using Xunit.Sdk;

namespace SwiftServe.Dtos
{
    public class UserUpdateDto
    {
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string? FirstName { get; set; }

        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public string? LastName { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string? Email { get; set; }

        [Range(1, 3, ErrorMessage = "Role ID must be 1 (Super User), 2 (Admin), or 3 (User)")]
        public int? RoleID { get; set; }
    }
}
