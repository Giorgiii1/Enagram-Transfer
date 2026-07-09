import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from './api/axios';
import AccountList from './components/AccountList';
import TransferForm from './components/TransferForm';
import TransactionHistory from './components/TransactionHistory';
import { RefreshCw, Layers, Wallet } from 'lucide-react';
import type { Account, Transaction, TransferRequest } from './types';

const STAT_BASE: string = 'backdrop-blur-xl bg-slate-950/45 rounded-2xl p-5 border border-slate-800/80 flex items-center justify-between';

export default function App(): React.JSX.Element {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [accountsLoading, setAccountsLoading] = useState<boolean>(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const [txLoading, setTxLoading] = useState<boolean>(true);
  const [txError, setTxError] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAccounts = useCallback(async (): Promise<void> => {
    setAccountsLoading(true);
    setAccountsError(null);
    try {
      const response = await api.get<Account[]>('/api/accounts');
      setAccounts(response.data || []);
    } catch (err) {
      setAccountsError('Unable to load accounts. Please try again in a few moments.');
      console.error('[Enagram] fetchAccounts:', err);
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (): Promise<void> => {
    setTxLoading(true);
    setTxError(null);
    try {
      const response = await api.get<Transaction[]>('/api/accounts/transactions');
      setTransactions(response.data || []);
    } catch (err) {
      setTxError('Unable to load transaction history. Please try again in a few moments.');
      console.error('[Enagram] fetchTransactions:', err);
    } finally {
      setTxLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, [fetchAccounts, fetchTransactions]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleRefreshAll = useCallback((): void => {
    fetchAccounts();
    fetchTransactions();
  }, [fetchAccounts, fetchTransactions]);

  const handleCopyId = useCallback((id: string): void => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedId(null);
      copyTimeoutRef.current = null;
    }, 3000);
  }, []);

  const handleTransfer = useCallback(async (transferPayload: TransferRequest): Promise<void> => {
    await api.post('/api/accounts/transfer', transferPayload);
    await Promise.all([fetchAccounts(), fetchTransactions()]);
  }, [fetchAccounts, fetchTransactions]);

  const totalBalance: number = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalVolume: number = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const isLoading: boolean = accountsLoading || txLoading;

  return (
    <div className="flex-grow flex flex-col min-h-screen">
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/10 text-indigo-400 p-2 rounded-lg border border-indigo-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight font-display bg-gradient-to-r from-indigo-200 via-slate-100 to-purple-300 bg-clip-text text-transparent">
                Enagram
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Transfer Hub</p>
            </div>
          </div>

          <button
            onClick={handleRefreshAll}
            disabled={isLoading}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 hover:border-slate-700 transition-all focus:outline-none disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className={STAT_BASE}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total System Deposits</p>
              <h3 className="text-2xl font-bold font-display text-slate-100 mt-1">
                ${accountsLoading ? '---' : totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl border border-indigo-500/15">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          <div className={STAT_BASE}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Transferred Volume</p>
              <h3 className="text-2xl font-bold font-display text-slate-100 mt-1">
                ${txLoading ? '---' : totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="bg-purple-500/10 text-purple-400 p-3 rounded-xl border border-purple-500/15">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>

          <div className={STAT_BASE}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Entities</p>
              <h3 className="text-2xl font-bold font-display text-slate-100 mt-1">
                {accountsLoading ? '---' : accounts.length} Registered Accounts
              </h3>
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/15">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 h-full">
            <AccountList
              accounts={accounts}
              loading={accountsLoading}
              error={accountsError}
              onCopyId={handleCopyId}
              copiedId={copiedId}
            />
          </div>

          <div className="lg:col-span-4 h-full">
            <TransferForm
              accounts={accounts}
              onTransferSuccess={handleTransfer}
            />
          </div>

          <div className="lg:col-span-4 h-full">
            <TransactionHistory
              transactions={transactions}
              accounts={accounts}
              loading={txLoading}
              error={txError}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900/60 bg-slate-950/20 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600 font-medium">
          Enagram Transfer System • Protected Environment • Powered by .NET Web API &amp; React
        </div>
      </footer>
    </div>
  );
}
