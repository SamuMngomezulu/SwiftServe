using Microsoft.EntityFrameworkCore;
using SwiftServe.Models.User.User;
using SwiftServe.Models.Catalogue;


namespace SwiftServe.Data
{
    public class test_SwiftServeDbContext : DbContext
    {
        public test_SwiftServeDbContext(DbContextOptions<test_SwiftServeDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<ProductSupplier> ProductSuppliers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed predefined roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleID = 1, RoleName = "Super User" },
                new Role { RoleID = 2, RoleName = "Admin" },
                new Role { RoleID = 3, RoleName = "User" }
            );

            // Seed predefined categories
            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryID = 1, CategoryName = "Drinks" },
                new Category { CategoryID = 2, CategoryName = "Meals" },
                new Category { CategoryID = 3, CategoryName = "Hot Beverages" },
                new Category { CategoryID = 4, CategoryName = "Cold Beverages" },
                new Category { CategoryID = 5, CategoryName = "Desserts" },
                new Category { CategoryID = 6, CategoryName = "Sides & Snacks" }
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

            // ProductSupplier many-to-many config
            modelBuilder.Entity<ProductSupplier>()
                .HasKey(ps => new { ps.ProductID, ps.SupplierID });

            modelBuilder.Entity<ProductSupplier>()
                .HasOne(ps => ps.Product)
                .WithMany(p => p.ProductSuppliers)
                .HasForeignKey(ps => ps.ProductID);

            modelBuilder.Entity<ProductSupplier>()
                .HasOne(ps => ps.Supplier)
                .WithMany(s => s.ProductSuppliers)
                .HasForeignKey(ps => ps.SupplierID);
        }
    }
}
