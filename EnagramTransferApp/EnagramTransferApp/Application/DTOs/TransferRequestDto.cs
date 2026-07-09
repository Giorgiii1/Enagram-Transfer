namespace EnagramTransferApp.Application.DTOs;

public record TransferRequestDto(Guid SourceAccountId, Guid DestinationAccountId, decimal Amount);
