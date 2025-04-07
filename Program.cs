using Microsoft.EntityFrameworkCore;
using SwiftServe.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<SwiftServeDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SwiftServeDB")));

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
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SwiftServeDbContext>();
    db.Database.Migrate();
}

app.Run();