namespace EnagramTransferApp.Application.DTOs;

public class TransactionResponseDto
{
    public Guid Id { get; set; }
    public Guid SourceAccountId { get; set; }
    public Guid DestinationAccountId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Timestamp { get; set; }
}
