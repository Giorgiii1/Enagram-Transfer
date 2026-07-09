import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import type { Transaction } from '../types';

interface TransactionRowProps {
  tx: Transaction;
  getAccountName: (id: string) => string;
  formatDate: (isoString: string) => string;
}

export default function TransactionRow({
  tx,
  getAccountName,
  formatDate,
}: TransactionRowProps): React.JSX.Element {
  return (
    <div className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-800 transition-all rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500/10 text-blue-400 p-2.5 rounded-xl border border-blue-500/20 shrink-0">
          <ArrowRight className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-200 text-sm">
              {getAccountName(tx.sourceAccountId)}
            </span>
            <span className="text-xs text-slate-500">to</span>
            <span className="font-semibold text-slate-200 text-sm">
              {getAccountName(tx.destinationAccountId)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(tx.timestamp)}</span>
          </div>
        </div>
      </div>

      <div className="text-right flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-0 border-slate-800/40 pt-2 sm:pt-0">
        <span className="text-xs text-slate-500 sm:hidden">Amount Transferred</span>
        <span className="text-base font-bold font-mono text-emerald-400">
          -${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
