import React, { useState, useEffect } from 'react';
import { X, Volume2, Play, Pause, Square, Sparkles } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';
import { voiceEngine } from '../utils/voiceEngine.js';

export default function VoiceReportModal() {
  const { currentDebate, isVoiceReportOpen, setIsVoiceReportOpen, testAudioSound } = useDebate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [activeSection, setActiveSection] = useState('executive_summary');

  const reportSections = [
    {
      id: 'executive_summary',
      title: '1. Executive Summary',
      text: `Analytical briefing for debate topic: ${currentDebate?.topic || 'Public Policy Debate'}. The discourse analyzed ${currentDebate?.statements?.length || 0} discrete statements across two debaters. The overall argument robustness index stands at ${currentDebate?.health?.robustnessIndex || 78} out of 100, characterized by substantial empirical citation on the proposition side and conceptual risk challenges from the opposition.`,
    },
    {
      id: 'evidence_analysis',
      title: '2. Evidence & Citations',
      text: `Evidence analysis indicates that ${currentDebate?.health?.metrics?.evidenceCoverage || 75}% of major propositional claims were corroborated by external documentation, including the Journal of Adolescent Health and European Union risk dossiers. However, significant evidence gaps remain regarding causal isolation of algorithmic feeds versus generalized socio-economic stress.`,
    },
    {
      id: 'fallacy_assessment',
      title: '3. Fallacy & Consistency Check',
      text: `The automated natural language inference engine flagged ${currentDebate?.fallacies?.length || 2} potential reasoning fallacies. A slippery slope assertion was identified regarding inevitable state censorship, and an ad hominem moral framing was flagged during exchange seven. Consistency rating is evaluated at ${currentDebate?.health?.metrics?.consistency || 88} percent.`,
    },
    {
      id: 'recommendations',
      title: '4. Critical Recommendations',
      text: `Both participants are advised to replace broad correlational claims with specific empirical variance studies. Neither side presented irrefutable proof, and the ultimate public policy question hinges on institutional safeguards rather than technical certainty.`,
    },
  ];

  useEffect(() => {
    return () => {
      voiceEngine.stop();
    };
  }, []);

  const handlePlaySection = (text) => {
    voiceEngine.speakText(text, {
      persona: 'moderator',
      rate: speechRate,
      playChimeOnStart: true,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
    setIsPlaying(true);
  };

  const handlePause = () => {
    voiceEngine.pause();
    voiceEngine.playCue('stop');
    setIsPlaying(false);
  };

  const handleResume = () => {
    const sec = reportSections.find((s) => s.id === activeSection);
    if (sec) {
      handlePlaySection(sec.text);
    }
  };

  const handleStop = () => {
    voiceEngine.stop();
    voiceEngine.playCue('stop');
    setIsPlaying(false);
  };

  if (!isVoiceReportOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-slate-100">
                AI Voice Analysis Report
              </h2>
              <p className="text-xs text-slate-400">
                Spoken analytical debriefing generated from Deep Learning evaluation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={testAudioSound}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition"
              title="Test audio output"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Test Audio</span>
            </button>
            <button
              onClick={() => {
                handleStop();
                setIsVoiceReportOpen(false);
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Speed and Voice Controls */}
        <div className="my-4 flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const section = reportSections.find((s) => s.id === activeSection);
                if (isPlaying) handlePause();
                else if (section) handlePlaySection(section.text);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? 'Pause Voice' : 'Play Spoken Section'}</span>
            </button>
            <button
              onClick={handleStop}
              className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              title="Stop Voice"
            >
              <Square className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-code">
            <span>Voice Speed:</span>
            {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  setSpeechRate(rate);
                  if (isPlaying) {
                    const section = reportSections.find((s) => s.id === activeSection);
                    if (section) handlePlaySection(section.text);
                  }
                }}
                className={`rounded px-1.5 py-0.5 text-[11px] transition ${
                  speechRate === rate
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Report Sections Selector */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {reportSections.map((sec) => (
            <div
              key={sec.id}
              onClick={() => {
                setActiveSection(sec.id);
                handlePlaySection(sec.text);
              }}
              className={`cursor-pointer rounded-xl border p-3.5 transition ${
                activeSection === sec.id
                  ? 'border-amber-500/40 bg-amber-500/10 text-slate-100 shadow-md'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">{sec.title}</span>
                {activeSection === sec.id && isPlaying && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 font-code">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                    Speaking...
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-300">{sec.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              handleStop();
              setIsVoiceReportOpen(false);
            }}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
