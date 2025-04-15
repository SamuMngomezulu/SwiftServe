using AutoMapper;
using SwiftServe.DTOs;
using SwiftServe.DTOs.Catalogue;
using SwiftServe.Models.Catalogue;

namespace SwiftServe.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Map from DTO to Entity
            CreateMap<ProductCreateDto, Product>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductName))
                .ForMember(dest => dest.ProductDescription, opt => opt.MapFrom(src => src.ProductDescription))
                .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => src.ProductPrice))
                .ForMember(dest => dest.ImageURL, opt => opt.MapFrom(src => src.ImageURL))
                .ForMember(dest => dest.ProductStockQuantity, opt => opt.MapFrom(src => src.ProductStockQuantity))
                .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(src => src.IsAvailable))
                .ForMember(dest => dest.CategoryID, opt => opt.MapFrom(src => src.CategoryID));
                
        }
    }
}
