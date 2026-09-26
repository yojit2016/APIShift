import React from 'react';
import { Terminal, ExternalLink } from 'lucide-react';

interface DynamicFooterProps {
  totalProbes?: number;
  autoFixed?: number;
  clustersCount?: number;
  timeSeconds?: number;
  onOpenBobSessions: () => void;
}

export const DynamicFooter: React.FC<DynamicFooterProps> = ({
  totalProbes = 40,
  autoFixed = 23,
  clustersCount = 2,
  timeSeconds = 12.05,
  onOpenBobSessions,
}) => {
  return (
    <footer className="mt-12 border-t border-slate-800 bg-slate-900/90 py-4 sticky bottom-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyan-300 bg-slate-950/80 px-4 py-2 rounded-lg border border-cyan-800/60 shadow-inner">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-semibold text-slate-100">
              {totalProbes} total probes <span className="text-slate-600">|</span> {autoFixed} failures remediated <span className="text-slate-600">|</span> {clustersCount} root causes <span className="text-slate-600">|</span> Verified in {timeSeconds.toFixed(2)}s
            </span>
          </div>

          <button
            onClick={onOpenBobSessions}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-colors cursor-pointer"
          >
            <span>[View Documented Bob IDE Sessions]</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};
