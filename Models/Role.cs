using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwiftServe.Models
{
    public class Role
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RoleID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        [Required]
        [StringLength(50)]
        public string RoleName { get; set; }

        public virtual User User { get; set; }
    }
}