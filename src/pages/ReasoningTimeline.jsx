import React, { useState } from 'react';
import { GitCommit, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function ReasoningTimeline() {
  const { currentDebate, playSentenceAudio } = useDebate();
  const statements = currentDebate?.statements || [];

  const [filterSpeaker, setFilterSpeaker] = useState('all');

  const timelineEvents = [
    {
      step: 1,
      time: '00:00 - 00:24',
      speaker: 'Dr. Sarah Chen (Affirmative)',
      action: 'Initial Claim Anchoring',
      claim: 'Social media algorithms constitute a public health crisis.',
      status: 'Introduced',
      statusColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      evidenceUsed: 'Journal of Adolescent Health (35% depression increase)',
      dialecticalImpact: 'Establishes initial empirical high ground focusing on clinical mental health metrics.',
      statementRef: statements[0],
    },
    {
      step: 2,
      time: '00:25 - 00:48',
      speaker: 'Marcus Vance (Negative)',
      action: 'Counter-Premise Framing',
      claim: 'State-mandated algorithmic control equals speech censorship and market concentration.',
      status: 'Challenged',
      statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      evidenceUsed: 'First Amendment editorial discretion jurisprudence',
      dialecticalImpact: 'Shifts debate axis from psychological wellbeing to constitutional law and tech monopolization.',
      statementRef: statements[1],
    },
    {
      step: 3,
      time: '00:49 - 01:12',
      speaker: 'Dr. Sarah Chen (Affirmative)',
      action: 'Analogy Strengthening & Defense',
      claim: 'Regulating product distribution algorithms is equivalent to automotive seatbelt mandates.',
      status: 'Reinforced',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      evidenceUsed: 'EU Digital Services Act algorithmic transparency audits',
      dialecticalImpact: 'Deflects the "censorship" accusation by categorizing algorithms as engineered delivery products rather than speech.',
      statementRef: statements[2],
    },
    {
      step: 4,
      time: '01:13 - 01:38',
      speaker: 'Marcus Vance (Negative)',
      action: 'Nuanced Concession & Economic Pivot',
      claim: 'Transparency is acceptable, but mandatory content throttling will kill open-source AI and independent platforms.',
      status: 'Modified',
      statusColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      evidenceUsed: 'Stanford Internet Observatory compliance expense report',
      dialecticalImpact: 'Concedes the auditability premise while raising a fatal implementation hurdle for startup competition.',
      statementRef: statements[3],
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
            Flagship Feature #4
          </span>
          <span className="text-xs text-slate-400">• Dynamic Argument Trajectory</span>
        </div>
        <h1 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">
          Reasoning Evolution Timeline
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl leading-relaxed">
          Chronological mapping of how propositions were introduced, attacked, reinforced, modified, or shifted across dialectical turns.
        </p>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 ml-4">
        {timelineEvents.map((evt) => (
          <div key={evt.step} className="relative">
            {/* Dot marker */}
            <div className="absolute -left-[31px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 border-2 border-indigo-500 text-[10px] font-bold text-indigo-400">
              {evt.step}
            </div>

            {/* Event Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="font-code text-xs text-slate-300">{evt.time}</span>
                  <span className="text-xs font-bold text-slate-100">• {evt.speaker}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${evt.statusColor}`}>
                    {evt.status}
                  </span>
                  {evt.statementRef && (
                    <button
                      onClick={() => playSentenceAudio(evt.statementRef)}
                      className="rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-300 hover:text-indigo-300 transition"
                    >
                      Replay Turn
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Proposition:</span>
                  <p className="text-xs font-semibold text-slate-100 mt-0.5 leading-relaxed">
                    "{evt.claim}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-2.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Supporting Citation:</span>
                    <p className="text-xs text-emerald-300 mt-0.5">{evt.evidenceUsed}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-2.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Dialectical Trajectory:</span>
                    <p className="text-xs text-slate-300 mt-0.5">{evt.dialecticalImpact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
