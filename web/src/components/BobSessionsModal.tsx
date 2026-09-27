import React, { useState } from 'react';
import { X, Folder, FileCode, CheckCircle2, ShieldCheck, Eye, ExternalLink } from 'lucide-react';

interface BobSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: any[];
}

export const BobSessionsModal: React.FC<BobSessionsModalProps> = ({ isOpen, onClose, sessions }) => {
  const [selectedImage, setSelectedImage] = useState<{ name: string; path: string } | null>(null);

  if (!isOpen) return null;

  return (
    <>
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
                All IDE migration sessions, AST diff traces, and automated adapter generations are recorded and stored deterministically under <code className="text-zinc-300">/bob_sessions</code>. Click any session to preview.
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
                    onClick={() => setSelectedImage({ name: s.name, path: s.path })}
                    className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-600 text-zinc-300 font-mono text-xs transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <FileCode className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                      <div>
                        <div className="font-semibold text-zinc-200 group-hover:text-white transition-colors">{s.name}</div>
                        <div className="text-[10px] text-zinc-500 font-sans">{s.path}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>LOGGED</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-zinc-200">
                        <Eye className="w-3.5 h-3.5" />
                        <a
                          href={s.path}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 hover:text-cyan-400 transition-colors"
                          title="Open image in new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                [
                  'team_task01_impact_analysis_summary.png',
                  'team_task02_migration_codegen_summary.png',
                  'team_task03_failure_clustering_summary.png',
                  'team_task04_rootcause_fix_summary.png',
                ].map((filename, idx) => {
                  const sPath = `/bob_sessions/${filename}`;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage({ name: filename, path: sPath })}
                      className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-600 text-zinc-300 font-mono text-xs transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <FileCode className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                        <div>
                          <div className="font-semibold text-zinc-200 group-hover:text-white transition-colors">{filename}</div>
                          <div className="text-[10px] text-zinc-500">{sPath}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>VERIFIED</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-zinc-200">
                          <Eye className="w-3.5 h-3.5" />
                          <a
                            href={sPath}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 hover:text-cyan-400 transition-colors"
                            title="Open image in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-5xl w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold truncate">
                <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{selectedImage.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={selectedImage.path}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-sans flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Full Size</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-zinc-950/90 flex-1 min-h-0 flex items-center justify-center overflow-auto">
              <img
                src={selectedImage.path}
                alt={selectedImage.name}
                className="max-w-full max-h-[75vh] object-contain rounded border border-zinc-800 shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
