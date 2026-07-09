import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  rowHeight?: string;
  header?: React.ReactNode;
}

export default function LoadingSkeleton({
  rows = 3,
  rowHeight = 'h-14',
  header,
}: LoadingSkeletonProps): React.JSX.Element {
  return (
    <div className="backdrop-blur-xl bg-slate-950/45 rounded-2xl p-6 border border-slate-800/80">
      {header && (
        <div className="mb-4">
          {header}
        </div>
      )}
      <div className="flex flex-col gap-3 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`${rowHeight} bg-slate-900/60 border border-slate-800/80 rounded-xl`}
          />
        ))}
      </div>
    </div>
  );
}
