using AutoMapper;
using SwiftServe.Dtos;
using SwiftServe.DTOs;
using SwiftServe.Models.Carts;
using SwiftServe.Models.Catalogue;
using SwiftServe.Models.Orders;
using SwiftServe.Models.Users;

namespace SwiftServe.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Product mappings
            CreateMap<ProductCreateDto, Product>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductName))
                .ForMember(dest => dest.ProductDescription, opt => opt.MapFrom(src => src.ProductDescription))
                .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => src.ProductPrice))
                .ForMember(dest => dest.ProductStockQuantity, opt => opt.MapFrom(src => src.ProductStockQuantity))
                .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(src => src.IsAvailable))
                .ForMember(dest => dest.CategoryID, opt => opt.MapFrom(src => src.CategoryID))
                .ForMember(dest => dest.ImageURL, opt => opt.Ignore())
                .ForMember(dest => dest.ImagePublicID, opt => opt.Ignore());

            CreateMap<Product, ProductBrowseDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName));

            CreateMap<ProductUpdateDto, Product>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductName))
                .ForMember(dest => dest.ProductDescription, opt => opt.MapFrom(src => src.ProductDescription))
                .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => src.ProductPrice))
                .ForMember(dest => dest.ProductStockQuantity, opt => opt.MapFrom(src => src.ProductStockQuantity))
                .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(src => src.IsAvailable))
                .ForMember(dest => dest.CategoryID, opt => opt.MapFrom(src => src.CategoryID))
                .ForMember(dest => dest.ImageURL, opt => opt.Ignore())
                .ForMember(dest => dest.ImagePublicID, opt => opt.Ignore());

            // Cart mappings
            CreateMap<Cart, CartResponseDto>()
                .ForMember(dest => dest.CartID, opt => opt.MapFrom(src => src.CartID))
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => src.UserID))
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems));

            CreateMap<CartItem, CartItemResponseDto>()
                .ForMember(dest => dest.CartItemID, opt => opt.MapFrom(src => src.CartItemID))
                .ForMember(dest => dest.ProductID, opt => opt.MapFrom(src => src.ProductID))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
                .ForMember(dest => dest.ImageURL, opt => opt.MapFrom(src => src.Product.ImageURL))
                .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => src.Product.ProductPrice))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.LineTotal, opt => opt.MapFrom(src => src.Quantity * src.Product.ProductPrice));

            CreateMap<AddToCartRequestDto, CartItem>()
                .ForMember(dest => dest.ProductID, opt => opt.MapFrom(src => src.ProductID))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.DateAdded, opt => opt.Ignore())
                .ForMember(dest => dest.Cart, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            CreateMap<UpdateCartItemRequestDto, CartItem>()
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.CartItemID, opt => opt.Ignore())
                .ForMember(dest => dest.ProductID, opt => opt.Ignore())
                .ForMember(dest => dest.DateAdded, opt => opt.Ignore())
                .ForMember(dest => dest.Cart, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            // Wallet mappings
            CreateMap<Wallet, WalletDto>()
                .ForMember(dest => dest.WalletID, opt => opt.MapFrom(src => src.WalletID))
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => src.UserID))
                .ForMember(dest => dest.Balance, opt => opt.MapFrom(src => src.Balance))
                .ForMember(dest => dest.Transactions, opt => opt.MapFrom(src => src.Transactions));

            CreateMap<Transaction, TransactionDto>()
                .ForMember(dest => dest.TransactionID, opt => opt.MapFrom(src => src.TransactionID))
                .ForMember(dest => dest.TransactionAmount, opt => opt.MapFrom(src => src.TransactionAmount))
                .ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => src.TransactionType.TypeName))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.TransactionStatus.StatusName))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.TransactionDate))
                .ForMember(dest => dest.OrderID, opt => opt.MapFrom(src => src.OrderID));

            // Order mappings
            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.OrderID, opt => opt.MapFrom(src => src.OrderID))
                .ForMember(dest => dest.CartID, opt => opt.MapFrom(src => src.CartID))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.OrderStatus.StatusName))
                .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => src.OrderDate))
                .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.TotalAmount))
                .ForMember(dest => dest.DeliveryOption, opt => opt.MapFrom(src => src.DeliveryOption.ToString()))
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Cart.CartItems));

            CreateMap<OrderStatus, OrderStatusDto>()
                .ForMember(dest => dest.OrderStatusID, opt => opt.MapFrom(src => src.OrderStatusID))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.StatusName));

            // Checkout result mapping
            CreateMap<CheckoutResultDto, CheckoutResultDto>(); // Identity mapping for DTO to DTO

            
        }
    }
}