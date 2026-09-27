import React, { useState, useEffect } from 'react';
import { HeaderBanner } from './components/HeaderBanner';
import { PipelineRibbon } from './components/PipelineRibbon';
import { ImpactMapColumn } from './components/ImpactMapColumn';
import { ClusterReportColumn } from './components/ClusterReportColumn';
import { DynamicFooter } from './components/DynamicFooter';
import { BobSessionsModal } from './components/BobSessionsModal';
import {
  fallbackImpactMap,
  fallbackClusterReport,
  fallbackAdapterCode,
  fallbackBobSessions,
} from './data/fallbackData';

export const App: React.FC = () => {
  const [impactMap, setImpactMap] = useState<any[]>(fallbackImpactMap);
  const [clusterReport, setClusterReport] = useState<any | null>(fallbackClusterReport);
  const [adapterCode, setAdapterCode] = useState<string>(fallbackAdapterCode);
  const [bobSessions, setBobSessions] = useState<any[]>(fallbackBobSessions.sessions);
  const [totalBobcoins, setTotalBobcoins] = useState<number | null>(fallbackBobSessions.totalBobcoins);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBobModalOpen, setIsBobModalOpen] = useState<boolean>(false);

  const fetchArtifacts = async () => {
    try {
      const res = await fetch('/api/artifacts');
      if (res.ok) {
        const data = await res.json();
        if (data && (data.impactMap?.length || data.clusterReport)) {
          setImpactMap(data.impactMap || fallbackImpactMap);
          setClusterReport(data.clusterReport || fallbackClusterReport);
          setAdapterCode(data.adapterCode || fallbackAdapterCode);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API unavailable. Hydrating with static verified artifacts:', err);
    }
    // Fallback hydration
    setImpactMap(fallbackImpactMap);
    setClusterReport(fallbackClusterReport);
    setAdapterCode(fallbackAdapterCode);
  };

  const fetchBobSessions = async () => {
    try {
      const res = await fetch('/api/bob-sessions');
      if (res.ok) {
        const data = await res.json();
        if (data && data.sessions?.length) {
          setBobSessions(data.sessions);
          if (typeof data.totalBobcoins === 'number') {
            setTotalBobcoins(data.totalBobcoins);
          }
          return;
        }
      }
    } catch (err) {
      console.warn('Bob sessions API unavailable. Hydrating with static metadata:', err);
    }
    // Fallback hydration
    setBobSessions(fallbackBobSessions.sessions);
    setTotalBobcoins(fallbackBobSessions.totalBobcoins);
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
        setImpactMap(data.impactMap || fallbackImpactMap);
        setClusterReport(data.clusterReport || fallbackClusterReport);
        setAdapterCode(data.adapterCode || fallbackAdapterCode);
        await fetchBobSessions();
      } else {
        // Fallback simulation when on static Vercel build
        await new Promise((r) => setTimeout(r, 1200));
        setImpactMap(fallbackImpactMap);
        setClusterReport(fallbackClusterReport);
        setAdapterCode(fallbackAdapterCode);
        setBobSessions(fallbackBobSessions.sessions);
        setTotalBobcoins(fallbackBobSessions.totalBobcoins);
      }
    } catch (err) {
      console.warn('Pipeline API failed; running client-side fallback simulation:', err);
      await new Promise((r) => setTimeout(r, 1200));
      setImpactMap(fallbackImpactMap);
      setClusterReport(fallbackClusterReport);
      setAdapterCode(fallbackAdapterCode);
      setBobSessions(fallbackBobSessions.sessions);
      setTotalBobcoins(fallbackBobSessions.totalBobcoins);
    } finally {
      setIsRunning(false);
    }
  };

  const summary = clusterReport?.summary || fallbackClusterReport.summary;

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
