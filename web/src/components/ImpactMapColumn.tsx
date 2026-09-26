import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, Terminal, Code2 } from 'lucide-react';

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
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState<number>(0);
  const [showAdapterCode, setShowAdapterCode] = useState<boolean>(false);

  const activeItem = impactMap[selectedEndpointIndex] || impactMap[0] || {
    changedEndpoint: 'GET /api/orders/{id}',
    changeType: 'schema-change',
    diffDetail: 'Response property total renamed to totalAmount',
    callSites: [],
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
      <div className="p-3 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-semibold tracking-wide uppercase text-zinc-400 font-sans">
            Contract Drift & Blast Radius
          </h2>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          Module A & B
        </span>
      </div>

      <div className="flex border-b border-zinc-800/80 bg-zinc-950/80 p-1.5 gap-1 shrink-0 overflow-x-auto">
        {impactMap.map((item, idx) => {
          const isSelected = idx === selectedEndpointIndex;
          const isGet = item.changedEndpoint.startsWith('GET');
          return (
            <button
              key={idx}
              onClick={() => setSelectedEndpointIndex(idx)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
              }`}
            >
              <span
                className={`text-[10px] font-bold px-1 rounded ${
                  isGet ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                }`}
              >
                {isGet ? 'GET' : 'POST'}
              </span>
              <span>{item.changedEndpoint.replace(/^(GET|POST)\s*/, '')}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-zinc-900 text-zinc-400 rounded-full border border-zinc-800">
                {item.callSites.length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-3 bg-zinc-950/40 border-b border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold">{activeItem.diffDetail}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-2">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead className="sticky top-0 bg-zinc-900/90 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-2 px-3">File Path</th>
              <th className="py-2 px-3 w-16">Line</th>
              <th className="py-2 px-3">Code Snippet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {activeItem.callSites.map((cs: CallSite, cIdx: number) => (
              <tr
                key={cIdx}
                className={cIdx % 2 === 0 ? 'bg-zinc-950/40' : 'bg-zinc-900/20'}
              >
                <td className="py-2 px-3 text-zinc-300 font-medium truncate max-w-[150px]">
                  {cs.file.replace(/^demo-repo\//, '')}
                </td>
                <td className="py-2 px-3 text-zinc-400">L{cs.line}</td>
                <td className="py-2 px-3 text-zinc-400 font-mono text-[11px] truncate max-w-[220px]">
                  <code>{cs.snippet}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-zinc-800/80 shrink-0 bg-zinc-950/80">
        <button
          onClick={() => setShowAdapterCode(!showAdapterCode)}
          className="w-full px-3 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>[View Generated migrationAdapter.ts]</span>
          </span>
          {showAdapterCode ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {showAdapterCode && (
          <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-xs font-mono max-h-48 overflow-y-auto">
            <pre className="text-[11px] text-zinc-300 leading-relaxed">
              <code>{adapterCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
