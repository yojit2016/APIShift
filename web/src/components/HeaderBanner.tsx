import React from 'react';
import { Play, RefreshCw, Cpu, GitCompare, ShieldCheck } from 'lucide-react';

interface HeaderBannerProps {
  onRunPipeline: () => void;
  isRunning: boolean;
  timeSeconds?: number;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ onRunPipeline, isRunning }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Cpu className="w-6 h-6 animate-pulse-subtle" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                  APIShift <span className="text-cyan-400 font-mono text-sm">//</span> <span className="text-slate-400 text-sm font-normal font-mono">Safe API Migration Engine</span>
                </h1>
                <p className="text-xs sm:text-sm font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                  <GitCompare className="w-3.5 h-3.5 text-amber-400 inline" />
                  Target: <span className="text-slate-200 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">contracts/before.yaml</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/50">contracts/after.yaml</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs font-mono text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Deterministic AST Engine</span>
            </div>

            <button
              onClick={onRunPipeline}
              disabled={isRunning}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg font-mono text-sm font-semibold transition-all duration-200 shadow-lg ${
                isRunning
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-700/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 glow-cyan cursor-pointer'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Executing Orchestrator...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>[Run Closed-Loop Migration]</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
