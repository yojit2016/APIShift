import React, { useState, useEffect } from 'react';
import { HeaderBanner } from './components/HeaderBanner';
import { PipelineRibbon } from './components/PipelineRibbon';
import { ImpactMapColumn } from './components/ImpactMapColumn';
import { ClusterReportColumn } from './components/ClusterReportColumn';
import { DynamicFooter } from './components/DynamicFooter';
import { BobSessionsModal } from './components/BobSessionsModal';
import { staticData } from './data/staticData';

export const App: React.FC = () => {
  const [impactMap, setImpactMap] = useState<any[]>(staticData.blastRadius);
  const [clusterReport, setClusterReport] = useState<any | null>(staticData.clusterReport);
  const [adapterCode, setAdapterCode] = useState<string>(staticData.adapterCode);
  const [bobSessions, setBobSessions] = useState<any[]>(staticData.bobSessions.sessions);
  const [totalBobcoins, setTotalBobcoins] = useState<number | null>(staticData.bobSessions.totalBobcoins);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(4);
  const [isBobModalOpen, setIsBobModalOpen] = useState<boolean>(false);

  const fetchArtifacts = async () => {
    try {
      const res = await fetch('/api/artifacts');
      if (res.ok) {
        const data = await res.json();
        if (data && (data.impactMap?.length || data.clusterReport)) {
          setImpactMap(data.impactMap || staticData.blastRadius);
          setClusterReport(data.clusterReport || staticData.clusterReport);
          setAdapterCode(data.adapterCode || staticData.adapterCode);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API /api/artifacts unavailable. Operating in standalone demo mode with embedded static data.');
    }
    // Standalone static hydration
    setImpactMap(staticData.blastRadius);
    setClusterReport(staticData.clusterReport);
    setAdapterCode(staticData.adapterCode);
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
      console.warn('Bob sessions API unavailable. Operating in standalone demo mode.');
    }
    setBobSessions(staticData.bobSessions.sessions);
    setTotalBobcoins(staticData.bobSessions.totalBobcoins);
  };

  useEffect(() => {
    fetchArtifacts();
    fetchBobSessions();
  }, []);

  const handleRunPipeline = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    try {
      // Try backend if available
      const res = await fetch('/api/run-pipeline', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setCurrentStep(4);
        setImpactMap(data.impactMap || staticData.blastRadius);
        setClusterReport(data.clusterReport || staticData.clusterReport);
        setAdapterCode(data.adapterCode || staticData.adapterCode);
        await fetchBobSessions();
        setIsRunning(false);
        return;
      }
    } catch (err) {
      console.warn('Backend unavailable; executing animated closed-loop migration simulation...');
    }

    // Animated 2-3 second simulation for client-side standalone demo
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(1);
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(2);
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(3);
    await new Promise((r) => setTimeout(r, 600));

    setCurrentStep(4);
    setImpactMap(staticData.blastRadius);
    setClusterReport(staticData.clusterReport);
    setAdapterCode(staticData.adapterCode);
    setBobSessions(staticData.bobSessions.sessions);
    setTotalBobcoins(staticData.bobSessions.totalBobcoins);
    setIsRunning(false);
  };

  const summary = clusterReport?.summary || staticData.clusterReport.summary;

  return (
    <div className="h-screen w-screen bg-[#090d16] text-zinc-100 flex flex-col font-sans overflow-hidden">
      <HeaderBanner
        onRunPipeline={handleRunPipeline}
        onOpenBobSessions={() => setIsBobModalOpen(true)}
        isRunning={isRunning}
      />

      <PipelineRibbon
        isRunning={isRunning}
        currentStep={currentStep}
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
