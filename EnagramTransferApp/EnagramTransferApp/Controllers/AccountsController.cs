using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EnagramTransferApp.Application.DTOs;
using EnagramTransferApp.Application.Services;
using EnagramTransferApp.Infrastructure;

namespace EnagramTransferApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITransferService _transferService;

    public AccountsController(ApplicationDbContext context, ITransferService transferService)
    {
        _context = context;
        _transferService = transferService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AccountResponseDto>>> GetAccounts()
    {
        var accounts = await _context.Accounts
            .Select(a => new AccountResponseDto
            {
                Id = a.Id,
                AccountHolderName = a.AccountHolderName,
                Balance = a.Balance
            })
            .ToListAsync();
            
        return Ok(accounts);
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetTransactions()
    {
        var transactions = await _context.Transactions
            .OrderByDescending(t => t.Timestamp)
            .Select(t => new TransactionResponseDto
            {
                Id = t.Id,
                SourceAccountId = t.SourceAccountId,
                DestinationAccountId = t.DestinationAccountId,
                Amount = t.Amount,
                Timestamp = t.Timestamp
            })
            .ToListAsync();
            
        return Ok(transactions);
    }

    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer([FromBody] TransferRequestDto request)
    {
        if (request == null)
        {
            return BadRequest(new { Error = "Invalid transfer request." });
        }

        if (request.Amount <= 0)
        {
            return BadRequest(new { Error = "Transfer amount must be greater than zero." });
        }

        if (request.SourceAccountId == request.DestinationAccountId)
        {
            return BadRequest(new { Error = "Source and destination accounts must be different." });
        }

        bool success = await _transferService.TransferAsync(request);

        if (!success)
        {
            return BadRequest(new { Error = "Transfer failed. Please check that both accounts exist and the source account has sufficient funds." });
        }

        return Ok(new { Message = "Transfer completed successfully." });
    }
}
