import React, { useState } from 'react';
import {
  Scale,
  Mic,
  Volume2,
  Globe,
  Database,
  Sparkles,
  ChevronDown,
  FileText,
  PlusCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function Navbar({ onNewDebateModalOpen }) {
  const {
    currentDebate,
    debates,
    selectDebate,
    selectedLanguage,
    setSelectedLanguage,
    setIsVoiceReportOpen,
    testAudioSound,
  } = useDebate();

  const [debatesDropdownOpen, setDebatesDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 py-2.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 shadow-md shadow-indigo-500/20 text-white">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg font-bold tracking-wider text-slate-100">
                AI DEBATE REFEREE
              </span>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                NLP + DEEP LEARNING
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              “Analyze the Argument. Understand the Reasoning. Improve the Thinking.”
            </p>
          </div>
        </div>

        {/* Active Debate Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setDebatesDropdownOpen(!debatesDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition"
          >
            <span className="max-w-[220px] truncate font-medium">
              {currentDebate?.title || 'Select Debate Topic...'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {debatesDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl shadow-black z-50">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Available Debates ({debates.length})
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {debates.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      selectDebate(d.id);
                      setDebatesDropdownOpen(false);
                    }}
                    className={`w-full rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      currentDebate?.id === d.id
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <p className="font-semibold truncate">{d.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{d.topic}</p>
                  </button>
                ))}
              </div>
              <div className="mt-1 border-t border-slate-800 pt-1">
                <button
                  onClick={() => {
                    setDebatesDropdownOpen(false);
                    onNewDebateModalOpen?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-indigo-400 hover:bg-indigo-950/40"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Start New Debate</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-700"
              title="Multilingual NLP Support"
            >
              <Globe className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-medium uppercase">{selectedLanguage}</span>
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-xl z-50">
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-400">
                  Multilingual NLP
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setSelectedLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                      selectedLanguage === l.code
                        ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] text-slate-400">{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Voice Report Trigger */}
          <button
            onClick={() => setIsVoiceReportOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition"
            title="Listen to AI Voice Analysis Report"
          >
            <Volume2 className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Voice Report</span>
          </button>

          {/* Quick Sound Test Pill */}
          <button
            onClick={testAudioSound}
            className="hidden md:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300 transition"
            title="Test Audio Output & Voice Synthesis"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Test Sound</span>
          </button>

          {/* System Status Pill */}
          <div className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-400 font-code">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SQLite Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
