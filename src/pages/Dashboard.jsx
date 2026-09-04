import React from 'react';
import {
  Scale,
  ShieldAlert,
  GitFork,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function Dashboard({ setActiveTab }) {
  const { currentDebate, playSentenceAudio } = useDebate();

  if (!currentDebate) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        Loading debate analytical state...
      </div>
    );
  }

  const {
    title,
    topic,
    participants = [],
    statements = [],
    claims = [],
    evidence = [],
    fallacies = [],
    contradictions = [],
    health = {},
  } = currentDebate;

  const partA = participants[0] || { name: 'Proposition', role: 'Affirmative', wpm: 138 };
  const partB = participants[1] || { name: 'Opposition', role: 'Negative', wpm: 145 };

  const robustnessIndex = health.robustnessIndex || 78;
  const metrics = health.metrics || {
    evidenceCoverage: 78,
    logicalCoherence: 81,
    claimSupport: 73,
    consistency: 89,
    counterargumentHandling: 70,
    evidenceGap: 42,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Neutrality & Topic */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                Active Analytical Review
              </span>
              <span className="text-xs text-slate-400">• Mode: Multimodal Dialectic</span>
            </div>
            <h1 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">{title}</h1>
            <p className="mt-1 text-xs text-slate-300 max-w-3xl leading-relaxed">
              <span className="font-semibold text-slate-200">Proposition Core: </span>
              {topic}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-slate-950/80 border border-indigo-500/30 px-6 py-4 shrink-0">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Argument Robustness
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-cinzel text-3xl font-extrabold text-indigo-400">
                {robustnessIndex}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="mt-1 text-[10px] text-emerald-400 font-medium">Neutral Multi-Factor Index</span>
          </div>
        </div>
      </div>

      {/* Flagship #1 Preview: Argument Health Metrics Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-bold tracking-wide text-slate-100">
              Argument Health Diagnostics (Flagship #1)
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('health-check')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>Full Health Breakdown</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Evidence Coverage', val: metrics.evidenceCoverage, color: 'bg-indigo-500', note: 'Supported claims' },
            { label: 'Logical Coherence', val: metrics.logicalCoherence, color: 'bg-emerald-500', note: 'Fallacy absence' },
            { label: 'Claim Support', val: metrics.claimSupport, color: 'bg-cyan-500', note: 'Empirical grounding' },
            { label: 'Consistency', val: metrics.consistency, color: 'bg-purple-500', note: 'Internal harmony' },
            { label: 'Counter Handling', val: metrics.counterargumentHandling, color: 'bg-amber-500', note: 'Rebuttals met' },
            { label: 'Evidence Gap', val: metrics.evidenceGap, color: 'bg-rose-500', note: 'Unproven leaps' },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="text-[11px] font-medium text-slate-400 truncate">{m.label}</div>
              <div className="mt-1 text-xl font-bold font-code text-slate-100">{m.val}%</div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.color}`}
                  style={{ width: `${m.val}%` }}
                />
              </div>
              <div className="mt-1.5 text-[9px] text-slate-400 truncate">{m.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Participants Comparison (Feature #31 - Non-judgmental multi-dimensional comparison) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Participant A */}
        <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <img
              src={partA.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
              alt={partA.name}
              className="h-12 w-12 rounded-xl object-cover border border-indigo-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">{partA.name}</h3>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-300 font-semibold">
                  {partA.side || 'Affirmative'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{partA.role}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-800 pt-3 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Speaking Time</span>
              <p className="text-xs font-semibold text-slate-200 font-code">{partA.speaking_time || 198}s</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Avg Rate</span>
              <p className="text-xs font-semibold text-slate-200 font-code">{partA.wpm || 138} WPM</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Claims Made</span>
              <p className="text-xs font-semibold text-indigo-300 font-code">
                {claims.filter((c) => c.speaker_id === partA.id || c.speaker_id === 'p-sarah').length || 2}
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-slate-950 p-2.5 text-[11px] text-slate-300 leading-relaxed border border-slate-800">
            <span className="font-semibold text-indigo-400">NLP Profile: </span>
            Strong empirical citations (medical journals & EU audits), though vulnerable to slippery slope interpretations regarding total child-safety trade-offs.
          </div>
        </div>

        {/* Participant B */}
        <div className="rounded-2xl border border-amber-500/20 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <img
              src={partB.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
              alt={partB.name}
              className="h-12 w-12 rounded-xl object-cover border border-amber-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">{partB.name}</h3>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300 font-semibold">
                  {partB.side || 'Negative'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{partB.role}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-800 pt-3 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Speaking Time</span>
              <p className="text-xs font-semibold text-slate-200 font-code">{partB.speaking_time || 186}s</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Avg Rate</span>
              <p className="text-xs font-semibold text-slate-200 font-code">{partB.wpm || 145} WPM</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Claims Made</span>
              <p className="text-xs font-semibold text-amber-300 font-code">
                {claims.filter((c) => c.speaker_id === partB.id || c.speaker_id === 'p-marcus').length || 2}
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-slate-950 p-2.5 text-[11px] text-slate-300 leading-relaxed border border-slate-800">
            <span className="font-semibold text-amber-400">NLP Profile: </span>
            Sharp theoretical pressure on regulatory feasibility and startup competition, but contains unproven slippery-slope assertions on inevitable state censorship.
          </div>
        </div>
      </div>

      {/* Dialectical Tension & Fallacies Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contradiction Detection */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GitFork className="h-4 w-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Identified Contradictions ({contradictions.length})
              </h3>
            </div>
            <span className="text-[10px] text-purple-400 font-code font-semibold">NLI Tension</span>
          </div>

          <div className="space-y-2.5">
            {contradictions.map((ct) => (
              <div
                key={ct.id}
                className="rounded-xl border border-purple-500/20 bg-slate-950/80 p-3"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-purple-300 mb-1">
                  <span>{ct.contradiction_type}</span>
                  <span className="font-code text-slate-400">{Math.round((ct.confidence || 0.89) * 100)}% Conf</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{ct.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fallacy Warnings */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Flagged Logical Fallacies ({fallacies.length})
              </h3>
            </div>
            <span className="text-[10px] text-amber-400 font-code font-semibold">Heuristic + DL</span>
          </div>

          <div className="space-y-2.5">
            {fallacies.map((f) => (
              <div
                key={f.id}
                className="rounded-xl border border-amber-500/20 bg-slate-950/80 p-3"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-amber-300 mb-1">
                  <span>{f.fallacy_name}</span>
                  <span className="font-code text-slate-400">{Math.round((f.confidence || 0.8) * 100)}% Conf</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-1.5">{f.explanation}</p>
                {f.how_to_improve && (
                  <p className="text-[11px] text-emerald-400/90 italic">
                    <span className="font-semibold">How to improve: </span>
                    {f.how_to_improve}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Launch Buttons for Flagships */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3">
          Explore Advanced Flagship Tools
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('argument-xray')}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-left hover:border-indigo-500/50 hover:bg-slate-800 transition"
          >
            <span className="text-[10px] font-bold text-amber-400 uppercase">Flagship #2</span>
            <p className="text-xs font-semibold text-slate-100 mt-1">Argument X-Ray</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Dissect statements into premises & inferences</p>
          </button>

          <button
            onClick={() => setActiveTab('evidence-battle')}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-left hover:border-cyan-500/50 hover:bg-slate-800 transition"
          >
            <span className="text-[10px] font-bold text-cyan-400 uppercase">Flagship #3</span>
            <p className="text-xs font-semibold text-slate-100 mt-1">Evidence Battle</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Neutral side-by-side evidence evaluation</p>
          </button>

          <button
            onClick={() => setActiveTab('reasoning-timeline')}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-left hover:border-emerald-500/50 hover:bg-slate-800 transition"
          >
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Flagship #4</span>
            <p className="text-xs font-semibold text-slate-100 mt-1">Reasoning Timeline</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Evolution of claims and counterclaims</p>
          </button>

          <button
            onClick={() => setActiveTab('debate-replay')}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-left hover:border-purple-500/50 hover:bg-slate-800 transition"
          >
            <span className="text-[10px] font-bold text-purple-400 uppercase">Flagship #5</span>
            <p className="text-xs font-semibold text-slate-100 mt-1">Debate Replay</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Synchronized audio, text & reasoning cards</p>
          </button>
        </div>
      </div>
    </div>
  );
}
