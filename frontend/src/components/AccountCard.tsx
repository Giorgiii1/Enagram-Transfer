import React from 'react';
import { CreditCard, Copy, Check } from 'lucide-react';
import type { Account } from '../types';

const CARD_GRADIENTS: readonly string[] = [
  'from-indigo-600 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-blue-600 to-cyan-500',
  'from-violet-600 to-fuchsia-600',
];

interface AccountCardProps {
  account: Account;
  index: number;
  copiedId: string | null;
  onCopyId: (id: string) => void;
}

export default function AccountCard({
  account,
  index,
  copiedId,
  onCopyId,
}: AccountCardProps): React.JSX.Element {
  const gradient: string = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const isCopied: boolean = copiedId === account.id;

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${gradient} shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/10`}
    >
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
        <CreditCard className="w-40 h-40" />
      </div>

      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">Account Holder</p>
          <p className="text-lg font-bold font-display text-white mt-0.5">{account.accountHolderName}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">Current Balance</p>
          <p className="text-2xl font-extrabold font-display text-white mt-0.5">
            ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center z-10 relative bg-black/15 backdrop-blur-[2px] rounded-lg px-3 py-1.5 border border-white/5">
        <span className="font-mono text-xs tracking-wider text-white/80">
          •••• {account.id.substring(account.id.length - 8).toUpperCase()}
        </span>
        <button
          onClick={() => onCopyId(account.id)}
          title="Copy full account UUID"
          className="p-1 rounded bg-white/10 text-white hover:bg-white/20 transition-all focus:outline-none flex items-center gap-1 text-[10px]"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-emerald-300 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy ID</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
