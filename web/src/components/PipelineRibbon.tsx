import React from 'react';
import { Layers, Code2, Layers2, CheckCircle2, RefreshCw } from 'lucide-react';

interface PipelineRibbonProps {
  isRunning: boolean;
  totalFailures?: number;
  totalClusters?: number;
  autoFixed?: number;
  totalProbes?: number;
}

export const PipelineRibbon: React.FC<PipelineRibbonProps> = ({
  isRunning,
  totalFailures = 23,
  totalClusters = 2,
  autoFixed = 23,
  totalProbes = 40,
}) => {
  const steps = [
    {
      id: 'module-a',
      name: 'Module A: Impact Analyzer',
      desc: 'Scanned AST call sites & test mappings',
      icon: Layers,
      color: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30',
    },
    {
      id: 'module-b',
      name: 'Module B: Migration Codegen',
      desc: 'Synthesized backward-compatible adapter',
      icon: Code2,
      color: 'border-purple-500/50 text-purple-400 bg-purple-950/30',
    },
    {
      id: 'module-c',
      name: 'Module C: Failure Clusterer',
      desc: `Deduplicated ${totalFailures} failures into ${totalClusters} root causes`,
      icon: Layers2,
      color: 'border-amber-500/50 text-amber-400 bg-amber-950/30',
    },
    {
      id: 'module-d',
      name: 'Module D: Fixer & Verification',
      desc: `Executed ${totalProbes - (totalFailures - autoFixed)}/${totalProbes} tests green`,
      icon: CheckCircle2,
      color: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30',
    },
  ];

  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  step.color
                } ${isRunning ? 'animate-pulse' : ''}`}
              >
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/50">
                  {isRunning && idx === 1 ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold tracking-wide uppercase truncate">
                      {step.name}
                    </h3>
                    <span className="text-[10px] font-mono opacity-60">0{idx + 1}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans truncate mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
