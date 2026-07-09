import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import LoadingSkeleton from './ui/LoadingSkeleton';
import ErrorDisplay from './ui/ErrorDisplay';
import AccountCard from './AccountCard';
import type { Account } from '../types';

const SectionHeader: React.FC = () => (
  <h2 className="text-xl font-semibold font-display text-slate-100 flex items-center gap-2">
    <CreditCard className="w-5 h-5 text-indigo-400" />
    Active Accounts
  </h2>
);

interface AccountListProps {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  onCopyId: (id: string) => void;
  copiedId: string | null;
}

export default function AccountList({
  accounts,
  loading,
  error,
  onCopyId,
  copiedId,
}: AccountListProps): React.JSX.Element {
  if (loading) {
    return (
      <LoadingSkeleton
        rows={3}
        rowHeight="h-28"
        header={<SectionHeader />}
      />
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        message="Unable to load accounts. Please try again in a few moments."
        hint="If the problem persists, contact your system administrator."
      />
    );
  }

  return (
    <div className={`backdrop-blur-xl bg-slate-950/45 rounded-2xl border border-slate-800/80 p-6 shadow-glow-indigo`}>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader />
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-medium flex items-center gap-1 border border-indigo-500/20">
          <ShieldCheck className="w-3 h-3" /> Secure Seed
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {accounts.map((account, index) => (
          <AccountCard
            key={account.id}
            account={account}
            index={index}
            copiedId={copiedId}
            onCopyId={onCopyId}
          />
        ))}

        {accounts.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-4">No accounts loaded.</p>
        )}
      </div>
    </div>
  );
}
