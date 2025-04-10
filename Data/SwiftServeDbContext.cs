using Microsoft.EntityFrameworkCore;
using SwiftServe.Models;

namespace SwiftServe.Data
{
    public class test_SwiftServeDbContext : DbContext
    {
        public test_SwiftServeDbContext(DbContextOptions<test_SwiftServeDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Wallet> Wallets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed predefined roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleID = 1, RoleName = "Super User" },
                new Role { RoleID = 2, RoleName = "Admin" },
                new Role { RoleID = 3, RoleName = "User" }
            );

            // User-Wallet one-to-one
            modelBuilder.Entity<User>()
                .HasOne(u => u.Wallet)
                .WithOne(w => w.User)
                .HasForeignKey<Wallet>(w => w.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // User-Role many-to-one
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany()
                .HasForeignKey(u => u.RoleID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserEmail)
                .IsUnique();

            modelBuilder.Entity<Wallet>()
                .Property(w => w.Balance)
                .HasColumnType("decimal(10, 2)");
        }
    }
}
