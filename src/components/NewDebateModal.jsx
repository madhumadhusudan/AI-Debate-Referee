import React, { useState } from 'react';
import { X, Plus, Sparkles, Scale, Users } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';
import { createDebate } from '../services/api.js';

export default function NewDebateModal({ isOpen, onClose }) {
  const { loadDebates, selectDebate } = useDebate();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [partAName, setPartAName] = useState('Dr. Sarah Chen');
  const [partARole, setPartARole] = useState('Adolescent Health Specialist');
  const [partBName, setPartBName] = useState('Marcus Vance');
  const [partBRole, setPartBRole] = useState('Technology Policy Analyst');
  const [mode, setMode] = useState('voice');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) return;

    try {
      setIsSubmitting(true);
      const newDebate = await createDebate({
        title: title.trim(),
        topic: topic.trim(),
        mode,
        participants: [
          { name: partAName, role: partARole, side: 'Affirmative' },
          { name: partBName, role: partBRole, side: 'Negative' },
        ],
      });

      await loadDebates();
      selectDebate(newDebate.id);
      onClose();
    } catch (err) {
      alert('Failed to create debate: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Initialize New Debate Session</h3>
              <p className="text-[11px] text-slate-400">Configure resolution, speakers, and arbitration mode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Debate Session Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Mandatory AI Safety Audits & Global Governance"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Resolution Topic / Core Question:
            </label>
            <textarea
              required
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Should sovereign governments enforce mandatory pre-deployment licensing for frontier AI models?"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Side A */}
            <div className="rounded-xl border border-indigo-500/20 bg-slate-950/60 p-3 space-y-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Participant A (Affirmative)
              </span>
              <input
                type="text"
                value={partAName}
                onChange={(e) => setPartAName(e.target.value)}
                placeholder="Speaker Name"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
              <input
                type="text"
                value={partARole}
                onChange={(e) => setPartARole(e.target.value)}
                placeholder="Professional Role / Background"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              />
            </div>

            {/* Side B */}
            <div className="rounded-xl border border-amber-500/20 bg-slate-950/60 p-3 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Participant B (Negative)
              </span>
              <input
                type="text"
                value={partBName}
                onChange={(e) => setPartBName(e.target.value)}
                placeholder="Speaker Name"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
              <input
                type="text"
                value={partBRole}
                onChange={(e) => setPartBRole(e.target.value)}
                placeholder="Professional Role / Background"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Creating Debate...' : 'Initialize Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
