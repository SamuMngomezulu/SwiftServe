using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwiftServe.Models.Users

{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string UserEmail { get; set; }

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; }

        [ForeignKey("Role")]
        public int RoleID { get; set; } = 3; // Default to "User" role

        // Navigation properties
        public virtual Role Role { get; set; }
        public virtual Wallet Wallet { get; set; }
    }
}
