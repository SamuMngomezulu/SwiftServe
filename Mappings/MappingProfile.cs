using AutoMapper;
using SwiftServe.DTOs;
using SwiftServe.Models.Catalogue;

namespace SwiftServe.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ProductCreateDto → Product
            CreateMap<ProductCreateDto, Product>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductName))
                .ForMember(dest => dest.ProductDescription, opt => opt.MapFrom(src => src.ProductDescription))
                .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => src.ProductPrice))
                .ForMember(dest => dest.ProductStockQuantity, opt => opt.MapFrom(src => src.ProductStockQuantity))
                .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(src => src.IsAvailable))
                .ForMember(dest => dest.CategoryID, opt => opt.MapFrom(src => src.CategoryID))
                .ForMember(dest => dest.ImageURL, opt => opt.Ignore())
                .ForMember(dest => dest.ImagePublicID, opt => opt.Ignore());

            // Product → ProductBrowseDto
            CreateMap<Product, ProductBrowseDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName));
        }
    }
}
