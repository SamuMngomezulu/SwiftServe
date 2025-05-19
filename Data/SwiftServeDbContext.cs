using Microsoft.EntityFrameworkCore;
using SwiftServe.Models.Users;
using SwiftServe.Models.Catalogue;
using SwiftServe.Models.Cart;


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

        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

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

            // Cart and CartItem configuration
            modelBuilder.Entity<Cart>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // Cart-CartItem one-to-many
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Cart)
                .WithMany(c => c.CartItems)
                .HasForeignKey(ci => ci.CartID)
                .OnDelete(DeleteBehavior.Cascade);

            // CartItem-Product many-to-one
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Product)
                .WithMany()
                .HasForeignKey(ci => ci.ProductID)
                .OnDelete(DeleteBehavior.Restrict);

            // Set primary key for CartItem
            modelBuilder.Entity<CartItem>()
                .HasKey(ci => ci.CartItemID);

            // Index for active carts
            modelBuilder.Entity<Cart>()
                .HasIndex(c => new { c.UserID, c.IsActive })
                .HasFilter("[IsActive] = 1");
        }
    }

}
