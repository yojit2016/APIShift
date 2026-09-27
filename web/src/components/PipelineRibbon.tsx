import React from 'react';
import { Check, RefreshCw } from 'lucide-react';

interface PipelineRibbonProps {
  isRunning: boolean;
  currentStep?: number;
  totalFailures?: number;
  totalClusters?: number;
  autoFixed?: number;
  totalProbes?: number;
}

export const PipelineRibbon: React.FC<PipelineRibbonProps> = ({
  isRunning,
  currentStep = 4,
  totalFailures = 23,
  totalClusters = 2,
  autoFixed = 23,
  totalProbes = 40,
}) => {
  const steps = [
    {
      id: 'module-a',
      code: 'MODULE A',
      label: 'Impact Analyzer',
      detail: 'AST Call Sites Mapped',
    },
    {
      id: 'module-b',
      code: 'MODULE B',
      label: 'Migration Codegen',
      detail: 'Adapter Synthesized',
    },
    {
      id: 'module-c',
      code: 'MODULE C',
      label: 'Failure Clusterer',
      detail: `${totalFailures} Failures → ${totalClusters} Causes`,
    },
    {
      id: 'module-d',
      code: 'MODULE D',
      label: 'Fixer & Verification',
      detail: `${totalProbes - (totalFailures - autoFixed)}/${totalProbes} Probes Green`,
    },
  ];

  return (
    <div className="h-10 bg-zinc-950/90 border-b border-zinc-800/80 px-4 flex items-center shrink-0 select-none overflow-x-auto">
      <div className="flex items-center w-full justify-between gap-4 text-xs font-sans">
        {steps.map((step, idx) => {
          const isCurrentActive = isRunning && currentStep === idx;
          const isDone = !isRunning || idx < currentStep;

          return (
            <div key={step.id} className="flex items-center gap-2.5 min-w-0">
              <div
                className={`flex items-center justify-center w-4 h-4 rounded-full text-xs shrink-0 ${
                  isCurrentActive
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                    : isDone
                    ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-500'
                }`}
              >
                {isCurrentActive ? (
                  <RefreshCw className="w-2.5 h-2.5 animate-spin text-amber-400" />
                ) : isDone ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <span className="text-[9px] font-mono">{idx + 1}</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 truncate">
                <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                  {step.code}:
                </span>
                <span className={`font-medium truncate ${isCurrentActive ? 'text-amber-300 font-semibold' : 'text-zinc-200'}`}>
                  {step.label}
                </span>
                <span className="hidden xl:inline text-[11px] text-zinc-500 font-mono">
                  ({step.detail})
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div className="w-8 h-[1px] bg-zinc-800 shrink-0 mx-1 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
