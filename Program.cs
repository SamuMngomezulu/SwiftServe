using Microsoft.EntityFrameworkCore;
using SwiftServe.Data;
using AutoMapper;
using SwiftServe;
using SwiftServe.Mappings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<test_SwiftServeDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SwiftServeDB")));

builder.Services.AddAutoMapper(typeof(MappingProfile)); // 💡 Register it here

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
//app.UseAuthorization(); // Temporarily disabled

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<test_SwiftServeDbContext>();
    db.Database.Migrate();
}

app.Run();
