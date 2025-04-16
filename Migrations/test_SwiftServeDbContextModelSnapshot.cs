﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SwiftServe.Data;

#nullable disable

namespace SwiftServe.Migrations
{
    [DbContext(typeof(test_SwiftServeDbContext))]
    partial class test_SwiftServeDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("SwiftServe.Models.Catalogue.Category", b =>
                {
                    b.Property<int>("CategoryID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryID"));

                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("CategoryID");

                    b.ToTable("Categories");

                    b.HasData(
                        new
                        {
                            CategoryID = 1,
                            CategoryName = "Drinks"
                        },
                        new
                        {
                            CategoryID = 2,
                            CategoryName = "Meals"
                        },
                        new
                        {
                            CategoryID = 3,
                            CategoryName = "Hot Beverages"
                        },
                        new
                        {
                            CategoryID = 4,
                            CategoryName = "Cold Beverages"
                        },
                        new
                        {
                            CategoryID = 5,
                            CategoryName = "Desserts"
                        },
                        new
                        {
                            CategoryID = 6,
                            CategoryName = "Sides & Snacks"
                        });
                });

            modelBuilder.Entity("SwiftServe.Models.Catalogue.Product", b =>
                {
                    b.Property<int>("ProductID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProductID"));

                    b.Property<int>("CategoryID")
                        .HasColumnType("int");

                    b.Property<string>("ImagePublicID")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ImageURL")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("bit");

                    b.Property<string>("ProductDescription")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("ProductName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<decimal>("ProductPrice")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("ProductStockQuantity")
                        .HasColumnType("int");

                    b.HasKey("ProductID");

                    b.HasIndex("CategoryID");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("SwiftServe.Models.Catalogue.ProductSupplier", b =>
                {
                    b.Property<int>("ProductID")
                        .HasColumnType("int");

                    b.Property<int>("SupplierID")
                        .HasColumnType("int");

                    b.Property<decimal>("PurchasePrice")
                        .HasColumnType("decimal(10, 2)");

                    b.HasKey("ProductID", "SupplierID");

                    b.HasIndex("SupplierID");

                    b.ToTable("ProductSuppliers");
                });

            modelBuilder.Entity("SwiftServe.Models.Catalogue.Supplier", b =>
                {
                    b.Property<int>("SupplierID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SupplierID"));

                    b.Property<string>("ContactEmail")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("SupplierName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("SupplierID");

                    b.ToTable("Suppliers");
                });

            modelBuilder.Entity("SwiftServe.Models.User.User.Role", b =>
                {
                    b.Property<int>("RoleID")
                        .HasColumnType("int");

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("RoleID");

                    b.ToTable("Roles");

                    b.HasData(
                        new
                        {
                            RoleID = 1,
                            RoleName = "Super User"
                        },
                        new
                        {
                            RoleID = 2,
                            RoleName = "Admin"
                        },
                        new
                        {
                            RoleID = 3,
                            RoleName = "User"
                        });
                });

            modelBuilder.Entity("SwiftServe.Models.User.User.User", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserID"));

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<int>("RoleID")
                        .HasColumnType("int");

                    b.Property<string>("UserEmail")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("UserID");

                    b.HasIndex("RoleID");

                    b.HasIndex("UserEmail")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("SwiftServe.Models.User.User.Wallet", b =>
                {
                    b.Property<int>("WalletID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("WalletID"));

                    b.Property<decimal>("Balance")
                        .HasColumnType("decimal(10, 2)");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("WalletID");

                    b.HasIndex("UserID")
                        .IsUnique();

                    b.ToTable("Wallets");
                });

            modelBuilder.Entity("SwiftServe.Models.Catalogue.Product", b =>
                {
                    b.HasOne("SwiftServe.Models.Catalogue.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");
                });

            modelBuilder.Entity("SwiftServe.Models.Catalogue.ProductSupplier", b =>
                {
                    b.HasOne("SwiftServe.Models.Catalogue.Product", "Product")
                        .WithMany("ProductSuppliers")
                        .HasForeignKey("ProductID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SwiftServe.Models.Catalogue.Supplier", "Supplier")
                        .WithMany("ProductSuppliers")
                        .HasForeignKey("SupplierID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Product");

                    b.Navigation("Supplier");
                });

            modelBuilder.Entity("SwiftServe.Models.User.User.User", b =>
                {
                    b.HasOne("SwiftServe.Models.User.User.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("SwiftServe.Models.User.User.Wallet", b =>
                {
                    b.HasOne("SwiftServe.Models.User.User.User", "User")
                        .WithOne("Wallet")
                        .HasForeignKey("SwiftServe.Models.User.User.Wallet", "UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("SwiftServe.Models.Catalogue.Category", b =>
                {
                    b.Navigation("Products");
                });

            modelBuilder.Entity("SwiftServe.Models.Catalogue.Product", b =>
                {
                    b.Navigation("ProductSuppliers");
                });

            modelBuilder.Entity("SwiftServe.Models.Catalogue.Supplier", b =>
                {
                    b.Navigation("ProductSuppliers");
                });

            modelBuilder.Entity("SwiftServe.Models.User.User.User", b =>
                {
                    b.Navigation("Wallet")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
