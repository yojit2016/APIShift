import React from 'react';
import { Terminal } from 'lucide-react';

interface DynamicFooterProps {
  totalProbes?: number;
  autoFixed?: number;
  clustersCount?: number;
  timeSeconds?: number;
}

export const DynamicFooter: React.FC<DynamicFooterProps> = ({
  totalProbes = 40,
  autoFixed = 23,
  timeSeconds = 12.05,
}) => {
  return (
    <footer className="h-7 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-400 font-mono px-4 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-2">
        <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="text-zinc-300">
          Execution Time: <span className="text-zinc-100 font-semibold">{timeSeconds.toFixed(2)}s</span>
        </span>
        <span className="text-zinc-700">|</span>
        <span className="text-zinc-300">
          Probes: <span className="text-emerald-400 font-semibold">{autoFixed === 23 ? `${totalProbes}/${totalProbes} Passed` : `${totalProbes - 23}/${totalProbes} Passed`}</span>
        </span>
        <span className="text-zinc-700">|</span>
        <span className="text-zinc-300">
          Active Shim: <span className="text-cyan-400 font-semibold">migrationAdapter.ts</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-zinc-400">
          Bobcoins: <span className="text-amber-400 font-semibold">4.85 used</span>
        </span>
      </div>
    </footer>
  );
};
