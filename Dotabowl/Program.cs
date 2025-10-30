using Dotabowl.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
//var connectionString = Environment.GetEnvironmentVariable("DefaultConnection")
//                       ?? throw new InvalidOperationException("DefaultConnection not set");

builder.Services.AddDbContext<DotabowlContext>(options =>
    options.UseSqlServer("Server=tcp:dotabowl-server-west-3.database.windows.net,1433;Initial Catalog=DotabowlDB;Persist Security Info=False;User ID=dotabowlAdmin;Password=Pumpkin1;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // your Angular dev URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Run EF Core migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DotabowlContext>();
    db.Database.Migrate();
    Console.WriteLine("Database migrated successfully.");
}

app.UseCors("AllowAngular");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
