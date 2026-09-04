import React from 'react';
import {
  LayoutDashboard,
  Mic,
  MessageSquare,
  Activity,
  ScanLine,
  Swords,
  GitCommit,
  PlayCircle,
  Network,
  Binary,
  Gauge,
  GraduationCap,
  ShieldAlert,
  FileCheck2,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'live-voice',
      label: 'Live Voice Debate',
      icon: Mic,
      badge: 'Live',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'text-debate',
      label: 'Text Debate',
      icon: MessageSquare,
      badge: null,
    },
    {
      id: 'health-check',
      label: 'Argument Health Check',
      icon: Activity,
      badge: 'Flagship #1',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'argument-xray',
      label: 'Argument X-Ray',
      icon: ScanLine,
      badge: 'Flagship #2',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'evidence-battle',
      label: 'Evidence Battle',
      icon: Swords,
      badge: 'Flagship #3',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'reasoning-timeline',
      label: 'Reasoning Timeline',
      icon: GitCommit,
      badge: 'Flagship #4',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'debate-replay',
      label: 'Debate Replay',
      icon: PlayCircle,
      badge: 'Flagship #5',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'argument-map',
      label: 'Argument Graph',
      icon: Network,
      badge: null,
    },
    {
      id: 'nlp-explorer',
      label: 'NLP Explorer',
      icon: Binary,
      badge: 'Academic',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'model-insights',
      label: 'Model Insights & ML',
      icon: Gauge,
      badge: null,
    },
    {
      id: 'debate-trainer',
      label: 'AI Debate Trainer',
      icon: GraduationCap,
      badge: 'Practice',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'steelman-redteam',
      label: 'Steelman & Red Team',
      icon: ShieldAlert,
      badge: null,
    },
    {
      id: 'full-report',
      label: 'Debate Report',
      icon: FileCheck2,
      badge: '21 Sections',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950/60 p-3 hidden md:flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Analytical Modules
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-indigo-500/10 text-indigo-200 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`shrink-0 rounded-full border px-1.5 py-0.2 text-[9px] font-medium ${
                      item.badgeColor || 'border-slate-700 bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Philosophy Footnote */}
      <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300 mb-1">Referee Mandate</p>
        <p className="leading-relaxed italic">
          “The AI does not decide who won. It explains how the reasoning works.”
        </p>
      </div>
    </aside>
  );
}
