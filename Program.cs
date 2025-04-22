using Microsoft.EntityFrameworkCore;
using SwiftServe.Data;
using AutoMapper;
using SwiftServe;
using SwiftServe.Mappings;
using Microsoft.Extensions.Configuration;
using SwiftServe.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure DB Context
builder.Services.AddDbContext<test_SwiftServeDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SwiftServeDB")));

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add Cloudinary configuration
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));

// Register CloudinaryService
builder.Services.AddScoped<CloudinaryService>();

builder.Services.AddScoped<JwtService>();


// Add Authentication services for JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
        };
    });

// Add Authorization with Role-based policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SuperUser", policy => policy.RequireRole("Super User"));
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("User", policy => policy.RequireRole("User"));
});

// Add controllers and other necessary services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable Swagger in Development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use Authentication and Authorization middleware
app.UseAuthentication();  // Ensure Authentication is used first
app.UseAuthorization();   // Then Authorization

app.UseHttpsRedirection();

app.MapControllers();

// Apply database migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<test_SwiftServeDbContext>();
    db.Database.Migrate();
}

app.Run();
