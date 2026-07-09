using Microsoft.EntityFrameworkCore;
using EnagramTransferApp.Domain;

namespace EnagramTransferApp.Infrastructure;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.AccountHolderName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Balance)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            entity.HasData(
                new Account(Guid.Parse("0190562e-503c-7bf0-aa46-13a5a4dc2c40"), "John Doe", 1000m),
                new Account(Guid.Parse("0190562e-503c-7bf0-aa46-13a5a4dc2c41"), "Jane Smith", 500m),
                new Account(Guid.Parse("0190562e-503c-7bf0-aa46-13a5a4dc2c42"), "Bob Johnson", 0m)
            );
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Amount)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            entity.Property(e => e.Timestamp)
                .IsRequired();

            entity.HasOne<Account>()
                .WithMany()
                .HasForeignKey(t => t.SourceAccountId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<Account>()
                .WithMany()
                .HasForeignKey(t => t.DestinationAccountId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
