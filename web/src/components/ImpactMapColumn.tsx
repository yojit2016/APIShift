import React, { useState } from 'react';
import { AlertCircle, Sparkles, ChevronDown, ChevronRight, Terminal } from 'lucide-react';

interface CallSite {
  file: string;
  line: number;
  snippet: string;
  endpoint: string;
}

interface ImpactMapItem {
  changedEndpoint: string;
  changeType: string;
  diffDetail: string;
  callSites: CallSite[];
  affectedTests: any[];
}

interface ImpactMapColumnProps {
  impactMap: ImpactMapItem[];
  adapterCode: string;
}

export const ImpactMapColumn: React.FC<ImpactMapColumnProps> = ({ impactMap, adapterCode }) => {
  const [showAdapterCode, setShowAdapterCode] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-lg font-bold font-display text-white tracking-wide">
            Module A & B: Blast Radius & Impact Map
          </h2>
        </div>
        <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {impactMap.length} Changed Endpoints
        </span>
      </div>

      <div className="space-y-4">
        {impactMap.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel glass-panel-hover rounded-xl p-4 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="inline-block font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 mb-1.5">
                  {item.changedEndpoint}
                </span>
                <p className="text-xs font-mono text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {item.diffDetail}
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                {item.callSites.length} Call Sites
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/60">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">File Location</th>
                    <th className="py-2 px-3">Line</th>
                    <th className="py-2 px-3">Code Snippet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {item.callSites.slice(0, 5).map((cs, cIdx) => (
                    <tr key={cIdx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2 px-3 text-cyan-400 font-semibold truncate max-w-[160px]">
                        {cs.file.replace(/^demo-repo\//, '')}
                      </td>
                      <td className="py-2 px-3 text-slate-400">L{cs.line}</td>
                      <td className="py-2 px-3 text-slate-300 font-mono text-[11px] truncate max-w-[220px]">
                        <code className="text-slate-200">{cs.snippet}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {item.callSites.length > 5 && (
                <div className="py-1.5 px-3 text-[10px] font-mono text-slate-500 bg-slate-900/30 text-center">
                  + {item.callSites.length - 5} additional AST call sites mapped
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-purple-500/30">
        <button
          onClick={() => setShowAdapterCode(!showAdapterCode)}
          className="w-full flex items-center justify-between p-3.5 bg-purple-950/30 hover:bg-purple-950/50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono font-bold text-purple-200">
              Module B: Synthesized Adapter Shim (migrationAdapter.ts)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-700/50">
              Auto-Generated
            </span>
            {showAdapterCode ? (
              <ChevronDown className="w-4 h-4 text-purple-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-purple-400" />
            )}
          </div>
        </button>

        {showAdapterCode && (
          <div className="p-4 bg-slate-950/90 border-t border-purple-900/30">
            <div className="flex items-center gap-2 mb-2 text-[11px] font-mono text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span>demo-repo/src/client/migrationAdapter.ts</span>
            </div>
            <pre className="text-xs font-mono text-purple-200/90 bg-slate-900/90 p-3.5 rounded-lg overflow-x-auto max-h-64 border border-slate-800 leading-relaxed">
              <code>{adapterCode || '// Migration adapter code generating...'}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
