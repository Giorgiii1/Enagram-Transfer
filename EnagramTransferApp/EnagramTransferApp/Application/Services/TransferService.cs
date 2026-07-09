using Microsoft.EntityFrameworkCore;
using EnagramTransferApp.Domain;
using EnagramTransferApp.Infrastructure;
using EnagramTransferApp.Application.DTOs;

namespace EnagramTransferApp.Application.Services;

public class TransferService : ITransferService
{
    private readonly ApplicationDbContext _context;

    public TransferService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> TransferAsync(TransferRequestDto request)
    {
        if (request == null)
        {
            return false;
        }

        if (request.Amount <= 0)
        {
            return false;
        }

        if (request.SourceAccountId == request.DestinationAccountId)
        {
            return false;
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var sourceAccount = await _context.Accounts.FindAsync(request.SourceAccountId);
            var destinationAccount = await _context.Accounts.FindAsync(request.DestinationAccountId);

            if (sourceAccount == null || destinationAccount == null)
            {
                await transaction.RollbackAsync();
                return false;
            }

            if (sourceAccount.Balance < request.Amount)
            {
                await transaction.RollbackAsync();
                return false;
            }

            sourceAccount.Debit(request.Amount);
            destinationAccount.Credit(request.Amount);

            var transferRecord = new Transaction(
                Guid.NewGuid(),
                request.SourceAccountId,
                request.DestinationAccountId,
                request.Amount,
                DateTime.UtcNow
            );

            await _context.Transactions.AddAsync(transferRecord);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            return true;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            return false;
        }
    }
}
