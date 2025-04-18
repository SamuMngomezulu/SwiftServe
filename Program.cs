﻿using Microsoft.EntityFrameworkCore;
using SwiftServe.Data;
using AutoMapper;
using SwiftServe;
using SwiftServe.Mappings;
using Microsoft.Extensions.Configuration;
using SwiftServe.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<test_SwiftServeDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SwiftServeDB")));

builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add Cloudinary configuration
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));

// Register CloudinaryService
builder.Services.AddScoped<CloudinaryService>();

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

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<test_SwiftServeDbContext>();
    db.Database.Migrate();
}

app.Run();