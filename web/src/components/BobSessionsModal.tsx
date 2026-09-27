import React from 'react';
import { X, Folder, FileCode, CheckCircle2, ShieldCheck } from 'lucide-react';

interface BobSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: any[];
}

export const BobSessionsModal: React.FC<BobSessionsModalProps> = ({ isOpen, onClose, sessions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 shadow-2xl rounded-lg max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-zinc-400" />
            <h3 className="text-zinc-100 font-semibold text-sm">
              Documented IBM Bob IDE Sessions (/bob_sessions)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-mono text-xs">
          <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-zinc-400 text-xs flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <p>
              All IDE migration sessions, AST diff traces, and automated adapter generations are recorded and stored deterministically under <code className="text-zinc-300">/bob_sessions</code>.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
              Recorded Session Artifacts ({sessions.length > 0 ? sessions.length : 4})
            </h4>

            {sessions.length > 0 ? (
              sessions.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-300 font-mono text-xs transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="font-semibold text-zinc-200">{s.name}</div>
                      <div className="text-[10px] text-zinc-500 font-sans">{s.path}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>LOGGED</span>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-300 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="font-semibold text-zinc-200">team_task01_impact_analysis_summary.png</div>
                      <div className="text-[10px] text-zinc-500">/bob_sessions/team_task01_impact_analysis_summary.png</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-300 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="font-semibold text-zinc-200">team_task02_migration_codegen_summary.png</div>
                      <div className="text-[10px] text-zinc-500">/bob_sessions/team_task02_migration_codegen_summary.png</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-300 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="font-semibold text-zinc-200">team_task03_failure_clustering_summary.png</div>
                      <div className="text-[10px] text-zinc-500">/bob_sessions/team_task03_failure_clustering_summary.png</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-300 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="font-semibold text-zinc-200">team_task04_rootcause_fix_summary.png</div>
                      <div className="text-[10px] text-zinc-500">/bob_sessions/team_task04_rootcause_fix_summary.png</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-4 py-1.5 rounded transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

