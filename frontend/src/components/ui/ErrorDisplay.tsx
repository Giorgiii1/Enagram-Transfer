import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  message?: string;
  hint?: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({
  message,
  hint,
  onRetry,
}: ErrorDisplayProps): React.JSX.Element {
  return (
    <div className="backdrop-blur-xl bg-slate-950/45 rounded-2xl p-8 border border-red-900/25 text-center flex flex-col items-center gap-3">
      <div className="bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20">
        <WifiOff className="w-6 h-6" />
      </div>
      <div>
        <p className="text-red-300 text-sm font-semibold">
          {message || 'Unable to connect to the service. Please try again in a few moments.'}
        </p>
        {hint && (
          <p className="text-xs text-slate-500 mt-1">{hint}</p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <RefreshCw className="w-3 h-3" />
          Try Again
        </button>
      )}
    </div>
  );
}
