namespace EnagramTransferApp.Domain;

public class Transaction
{
    public Guid Id { get; private set; }
    public Guid SourceAccountId { get; private set; }
    public Guid DestinationAccountId { get; private set; }
    public decimal Amount { get; private set; }
    public DateTime Timestamp { get; private set; }

    private Transaction() { }

    public Transaction(Guid id, Guid sourceAccountId, Guid destinationAccountId, decimal amount, DateTime timestamp)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Transaction amount must be positive.", nameof(amount));
        }
        if (sourceAccountId == destinationAccountId)
        {
            throw new ArgumentException("Source and destination accounts must be different.", nameof(destinationAccountId));
        }

        Id = id;
        SourceAccountId = sourceAccountId;
        DestinationAccountId = destinationAccountId;
        Amount = amount;
        Timestamp = timestamp;
    }
}
