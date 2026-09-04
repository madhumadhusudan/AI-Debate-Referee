import React, { useState } from 'react';
import { X, Check, Database, MessageSquare } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';
import { submitHumanFeedback } from '../services/api.js';

export default function FeedbackModal() {
  const { feedbackTarget, setFeedbackTarget } = useDebate();
  const [correctedLabel, setCorrectedLabel] = useState('Claim');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!feedbackTarget) return null;

  const candidateLabels = [
    'Claim',
    'Evidence',
    'Rebuttal',
    'Counterclaim',
    'Opinion',
    'Fact',
    'Assumption',
    'Question',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await submitHumanFeedback({
        statement_id: feedbackTarget.id,
        original_prediction: feedbackTarget.originalPrediction || 'Unknown',
        corrected_label: correctedLabel,
        task_type: feedbackTarget.taskType || 'classification',
        notes,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedbackTarget(null);
      }, 1200);
    } catch (err) {
      alert('Failed to submit feedback: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Human Feedback Loop</h3>
              <p className="text-[11px] text-slate-400">Correct AI classification for model evaluation</p>
            </div>
          </div>
          <button
            onClick={() => setFeedbackTarget(null)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="my-8 flex flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
              <Check className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-emerald-300">Correction Recorded!</p>
            <p className="text-xs text-slate-400 mt-1">
              Appended to SQLite feedback dataset for model fine-tuning and evaluation metrics.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Target Statement
              </span>
              <p className="text-xs text-slate-300 mt-1 italic">
                "{feedbackTarget.text || 'Selected statement text'}"
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <span>AI Predicted:</span>
                <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-rose-300 font-semibold">
                  {feedbackTarget.originalPrediction}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Correct Linguistic Classification
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {candidateLabels.map((lbl) => (
                  <button
                    type="button"
                    key={lbl}
                    onClick={() => setCorrectedLabel(lbl)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                      correctedLabel === lbl
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Linguistic Reasoning / Academic Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Explain why this statement belongs to the corrected class..."
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setFeedbackTarget(null)}
                className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
