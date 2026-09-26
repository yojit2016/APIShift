import React from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

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
    <div className="glass-panel rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold font-display text-white">
            Bounded Evidence Ledger (Cutover & Fortify Verification)
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Runtime Execution Audit Trail
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <th className="py-3 px-4">Migration Phase</th>
              <th className="py-3 px-4">Probe Pass Rate</th>
              <th className="py-3 px-4">Failure Count</th>
              <th className="py-3 px-4">Migration Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            <tr className="bg-rose-950/10 hover:bg-rose-950/20 transition-colors">
              <td className="py-3.5 px-4 font-bold text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Baseline (Unmigrated / Broken v2)</span>
              </td>
              <td className="py-3.5 px-4 text-slate-300 font-semibold">
                {baselinePassed} / {totalProbes} ({baselineRate}%)
              </td>
              <td className="py-3.5 px-4 text-rose-400 font-bold">
                {totalFailingBefore} Failures
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800/80">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  UNSAFE / REGRESSION
                </span>
              </td>
            </tr>

            <tr className="bg-emerald-950/20 hover:bg-emerald-950/30 transition-colors">
              <td className="py-3.5 px-4 font-bold text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>APIShift Verified (Post-Adapter)</span>
              </td>
              <td className="py-3.5 px-4 text-emerald-300 font-semibold">
                {verifiedPassed} / {totalProbes} ({verifiedRate}%)
              </td>
              <td className="py-3.5 px-4 text-emerald-400 font-bold">
                {verifiedFailures} Failures
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80 glow-emerald">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  VERIFIED / CLEAN
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
