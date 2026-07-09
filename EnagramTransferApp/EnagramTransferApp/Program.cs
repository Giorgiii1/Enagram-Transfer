using Microsoft.EntityFrameworkCore;
using EnagramTransferApp.Application.Services;
using EnagramTransferApp.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer("Server=db;Database=EnagramDb;User Id=sa;Password=YourSecurePassword123!;TrustServerCertificate=True;"));

builder.Services.AddScoped<ITransferService, TransferService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    int retries = 10;
    while (retries > 0)
    {
        try
        {
            context.Database.EnsureCreated();
            break;
        }
        catch (Exception ex)
        {
            retries--;
            Console.WriteLine($"Database connection failed. Retrying... ({10 - retries}/10). Error: {ex.Message}");
            if (retries == 0) throw;
            System.Threading.Thread.Sleep(5000);
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();