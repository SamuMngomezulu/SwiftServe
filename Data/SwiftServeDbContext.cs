using Microsoft.EntityFrameworkCore;
using SwiftServe.Models;

namespace SwiftServe.Data
{
    public class SwiftServeDbContext : DbContext
    {
        public SwiftServeDbContext(DbContextOptions<SwiftServeDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Wallet> Wallets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Wallet)
                .WithOne(w => w.User)
                .HasForeignKey<Wallet>(w => w.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithOne(r => r.User)
                .HasForeignKey<Role>(r => r.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserEmail)
                .IsUnique();

            modelBuilder.Entity<Wallet>()
                .Property(w => w.Balance)
                .HasColumnType("decimal(10, 2)");
        }
    }
}