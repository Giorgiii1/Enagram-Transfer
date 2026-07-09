export interface Account {
  id: string;
  accountHolderName: string;
  balance: number;
}

export interface Transaction {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  timestamp: string;
}

export interface TransferRequest {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
}

export interface ApiErrorResponse {
  error: string;
}

export interface TransferSuccessResponse {
  message: string;
}
