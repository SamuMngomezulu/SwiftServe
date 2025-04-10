using System.ComponentModel.DataAnnotations;

namespace SwiftServe.Dtos
{
    public class RoleUpdateDto
    {
        [Required(ErrorMessage = "Role ID is required")]
        [Range(1, 3, ErrorMessage = "Role ID must be 1 (Super User), 2 (Admin), or 3 (User)")]
        public int RoleID { get; set; }
    }
}