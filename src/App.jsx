import React, { useState } from 'react';
import { DebateProvider } from './context/DebateContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import AudioSyncPlayer from './components/AudioSyncPlayer.jsx';
import VoiceReportModal from './components/VoiceReportModal.jsx';
import FeedbackModal from './components/FeedbackModal.jsx';
import NewDebateModal from './components/NewDebateModal.jsx';

// Pages
import Dashboard from './pages/Dashboard.jsx';
import LiveVoiceDebate from './pages/LiveVoiceDebate.jsx';
import TextDebate from './pages/TextDebate.jsx';
import ArgumentHealthCheck from './pages/ArgumentHealthCheck.jsx';
import ArgumentXRay from './pages/ArgumentXRay.jsx';
import EvidenceBattle from './pages/EvidenceBattle.jsx';
import ReasoningTimeline from './pages/ReasoningTimeline.jsx';
import DebateReplay from './pages/DebateReplay.jsx';
import ArgumentMap from './pages/ArgumentMap.jsx';
import NlpExplorer from './pages/NlpExplorer.jsx';
import ModelInsights from './pages/ModelInsights.jsx';
import DebateTrainer from './pages/DebateTrainer.jsx';
import SteelmanRedTeam from './pages/SteelmanRedTeam.jsx';
import FullReport from './pages/FullReport.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNewDebateModalOpen, setIsNewDebateModalOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'live-voice':
        return <LiveVoiceDebate />;
      case 'text-debate':
        return <TextDebate />;
      case 'health-check':
        return <ArgumentHealthCheck />;
      case 'argument-xray':
        return <ArgumentXRay />;
      case 'evidence-battle':
        return <EvidenceBattle />;
      case 'reasoning-timeline':
        return <ReasoningTimeline />;
      case 'debate-replay':
        return <DebateReplay />;
      case 'argument-map':
        return <ArgumentMap />;
      case 'nlp-explorer':
        return <NlpExplorer />;
      case 'model-insights':
        return <ModelInsights />;
      case 'debate-trainer':
        return <DebateTrainer />;
      case 'steelman-redteam':
        return <SteelmanRedTeam />;
      case 'full-report':
        return <FullReport />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <DebateProvider>
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Navigation Bar */}
        <Navbar onNewDebateModalOpen={() => setIsNewDebateModalOpen(true)} />

        {/* Main Work Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Module Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Page Container */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
            {renderActivePage()}
          </main>
        </div>

        {/* Audio Timeline Sync Player (Persistent at bottom) */}
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <AudioSyncPlayer />
        </div>

        {/* Modals */}
        <VoiceReportModal />
        <FeedbackModal />
        <NewDebateModal
          isOpen={isNewDebateModalOpen}
          onClose={() => setIsNewDebateModalOpen(false)}
        />
      </div>
    </DebateProvider>
  );
}
