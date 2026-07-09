import React, { useState, useEffect } from 'react';
import { Send, ArrowRightLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Account, TransferRequest } from '../types';
import { AxiosError } from 'axios';

interface TransferFormProps {
  accounts: Account[];
  onTransferSuccess: (payload: TransferRequest) => Promise<void>;
}

export default function TransferForm({
  accounts,
  onTransferSuccess,
}: TransferFormProps): React.JSX.Element {
  const [sourceId, setSourceId] = useState<string>('');
  const [destinationId, setDestinationId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!sourceId || !destinationId) {
      setError('Please select both source and destination accounts.');
      return;
    }

    if (sourceId === destinationId) {
      setError('Source and destination accounts must be different.');
      return;
    }

    const numericAmount: number = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid transfer amount greater than zero.');
      return;
    }

    const sourceAccount: Account | undefined = accounts.find(a => a.id === sourceId);
    if (sourceAccount && sourceAccount.balance < numericAmount) {
      setError(`Insufficient funds. ${sourceAccount.accountHolderName} only has $${sourceAccount.balance.toFixed(2)}.`);
      return;
    }

    setLoading(true);
    try {
      await onTransferSuccess({
        sourceAccountId: sourceId,
        destinationAccountId: destinationId,
        amount: numericAmount,
      });
      setMessage('Transfer completed successfully!');
      setAmount('');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || err.message || 'Transfer failed. Check connection.');
      } else if (err instanceof Error) {
        setError(err.message || 'Transfer failed. Check connection.');
      } else {
        setError('Transfer failed. Check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-slate-950/45 rounded-2xl p-6 border border-slate-800/80 shadow-glow-purple">
      <h2 className="text-xl font-semibold font-display text-slate-100 mb-6 flex items-center gap-2">
        <ArrowRightLeft className="w-5 h-5 text-purple-400" />
        Transfer Funds
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Source Account
          </label>
          <select
            value={sourceId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSourceId(e.target.value)}
            className="w-full bg-slate-900/85 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          >
            <option value="">-- Select Source Account --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountHolderName} (${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center -my-2">
          <div className="bg-purple-500/10 border border-purple-500/25 text-purple-400 p-2 rounded-full shadow-lg">
            <ArrowRightLeft className="w-4 h-4 rotate-90" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Destination Account
          </label>
          <select
            value={destinationId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDestinationId(e.target.value)}
            className="w-full bg-slate-900/85 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          >
            <option value="">-- Select Destination Account --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountHolderName} (${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Amount ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-900/85 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono"
              required
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl p-3.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-2.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl p-3.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !sourceId || !destinationId || !amount}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/10 hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Send Transaction</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
