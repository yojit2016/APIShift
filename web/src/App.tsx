import React, { useState, useEffect } from 'react';
import { HeaderBanner } from './components/HeaderBanner';
import { PipelineRibbon } from './components/PipelineRibbon';
import { ImpactMapColumn } from './components/ImpactMapColumn';
import { ClusterReportColumn } from './components/ClusterReportColumn';
import { DynamicFooter } from './components/DynamicFooter';
import { BobSessionsModal } from './components/BobSessionsModal';

export const App: React.FC = () => {
  const [impactMap, setImpactMap] = useState<any[]>([]);
  const [clusterReport, setClusterReport] = useState<any | null>(null);
  const [adapterCode, setAdapterCode] = useState<string>('');
  const [bobSessions, setBobSessions] = useState<any[]>([]);
  const [totalBobcoins, setTotalBobcoins] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBobModalOpen, setIsBobModalOpen] = useState<boolean>(false);

  const fetchArtifacts = async () => {
    try {
      const res = await fetch('/api/artifacts');
      if (res.ok) {
        const data = await res.json();
        setImpactMap(data.impactMap || []);
        setClusterReport(data.clusterReport || null);
        setAdapterCode(data.adapterCode || '');
      }
    } catch (err) {
      console.error('Failed to fetch artifacts:', err);
    }
  };

  const fetchBobSessions = async () => {
    try {
      const res = await fetch('/api/bob-sessions');
      if (res.ok) {
        const data = await res.json();
        setBobSessions(data.sessions || []);
        if (typeof data.totalBobcoins === 'number') {
          setTotalBobcoins(data.totalBobcoins);
        }
      }
    } catch (err) {
      console.error('Failed to fetch bob sessions:', err);
    }
  };

  useEffect(() => {
    fetchArtifacts();
    fetchBobSessions();
  }, []);

  const handleRunPipeline = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/run-pipeline', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setImpactMap(data.impactMap || []);
        setClusterReport(data.clusterReport || null);
        setAdapterCode(data.adapterCode || '');
        await fetchBobSessions();
      }
    } catch (err) {
      console.error('Failed to run pipeline:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const summary = clusterReport?.summary || {
    totalFailingBefore: 23,
    clusters: 2,
    autoFixed: 23,
    timeSeconds: 12.05,
  };

  return (
    <div className="h-screen w-screen bg-[#090d16] text-zinc-100 flex flex-col font-sans overflow-hidden">
      <HeaderBanner
        onRunPipeline={handleRunPipeline}
        onOpenBobSessions={() => setIsBobModalOpen(true)}
        isRunning={isRunning}
      />

      <PipelineRibbon
        isRunning={isRunning}
        totalFailures={summary.totalFailingBefore}
        totalClusters={summary.clusters}
        autoFixed={summary.autoFixed}
        totalProbes={40}
      />

      <main className="flex-1 p-3 min-h-0 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-5 h-full min-h-0">
            <ImpactMapColumn impactMap={impactMap} adapterCode={adapterCode} />
          </div>

          <div className="lg:col-span-7 h-full min-h-0">
            <ClusterReportColumn clusterReport={clusterReport} />
          </div>
        </div>
      </main>

      <DynamicFooter
        totalProbes={40}
        autoFixed={summary.autoFixed}
        clustersCount={summary.clusters}
        timeSeconds={summary.timeSeconds}
        totalFailures={summary.totalFailingBefore}
        totalBobcoins={totalBobcoins}
      />

      <BobSessionsModal
        isOpen={isBobModalOpen}
        onClose={() => setIsBobModalOpen(false)}
        sessions={bobSessions}
      />
    </div>
  );
};

export default App;
