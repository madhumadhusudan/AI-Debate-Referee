import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, User, AlertCircle, Play } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function TextDebate() {
  const { currentDebate, postStatement, playSentenceAudio, setFeedbackTarget } = useDebate();
  const [statementText, setStatementText] = useState('');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const participants = currentDebate?.participants || [];
  const statements = currentDebate?.statements || [];

  const partA = participants[0] || { id: 'p-sarah', name: 'Dr. Sarah Chen' };
  const partB = participants[1] || { id: 'p-marcus', name: 'Marcus Vance' };

  const currentSpeakerId = selectedSpeakerId || partA.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!statementText.trim()) return;

    const speaker = participants.find((p) => p.id === currentSpeakerId) || partA;
    try {
      setIsSubmitting(true);
      await postStatement({
        participant_id: speaker.id,
        speaker_name: speaker.name,
        text: statementText.trim(),
        timestamp_start: statements.length * 15,
        timestamp_end: (statements.length + 1) * 15,
      });
      setStatementText('');
      // Alternate speaker automatically for smooth debate flow
      setSelectedSpeakerId(currentSpeakerId === partA.id ? partB.id : partA.id);
    } catch (err) {
      alert('Failed to post statement: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
              Mode A: Text Debate
            </span>
            <span className="text-xs text-slate-400">• Dialectic Turn Management</span>
          </div>
          <h1 className="font-cinzel text-lg font-bold text-slate-100">
            {currentDebate?.title || 'Text Dialectic Stream'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit propositions for each speaker; the NLP engine extracts claims, evidence, and logical fallacies in real-time.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-semibold text-slate-300">
            Select Active Speaker:
          </label>
          <div className="flex items-center gap-2">
            {participants.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setSelectedSpeakerId(p.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                  currentSpeakerId === p.id
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>{p.name}</span>
                <span className="text-[10px] opacity-70">({p.side})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={statementText}
            onChange={(e) => setStatementText(e.target.value)}
            placeholder="Type or paste reasoned argument statement here... (e.g. 'Peer-reviewed studies indicate a 35% decline in adolescent attention spans...')"
            rows={4}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500">
            NLP pipeline runs automatically on submission
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !statementText.trim()}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Analyzing NLP...' : 'Submit Argument Turn'}</span>
          </button>
        </div>
      </form>

      {/* Stream of Analyzed Statements */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Dialectic Exchanges ({statements.length})
        </h3>

        {statements.map((s, idx) => {
          const isSideA = s.speaker_name?.includes('Sarah') || s.participant_id === partA.id;
          return (
            <div
              key={s.id}
              className={`rounded-2xl border p-4 transition ${
                isSideA
                  ? 'border-indigo-500/30 bg-slate-900/80'
                  : 'border-amber-500/30 bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-xs font-bold ${
                      isSideA ? 'text-indigo-300' : 'text-amber-300'
                    }`}
                  >
                    #{idx + 1} {s.speaker_name}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 capitalize">
                    {s.statement_type || 'Claim'}
                  </span>
                  {s.emotion && (
                    <span className="text-[10px] text-slate-400">
                      Tone: <span className="font-semibold text-slate-300">{s.emotion}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playSentenceAudio(s)}
                    className="flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-300 hover:text-indigo-300 transition"
                    title="Simulate Audio Timeline"
                  >
                    <Play className="h-3 w-3" />
                    <span>Play Audio</span>
                  </button>
                  <button
                    onClick={() =>
                      setFeedbackTarget({
                        id: s.id,
                        text: s.text,
                        originalPrediction: s.statement_type,
                        taskType: 'statement_classification',
                      })
                    }
                    className="rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-400 hover:text-slate-200"
                  >
                    Correct AI
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{s.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
