import React, { useMemo } from 'react';
import { History, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';
import LoadingSkeleton from './ui/LoadingSkeleton';
import ErrorDisplay from './ui/ErrorDisplay';
import TransactionRow from './TransactionRow';
import type { Account, Transaction } from '../types';

const PANEL_BASE: string = 'backdrop-blur-xl bg-slate-950/45 rounded-2xl border border-slate-800/80';

const SectionHeader: React.FC = () => (
  <h2 className="text-xl font-semibold font-display text-slate-100 flex items-center gap-2">
    <History className="w-5 h-5 text-blue-400" />
    Transaction Ledger
  </h2>
);

interface TransactionHistoryProps {
  transactions: Transaction[];
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

export default function TransactionHistory({
  transactions,
  accounts,
  loading,
  error,
}: TransactionHistoryProps): React.JSX.Element {
  const accountNameMap = useMemo<Map<string, string>>(() => {
    return new Map(accounts.map((a) => [a.id, a.accountHolderName]));
  }, [accounts]);

  const getAccountName = (id: string): string =>
    accountNameMap.get(id) ?? `Account (···${id.slice(-4)})`;

  if (loading) {
    return (
      <LoadingSkeleton
        rows={4}
        rowHeight="h-14"
        header={<SectionHeader />}
      />
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        message="Unable to load transaction history. Please try again in a few moments."
        hint="Your data is safe — this is a temporary connection issue."
      />
    );
  }

  return (
    <div className={`${PANEL_BASE} p-6 shadow-glow-blue flex flex-col h-full`}>
      <h2 className="text-xl font-semibold font-display text-slate-100 mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-blue-400" />
        Transaction Ledger
      </h2>

      <div className="overflow-y-auto max-h-[380px] pr-1 flex-grow">
        <div className="flex flex-col gap-3">
          {transactions.map((tx) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              getAccountName={getAccountName}
              formatDate={formatDate}
            />
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-8 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl">
              <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No transaction records found.</p>
              <p className="text-xs text-slate-500 mt-1">Submit your first transfer above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
