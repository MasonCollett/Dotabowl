using Dotabowl.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // your Angular dev URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
var connectionString = Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING")!
                       ?? Environment.GetEnvironmentVariable("DB_CONNECTION");

using var connection = new SqlConnection(connectionString);
connection.Open();

builder.Services.AddDbContext<DotabowlContext>(options =>
    options.UseSqlServer(connectionString));// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowAngular");

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://*:{port}");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<DotabowlContext>();
        db.Database.Migrate(); // creates all tables automatically
        Console.WriteLine("Database migrated successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database migration failed: {ex.Message}");
        throw; // optional, so the app still crashes if migration fails
    }
}

app.Run();
