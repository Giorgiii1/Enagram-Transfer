namespace EnagramTransferApp.Domain;

public class Account
{
    private decimal _balance;

    public Guid Id { get; private set; }
    public string AccountHolderName { get; private set; } = string.Empty;

    public decimal Balance
    {
        get => _balance;
        private set
        {
            if (value < 0)
            {
                throw new ArgumentException("Balance cannot be negative.", nameof(value));
            }
            _balance = value;
        }
    }

    private Account() { }

    public Account(Guid id, string accountHolderName, decimal initialBalance)
    {
        if (string.IsNullOrWhiteSpace(accountHolderName))
        {
            throw new ArgumentException("Account holder name cannot be empty.", nameof(accountHolderName));
        }

        Id = id;
        AccountHolderName = accountHolderName;
        Balance = initialBalance;
    }

    public void Credit(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Credit amount must be positive.", nameof(amount));
        }
        Balance += amount;
    }

    public void Debit(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Debit amount must be positive.", nameof(amount));
        }
        if (Balance - amount < 0)
        {
            throw new InvalidOperationException("Insufficient funds. Balance cannot be negative.");
        }
        Balance -= amount;
    }
}
