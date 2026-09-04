import React from 'react';
import { PlayCircle, Volume2, Sparkles, AlertTriangle, Scale, Activity, Play, Pause } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function DebateReplay() {
  const {
    currentDebate,
    audioCurrentTime,
    setAudioCurrentTime,
    isPlayingAudio,
    setIsPlayingAudio,
    activeStatementId,
    setActiveStatementId,
    playSentenceAudio,
    toggleAudioPlayback,
    testAudioSound,
  } = useDebate();

  const statements = currentDebate?.statements || [];
  const fallacies = currentDebate?.fallacies || [];
  const contradictions = currentDebate?.contradictions || [];

  const activeStatement = statements.find((s) => s.id === activeStatementId) || statements[0];
  const activeFallacy = fallacies.find((f) => f.statement_id === activeStatement?.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
              Flagship Feature #5
            </span>
            <span className="text-xs text-slate-400">• Synchronous Multimodal Playback</span>
          </div>
          <h1 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">
            Debate Replay with Live Reasoning Sync
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Listen to the debate as the interactive transcript highlights in real-time, displaying active logical components, claim breakdowns, and fallacy flags exactly as spoken.
          </p>
        </div>

        {/* Audio Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={testAudioSound}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-purple-500/40 hover:text-purple-300 transition"
            title="Test audio sound"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Test Sound</span>
          </button>
          <button
            onClick={toggleAudioPlayback}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-md transition ${
              isPlayingAudio
                ? 'bg-amber-600 text-white shadow-amber-600/30 hover:bg-amber-500'
                : 'bg-purple-600 text-white shadow-purple-600/30 hover:bg-purple-500'
            }`}
          >
            {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            <span>{isPlayingAudio ? 'Pause Voice' : 'Play Full Debate Voice'}</span>
          </button>
        </div>
      </div>

      {/* Main Playback & Transcript View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Synchronized Transcript Stream (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Interactive Transcript Stream
            </span>
            <span className="text-[10px] text-slate-500">Click any sentence to jump audio</span>
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {statements.map((s) => {
              const isActive = s.id === activeStatement?.id;
              const hasFallacy = fallacies.some((f) => f.statement_id === s.id);
              const isSideA = s.speaker_name?.includes('Sarah');

              return (
                <div
                  key={s.id}
                  onClick={() => playSentenceAudio(s)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition ${
                    isActive
                      ? 'border-purple-500 bg-purple-950/30 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/50'
                      : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          isSideA ? 'text-indigo-300' : 'text-amber-300'
                        }`}
                      >
                        {s.speaker_name}
                      </span>
                      <span className="text-[10px] font-code text-slate-500">
                        {s.timestamp_start}s - {s.timestamp_end}s
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasFallacy && (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                          Fallacy Flag
                        </span>
                      )}
                      {isActive && isPlayingAudio && (
                        <span className="flex items-center gap-1 text-[10px] text-purple-400 font-code animate-pulse">
                          <Volume2 className="h-3 w-3" />
                          <span>Playing</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      isActive ? 'text-slate-100 font-medium' : 'text-slate-300'
                    }`}
                  >
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Active Reasoning Card & Fallacy Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Proposition Card */}
          <div className="rounded-2xl border border-purple-500/30 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Active Reasoning Dissection
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-code text-slate-400">
                Turn @ {activeStatement?.timestamp_start || 0}s
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Speaker:</span>
                <p className="font-bold text-slate-100 mt-0.5">{activeStatement?.speaker_name}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Linguistic Category:</span>
                <p className="font-code text-indigo-300 capitalize mt-0.5">
                  {activeStatement?.statement_type || 'Empirical Claim'}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Underlying Premise:</span>
                <p className="text-slate-200 mt-0.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {activeStatement?.text}
                </p>
              </div>
            </div>
          </div>

          {/* Active Fallacy Alert at this moment */}
          {activeFallacy ? (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-5 animate-pulse">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Fallacy Detected During this Turn</span>
              </div>
              <h4 className="text-sm font-bold text-amber-200">{activeFallacy.fallacy_name}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {activeFallacy.explanation}
              </p>
              {activeFallacy.how_to_improve && (
                <div className="mt-2 rounded-lg bg-slate-950/80 p-2 text-[11px] text-emerald-400">
                  <span className="font-semibold">Remedy: </span>
                  {activeFallacy.how_to_improve}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-center text-slate-400 text-xs">
              <p className="font-semibold text-slate-300">No Fallacies in Active Turn</p>
              <p className="text-[11px] mt-1 text-slate-500">
                The proposition adheres to logical syntax without formal fallacy violations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
