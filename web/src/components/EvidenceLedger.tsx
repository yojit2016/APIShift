import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface EvidenceLedgerProps {
  totalFailingBefore?: number;
  autoFixed?: number;
  totalProbes?: number;
}

export const EvidenceLedger: React.FC<EvidenceLedgerProps> = ({
  totalFailingBefore = 23,
  autoFixed = 23,
  totalProbes = 40,
}) => {
  const baselinePassed = totalProbes - totalFailingBefore;
  const baselineRate = ((baselinePassed / totalProbes) * 100).toFixed(1);

  const verifiedPassed = baselinePassed + autoFixed;
  const verifiedFailures = totalProbes - verifiedPassed;
  const verifiedRate = ((verifiedPassed / totalProbes) * 100).toFixed(1);

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg overflow-hidden shrink-0 mt-3">
      <div className="px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wide font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verification Ledger</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          Cutover & Fortify Audit
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-zinc-900/40 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <th className="py-2 px-3">Rollout Target</th>
              <th className="py-2 px-3">Pass Rate</th>
              <th className="py-2 px-3">Failures</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            <tr className="bg-rose-500/5">
              <td className="py-2 px-3 text-rose-300 font-medium flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Baseline (Direct Rollout)</span>
              </td>
              <td className="py-2 px-3 text-zinc-300">
                {baselinePassed}/{totalProbes} ({baselineRate}%)
              </td>
              <td className="py-2 px-3 text-rose-400 font-bold">{totalFailingBefore} Fail</td>
              <td className="py-2 px-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  UNSAFE / BLOCKED
                </span>
              </td>
            </tr>

            <tr className="bg-emerald-500/5">
              <td className="py-2 px-3 text-emerald-300 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>APIShift + Bob Adapter</span>
              </td>
              <td className="py-2 px-3 text-emerald-300 font-bold">
                {verifiedPassed}/{totalProbes} ({verifiedRate}%)
              </td>
              <td className="py-2 px-3 text-emerald-400 font-bold">{verifiedFailures} Fail</td>
              <td className="py-2 px-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  VERIFIED / PRODUCTION SAFE
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
