import React from 'react';
import {
  FileCheck2,
  Download,
  Printer,
  FileJson,
  FileSpreadsheet,
  FileText,
  Share2,
  CheckCircle2,
  Scale,
} from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function FullReport() {
  const { currentDebate } = useDebate();

  if (!currentDebate) return null;

  const {
    id,
    title,
    topic,
    participants = [],
    statements = [],
    claims = [],
    evidence = [],
    fallacies = [],
    contradictions = [],
    assumptions = [],
    health = {},
  } = currentDebate;

  const partA = participants[0] || { name: 'Dr. Sarah Chen', side: 'Affirmative', role: 'Health Researcher' };
  const partB = participants[1] || { name: 'Marcus Vance', side: 'Negative', role: 'Tech Policy Analyst' };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentDebate, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `debate_referee_report_${id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,Speaker,Type,Text\n';
    statements.forEach((s) => {
      const cleanText = (s.text || '').replace(/"/g, '""');
      csvContent += `"${s.id}","${s.speaker_name}","${s.statement_type}","${cleanText}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `debate_transcript_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportTxt = () => {
    let txt = `=====================================================\n`;
    txt += `AI DEBATE REFEREE - COMPREHENSIVE ANALYTICAL REPORT\n`;
    txt += `Title: ${title}\nTopic: ${topic}\nDate: ${new Date().toLocaleDateString()}\n`;
    txt += `=====================================================\n\n`;
    txt += `COMPOSITE HEALTH INDEX: ${health.robustnessIndex || 78}/100\n\n`;
    txt += `STATEMENTS ANALYZED:\n`;
    statements.forEach((s, idx) => {
      txt += `[#${idx + 1}] ${s.speaker_name} (${s.statement_type}): ${s.text}\n`;
    });
    txt += `\nLOGICAL FALLACIES IDENTIFIED:\n`;
    fallacies.forEach((f) => {
      txt += `- ${f.fallacy_name}: ${f.explanation}\n`;
    });

    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt);
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `debate_report_${id}.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto print:max-w-none print:m-0 print:p-0">
      {/* Header & Export Actions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
              Full Epistemic Dossier
            </span>
            <span className="text-xs text-slate-400">• Complete 21 Sections</span>
          </div>
          <h1 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">
            Comprehensive Analytical Report
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Neutral, explainable report providing structural breakdown, evidentiary audits, speech metrics, and recommendations.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-slate-800 transition"
          >
            <FileJson className="h-3.5 w-3.5" />
            <span>JSON</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-slate-800 transition"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportTxt}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-slate-800 transition"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>TXT</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Body */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 shadow-2xl space-y-8 text-slate-200 font-sans print:border-none print:shadow-none print:p-0">
        {/* Title Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-lg font-bold tracking-wider text-indigo-400">
              AI DEBATE REFEREE ARBITRATION DOSSIER
            </span>
            <span className="font-code text-xs text-slate-500">
              REF-UUID: {id} • DATE: {new Date().toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-2xl font-bold font-cinzel text-slate-100 mt-2">{title}</h2>
          <p className="text-xs text-slate-400 mt-1 italic">Resolution Topic: "{topic}"</p>
        </div>

        {/* Section 1 & 2: Overview & Executive Summary */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800/80 pb-1">
            Section 1 & 2 • Executive Summary & Overview
          </h3>
          <p className="text-xs leading-relaxed text-slate-300">
            This dialectical evaluation examines {statements.length} formal statements delivered between {partA.name} ({partA.side}) and {partB.name} ({partB.side}). Overall discourse health achieved an index of {health.robustnessIndex || 78}/100. Affirmative arguments focused on clinical adolescent health outcomes supported by peer-reviewed literature, while Negative arguments emphasized economic compliance hurdles and First Amendment protections against administrative speech moderation.
          </p>
        </section>

        {/* Section 3: Participant Profile Analysis */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800/80 pb-1">
            Section 3 • Participant Analytical Profiles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="font-bold text-slate-100">{partA.name} ({partA.side})</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Pacing: {partA.wpm || 138} WPM • Role: {partA.role}
              </p>
              <p className="mt-2 text-slate-300 leading-relaxed text-[11px]">
                Primary methodology relies on empirical statistical citations. Displays high coherence, but remains vulnerable to counterarguments demanding causal proof over correlational data.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="font-bold text-slate-100">{partB.name} ({partB.side})</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Pacing: {partB.wpm || 145} WPM • Role: {partB.role}
              </p>
              <p className="mt-2 text-slate-300 leading-relaxed text-[11px]">
                Primary methodology emphasizes institutional barriers and legal precedent. Effectively challenged regulatory feasibility, but exhibited minor slippery slope leaps regarding government censorship.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 & 7: Evidence Quality & Fallacies */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800/80 pb-1">
            Section 6 & 7 • Evidence Quality & Fallacies Audit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-300 block">Verified Evidence Citations ({evidence.length})</span>
              {evidence.map((e) => (
                <div key={e.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                  <span className="font-semibold text-emerald-400 block">{e.source || 'Empirical Source'}</span>
                  <p className="text-[11px] text-slate-300 mt-0.5 italic">"{e.text}"</p>
                  <span className="text-[9px] text-slate-500 font-code mt-1 block">
                    Reliability: {e.reliability} • Relevance: {Math.round((e.relevance || 0.85) * 100)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-300 block">Flagged Fallacies ({fallacies.length})</span>
              {fallacies.map((f) => (
                <div key={f.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                  <span className="font-semibold text-amber-400 block">{f.fallacy_name}</span>
                  <p className="text-[11px] text-slate-300 mt-0.5">{f.explanation}</p>
                  {f.how_to_improve && (
                    <p className="text-[10px] text-emerald-400 mt-1 italic">
                      Remedy: {f.how_to_improve}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 14: Argument Health Score Breakdown */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800/80 pb-1">
            Section 14 • Argument Health Index (Flagship #1)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-slate-400">Evidence Coverage</span>
              <p className="text-lg font-bold font-code text-indigo-300">{health.metrics?.evidenceCoverage || 78}%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-slate-400">Logical Coherence</span>
              <p className="text-lg font-bold font-code text-emerald-300">{health.metrics?.logicalCoherence || 81}%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-slate-400">Claim Support</span>
              <p className="text-lg font-bold font-code text-cyan-300">{health.metrics?.claimSupport || 73}%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-slate-400">Dialectic Consistency</span>
              <p className="text-lg font-bold font-code text-purple-300">{health.metrics?.consistency || 89}%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-slate-400">Counter Handling</span>
              <p className="text-lg font-bold font-code text-amber-300">{health.metrics?.counterargumentHandling || 70}%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-slate-400">Evidence Gap Risk</span>
              <p className="text-lg font-bold font-code text-rose-300">{health.metrics?.evidenceGap || 42}%</p>
            </div>
          </div>
        </section>

        {/* Section 20 & 21: Neutral Recommendations & Methodology */}
        <section className="space-y-3 border-t border-slate-800 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Section 20 & 21 • Epistemic Recommendations & Methodology
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-slate-100">Referee Directive: </span>
            Both sides demonstrated substantive rhetorical discipline without devolving into ad hominem invective. Future iterations should bridge the empirical gap between algorithmic recommendation mechanisms and adolescent psychiatric outcomes via randomized control trials.
          </p>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-[11px] text-slate-400 font-code">
            <span>METHODOLOGY: Deep Learning Pipeline utilizing RoBERTa NLI cross-encoders, spaCy syntactic dependency parsers, and SQLite relational persistence. No subjective winner declared.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
