import React, { useState } from 'react';
import { Layers2, CheckCircle2, AlertOctagon, ChevronDown, ChevronRight, FileText } from 'lucide-react';

interface FailureCluster {
  clusterId: string;
  endpoint: string;
  failingTests: string[];
  rootCause: string | null;
  fixApplied: boolean;
  verified: boolean;
}

interface ClusterReport {
  clusters: FailureCluster[];
  summary: {
    totalFailingBefore: number;
    clusters: number;
    autoFixed: number;
    timeSeconds: number;
  };
}

interface ClusterReportColumnProps {
  clusterReport: ClusterReport | null;
}

export const ClusterReportColumn: React.FC<ClusterReportColumnProps> = ({ clusterReport }) => {
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

  const toggleCluster = (id: string) => {
    setExpandedCluster(expandedCluster === id ? null : id);
  };

  const totalFailing = clusterReport?.summary.totalFailingBefore ?? 23;
  const totalClustersCount = clusterReport?.summary.clusters ?? 2;
  const clusters = clusterReport?.clusters ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h2 className="text-lg font-bold font-display text-white tracking-wide">
            Module C & D: Failure Deduplication & Root Causes
          </h2>
        </div>
        <span className="text-xs font-mono px-2 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
          {totalClustersCount} Deduplicated Root Causes
        </span>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30 flex items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Layers2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-slate-100 flex items-center gap-2">
              <span className="text-rose-400 font-extrabold text-base">{totalFailing} Raw CI Failures</span>
              <span className="text-slate-500">→</span>
              <span className="text-emerald-400 font-extrabold text-base">Deduplicated to {totalClustersCount} Architectural Root Causes</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Automated AST root-cause attribution eliminates noise and groups failure signatures.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {clusters.map((cluster) => {
          const isExpanded = expandedCluster === cluster.clusterId;
          const isVerified = cluster.verified;

          return (
            <div
              key={cluster.clusterId}
              className={`glass-panel glass-panel-hover rounded-xl overflow-hidden border transition-all ${
                isVerified ? 'border-emerald-500/30 glow-emerald' : 'border-rose-500/30 glow-rose'
              }`}
            >
              <div className="p-4 bg-slate-900/60">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                      {cluster.clusterId}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {cluster.endpoint}
                    </span>
                  </div>

                  <span
                    className={`flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                      isVerified
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                        : 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                    }`}
                  >
                    {isVerified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>REMEDIATED</span>
                      </>
                    ) : (
                      <>
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                        <span>FAILING</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="text-xs font-mono text-slate-200 mt-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 leading-relaxed flex items-start gap-2">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-amber-300">Root Cause:</strong> {cluster.rootCause}
                  </span>
                </p>

                <button
                  onClick={() => toggleCluster(cluster.clusterId)}
                  className="mt-3 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isExpanded ? 'Hide' : 'View'} {cluster.failingTests.length} Attributed Failing Tests
                  </span>
                </button>
              </div>

              {isExpanded && (
                <div className="p-3 bg-slate-950/90 border-t border-slate-800 text-xs font-mono space-y-1.5 max-h-48 overflow-y-auto">
                  {cluster.failingTests.map((tName, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-1.5 rounded bg-slate-900/60 border border-slate-800/80 text-slate-300 flex items-center justify-between"
                    >
                      <span className="truncate">{tName}</span>
                      <span className="text-[10px] text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/40 shrink-0">
                        {cluster.clusterId === 'cluster-get-orders-total'
                          ? 'Schema Drift'
                          : 'Payload Drift'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
