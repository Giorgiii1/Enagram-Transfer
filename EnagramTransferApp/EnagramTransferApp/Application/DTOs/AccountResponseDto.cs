namespace EnagramTransferApp.Application.DTOs;

public class AccountResponseDto
{
    public Guid Id { get; set; }
    public string AccountHolderName { get; set; } = string.Empty;
    public decimal Balance { get; set; }
}
