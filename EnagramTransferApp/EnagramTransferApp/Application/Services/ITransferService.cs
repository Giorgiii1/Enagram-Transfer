using EnagramTransferApp.Application.DTOs;

namespace EnagramTransferApp.Application.Services;

public interface ITransferService
{
    Task<bool> TransferAsync(TransferRequestDto request);
}
