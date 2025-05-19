using AutoMapper;
using SwiftServe.Dtos;
using SwiftServe.Models.Cart;

namespace SwiftServe.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
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
                .ForMember(dest => dest.LineTotal, opt => opt.MapFrom(src => src.LineTotal));

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
        }
    }
}