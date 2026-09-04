import React, { useState } from 'react';
import { Swords, Check, AlertCircle, ShieldAlert, Scale, ExternalLink } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function EvidenceBattle() {
  const { currentDebate } = useDebate();
  const evidenceList = currentDebate?.evidence || [];
  const participants = currentDebate?.participants || [];

  const partA = participants[0] || { id: 'p-sarah', name: 'Dr. Sarah Chen', side: 'Affirmative' };
  const partB = participants[1] || { id: 'p-marcus', name: 'Marcus Vance', side: 'Negative' };

  const evidenceA = evidenceList.filter((e) => e.speaker_id === partA.id || e.speaker_id === 'p-sarah');
  const evidenceB = evidenceList.filter((e) => e.speaker_id === partB.id || e.speaker_id === 'p-marcus');

  const [selectedAId, setSelectedAId] = useState(evidenceA[0]?.id || 'ev-1');
  const [selectedBId, setSelectedBId] = useState(evidenceB[0]?.id || 'ev-2');

  const activeA = evidenceA.find((e) => e.id === selectedAId) || evidenceA[0] || {
    text: '2023 Journal of Adolescent Health meta-analysis indicating 35% increase in depressive symptoms.',
    source: 'Journal of Adolescent Health (Peer-Reviewed)',
    reliability: 'High',
    relevance: 0.88,
    directness: 'Direct Empirical',
    evidence_type: 'Empirical Meta-Analysis',
  };

  const activeB = evidenceB.find((e) => e.id === selectedBId) || evidenceB[0] || {
    text: 'Stanford Internet Observatory dossier on compliance costs for small digital platforms.',
    source: 'Stanford Internet Observatory Technical Report',
    reliability: 'High',
    relevance: 0.84,
    directness: 'Economic Proxy Measurement',
    evidence_type: 'Regulatory Impact Study',
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
            Flagship Feature #3
          </span>
          <span className="text-xs text-slate-400">• Multi-Dimensional Evidence Arbitration</span>
        </div>
        <h1 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">
          Evidence Battle Matrix
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl leading-relaxed">
          Side-by-side comparative analysis of empirical citations across reliability, methodological directness, source independence, and relevance — without declaring a winner.
        </p>
      </div>

      {/* Selectors for Both Sides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Evidence A Picker */}
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-300">Side A Evidence ({partA.name})</span>
            <span className="text-[10px] text-slate-400">{evidenceA.length} Citations Available</span>
          </div>
          <select
            value={selectedAId}
            onChange={(e) => setSelectedAId(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {evidenceA.map((e) => (
              <option key={e.id} value={e.id}>
                {e.source || e.text.slice(0, 50)}...
              </option>
            ))}
          </select>
        </div>

        {/* Evidence B Picker */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300">Side B Evidence ({partB.name})</span>
            <span className="text-[10px] text-slate-400">{evidenceB.length} Citations Available</span>
          </div>
          <select
            value={selectedBId}
            onChange={(e) => setSelectedBId(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            {evidenceB.map((e) => (
              <option key={e.id} value={e.id}>
                {e.source || e.text.slice(0, 50)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparative Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card A */}
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Affirmative Citation
              </span>
              <h3 className="text-sm font-bold text-slate-100">{activeA.source || 'Journal Meta-Analysis'}</h3>
            </div>
            <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
              {activeA.reliability || 'High'} Reliability
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Quoted Evidence:</span>
            <p className="text-xs text-slate-200 mt-1 italic leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              "{activeA.text}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <span className="text-[10px] text-slate-400 uppercase">Topical Relevance</span>
              <p className="text-base font-bold font-code text-indigo-300 mt-0.5">
                {Math.round((activeA.relevance || 0.88) * 100)}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <span className="text-[10px] text-slate-400 uppercase">Methodological Directness</span>
              <p className="text-xs font-semibold text-slate-200 mt-1">
                {activeA.directness || 'Direct Empirical'}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
            <span className="font-semibold text-indigo-400 block mb-1">Methodological Assessment:</span>
            Large sample cross-sectional survey with high statistical power; however, longitudinal isolation between screentime hours and pre-existing mental vulnerability remains an uncontrolled variable.
          </div>
        </div>

        {/* Card B */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Opposition Citation
              </span>
              <h3 className="text-sm font-bold text-slate-100">{activeB.source || 'Regulatory Impact Study'}</h3>
            </div>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
              {activeB.reliability || 'High'} Reliability
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Quoted Evidence:</span>
            <p className="text-xs text-slate-200 mt-1 italic leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              "{activeB.text}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <span className="text-[10px] text-slate-400 uppercase">Topical Relevance</span>
              <p className="text-base font-bold font-code text-amber-300 mt-0.5">
                {Math.round((activeB.relevance || 0.84) * 100)}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <span className="text-[10px] text-slate-400 uppercase">Methodological Directness</span>
              <p className="text-xs font-semibold text-slate-200 mt-1">
                {activeB.directness || 'Economic Impact'}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
            <span className="font-semibold text-amber-400 block mb-1">Methodological Assessment:</span>
            Rigorous compliance financial modeling highlighting barriers to entry; however, assumes standard uniform fines without accounting for graduated tier exemptions for emerging startups.
          </div>
        </div>
      </div>

      {/* Referee Comparative Synthesis (No Winner Declared!) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="flex items-center gap-2 mb-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
          <Scale className="h-4 w-4 text-cyan-400" />
          <span>Epistemic Comparative Verdict (Neutral Arbitration)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Both pieces of evidence operate on distinct empirical planes. Affirmative Evidence examines adolescent neurological harm through public health clinical metrics, whereas Opposition Evidence evaluates institutional market friction and constitutional protections. Neither piece invalidates the other: a society can face legitimate mental health externalities while simultaneously confronting valid bureaucratic censorship risks.
        </p>
      </div>
    </div>
  );
}
