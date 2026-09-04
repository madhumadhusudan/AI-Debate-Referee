import React from 'react';
import { Activity, ShieldCheck, HelpCircle, CheckCircle, AlertTriangle, FileCode } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function ArgumentHealthCheck() {
  const { currentDebate } = useDebate();

  const health = currentDebate?.health || {};
  const metrics = health.metrics || {
    evidenceCoverage: 78,
    logicalCoherence: 81,
    claimSupport: 73,
    consistency: 89,
    counterargumentHandling: 70,
    evidenceGap: 42,
  };

  const explanations = health.explanations || {
    evidenceCoverage: 'Percentage of empirical claims corroborated by cited external sources or peer-reviewed studies.',
    logicalCoherence: 'Resistance to formal and informal logical fallacies across debate turns.',
    claimSupport: 'Ratio of factual or observational foundations relative to subjective policy opinions.',
    consistency: 'Logical harmony between premise statements without direct cross-contradictions.',
    counterargumentHandling: 'Extent to which participants directly engaged opponent rebuttals rather than deflecting.',
    evidenceGap: 'Unproven leaps and missing evidentiary foundations requiring future empirical verification.',
  };

  const dimensions = [
    {
      title: 'Evidence Coverage',
      value: metrics.evidenceCoverage,
      target: '≥ 75%',
      formula: 'Coverage = (Corroborated Claims / Total Empirical Claims) × 100',
      description: explanations.evidenceCoverage,
      status: metrics.evidenceCoverage >= 75 ? 'Optimal' : 'Needs Citation',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-400',
    },
    {
      title: 'Logical Coherence',
      value: metrics.logicalCoherence,
      target: '≥ 80%',
      formula: 'Coherence = 100 - Σ(Fallacy Detection Confidence × Fallacy Severity)',
      description: explanations.logicalCoherence,
      status: metrics.logicalCoherence >= 80 ? 'Sound' : 'Vulnerable',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
    },
    {
      title: 'Claim Support',
      value: metrics.claimSupport,
      target: '≥ 70%',
      formula: 'Support = (Empirical Claims + Direct Data) / Total Assertions',
      description: explanations.claimSupport,
      status: metrics.claimSupport >= 70 ? 'Substantiated' : 'Speculative',
      color: 'bg-cyan-500',
      textColor: 'text-cyan-400',
    },
    {
      title: 'Dialectical Consistency',
      value: metrics.consistency,
      target: '≥ 85%',
      formula: 'Consistency = 100 - (Direct NLI Contradictions × 12.5)',
      description: explanations.consistency,
      status: metrics.consistency >= 85 ? 'Harmonious' : 'Tension Detected',
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
    },
    {
      title: 'Counterargument Handling',
      value: metrics.counterargumentHandling,
      target: '≥ 65%',
      formula: 'Handling = (Direct Rebuttals Addressed / Opponent Challenges) × 100',
      description: explanations.counterargumentHandling,
      status: metrics.counterargumentHandling >= 65 ? 'Responsive' : 'Deflective',
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
    },
    {
      title: 'Evidence Gap Risk',
      value: metrics.evidenceGap,
      target: '≤ 35%',
      formula: 'Gap = 100 - Evidence Coverage + Epistemic Assumption Weight',
      description: explanations.evidenceGap,
      status: metrics.evidenceGap <= 45 ? 'Controlled' : 'High Risk',
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                Flagship Diagnostic #1
              </span>
              <span className="text-xs text-slate-400">• Explainable AI Audit</span>
            </div>
            <h1 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">
              Argument Health Diagnostics
            </h1>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
              Transparent multi-dimensional index measuring argument soundness, evidence integrity, and dialectical consistency without declaring subjective winners.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-slate-950 p-4 border border-slate-800 shrink-0">
            <Activity className="h-8 w-8 text-indigo-400" />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Composite Robustness Index
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-cinzel text-3xl font-extrabold text-indigo-300">
                  {health.robustnessIndex || 78}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Six Health Metrics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dimensions.map((dim) => (
          <div
            key={dim.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-200">{dim.title}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-800 ${dim.textColor} bg-slate-950`}>
                  {dim.status}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-code text-2xl font-extrabold text-slate-100">{dim.value}%</span>
                <span className="text-[11px] text-slate-500 font-code">(Target: {dim.target})</span>
              </div>

              {/* Progress visual */}
              <div className="h-2 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full ${dim.color}`}
                  style={{ width: `${Math.min(100, dim.value)}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {dim.description}
              </p>
            </div>

            {/* Formula box */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-[10px] font-code text-slate-400">
              <span className="font-bold text-slate-300 block mb-0.5">Scoring Formula:</span>
              <code className="text-indigo-300/90">{dim.formula}</code>
            </div>
          </div>
        ))}
      </div>

      {/* Epistemic Health Summary & Explainable Recommendation */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Referee Diagnostic Synthesis</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The discourse demonstrates strong foundational evidence coverage (78%) in the initial propositions, but exhibits a divergence in counterargument handling (70%) as debate turns progressed. Specifically, Participant A anchored their stance in medical and regulatory statutes, while Participant B applied valid free-market friction models. Both debaters must resolve their shared evidence gap (42%) regarding whether platform algorithms are the primary cause or merely an accelerating co-variable of youth mental distress.
        </p>
      </div>
    </div>
  );
}
