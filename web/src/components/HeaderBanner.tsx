import React from 'react';
import { Play, RefreshCw, Cpu, GitCompare, ExternalLink } from 'lucide-react';

interface HeaderBannerProps {
  onRunPipeline: () => void;
  onOpenBobSessions: () => void;
  isRunning: boolean;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  onRunPipeline,
  onOpenBobSessions,
  isRunning,
}) => {
  return (
    <header className="h-13 bg-zinc-950 border-b border-zinc-800/80 px-4 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-100 tracking-tight">APIShift</span>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            v1.2-bob-rehearsal
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/90 px-3 py-1 rounded border border-zinc-800">
        <GitCompare className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span className="text-zinc-300">contracts/before.yaml</span>
        <span className="text-zinc-600">→</span>
        <span className="text-amber-400 font-medium">contracts/after.yaml</span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenBobSessions}
          className="px-3 py-1.5 rounded text-xs font-medium text-zinc-300 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Bob Sessions</span>
          <ExternalLink className="w-3 h-3 text-zinc-500" />
        </button>

        <button
          onClick={onRunPipeline}
          disabled={isRunning}
          className={`px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            isRunning
              ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-sm'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-400" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Closed-Loop Migration</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
