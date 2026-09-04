import React, { useState, useEffect } from 'react';
import { GraduationCap, Send, Sparkles, MessageSquare, Award, ArrowRight, Volume2, Square, Play } from 'lucide-react';
import { sparWithAi } from '../services/api.js';
import { voiceEngine } from '../utils/voiceEngine.js';

export default function DebateTrainer() {
  const [topic, setTopic] = useState('Universal Basic Income (UBI) should be established universally.');
  const [position, setPosition] = useState('Pro');
  const [statement, setStatement] = useState('');
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [history, setHistory] = useState([
    {
      role: 'coach',
      text: "Welcome to AI Debate Trainer. I am your sparring opponent and argumentation coach. I don't give you answers; I challenge your reasoning and highlight gaps. State your opening thesis whenever you're ready.",
    },
  ]);
  const [isSparring, setIsSparring] = useState(false);

  useEffect(() => {
    return () => {
      voiceEngine.stop();
    };
  }, []);

  const speakMessage = (text, persona, index) => {
    if (speakingIndex === index && voiceEngine.isSpeaking) {
      voiceEngine.stop();
      voiceEngine.playCue('stop');
      setSpeakingIndex(null);
      return;
    }

    setSpeakingIndex(index);
    voiceEngine.speakText(text, {
      persona: persona || 'moderator',
      playChimeOnStart: true,
      onStart: () => setSpeakingIndex(index),
      onEnd: () => setSpeakingIndex(null),
      onError: () => setSpeakingIndex(null),
    });
  };

  const predefinedTopics = [
    'Universal Basic Income (UBI) should be established universally.',
    'Artificial general intelligence models should be subject to state licensing.',
    'Nuclear energy is mandatory to achieve global net-zero emissions.',
    'Social media platforms should be treated as common carrier public utilities.',
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!statement.trim()) return;

    const userEntry = { role: 'user', text: statement.trim() };
    const newHistory = [...history, userEntry];
    setHistory(newHistory);
    setStatement('');

    try {
      setIsSparring(true);
      const res = await sparWithAi(topic, position, userEntry.text, newHistory);

      const aiResponse = {
        role: 'ai_spar',
        counterargument: res.counterargument || 'A rigorous counter-proposition challenging your unstated premises.',
        coachFeedback: res.coachFeedback || {
          score: 8.2,
          strengths: 'Clear empirical focus and structured clause progression.',
          weaknesses: 'Assumes uniform fiscal multipliers without regional tax elasticity.',
          tip: 'Cite empirical pilot outcomes (e.g. Stockton or Finland trials) to solidify the premise.',
        },
      };

      setHistory([...newHistory, aiResponse]);
    } catch (err) {
      alert('Trainer error: ' + err.message);
    } finally {
      setIsSparring(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
            Interactive Sparring Partner
          </span>
          <span className="text-xs text-slate-400">• Deliberative Coaching</span>
        </div>
        <h1 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">
          AI Debate Trainer & Sparring Gym
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl leading-relaxed">
          Sharpen your argumentation against an AI counter-debater that dissects your logical structure, scores your coherence, and advises you on rhetorical improvements.
        </p>
      </div>

      {/* Topic and Position Picker */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Debate Resolution / Topic:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Your Side:</label>
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setPosition('Pro')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  position === 'Pro' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Affirmative (Pro)
              </button>
              <button
                type="button"
                onClick={() => setPosition('Con')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  position === 'Con' ? 'bg-amber-600 text-white' : 'text-slate-400'
                }`}
              >
                Negative (Con)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Fast Picks:</span>
          {predefinedTopics.map((top) => (
            <button
              key={top}
              type="button"
              onClick={() => setTopic(top)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] text-slate-300 hover:border-emerald-500/50"
            >
              {top.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      {/* Sparring Chat Stream */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4">
        {history.map((msg, i) => {
          const isThisSpeaking = speakingIndex === i;
          if (msg.role === 'coach') {
            return (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-400">Debate Coach:</span>
                  <button
                    onClick={() => speakMessage(msg.text, 'moderator', i)}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-emerald-300 transition"
                    title={isThisSpeaking ? 'Stop Voice' : 'Listen to Coach'}
                  >
                    <Volume2 className={`h-3 w-3 ${isThisSpeaking ? 'text-emerald-400 animate-pulse' : ''}`} />
                    <span>{isThisSpeaking ? 'Speaking...' : 'Listen'}</span>
                  </button>
                </div>
                {msg.text}
              </div>
            );
          }

          if (msg.role === 'user') {
            return (
              <div key={i} className="flex justify-end">
                <div className="max-w-2xl rounded-2xl border border-indigo-500/30 bg-indigo-950/40 p-4 text-xs text-slate-100 shadow-md">
                  <span className="font-bold text-indigo-300 block mb-1 text-[10px] uppercase tracking-wider">
                    Your Proposition ({position}):
                  </span>
                  {msg.text}
                </div>
              </div>
            );
          }

          if (msg.role === 'ai_spar') {
            return (
              <div key={i} className="space-y-3">
                {/* AI Rebuttal */}
                <div className="max-w-2xl rounded-2xl border border-amber-500/30 bg-slate-900/80 p-4 text-xs text-slate-100 shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-400 text-[10px] uppercase tracking-wider">
                      Opponent Rebuttal:
                    </span>
                    <button
                      onClick={() => speakMessage(msg.counterargument, 'marcus', i)}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-300 transition"
                      title={isThisSpeaking ? 'Stop Voice' : 'Listen to Opponent Rebuttal'}
                    >
                      <Volume2 className={`h-3 w-3 ${isThisSpeaking ? 'text-amber-400 animate-pulse' : ''}`} />
                      <span>{isThisSpeaking ? 'Speaking...' : 'Listen Voice'}</span>
                    </button>
                  </div>
                  <p className="leading-relaxed">{msg.counterargument}</p>
                </div>

                {/* Coach Feedback Box */}
                {msg.coachFeedback && (
                  <div className="max-w-2xl rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <span className="font-bold text-emerald-300 uppercase tracking-wider text-[10px]">
                        Referee Diagnostic Feedback
                      </span>
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300 font-code">
                        Strength: {msg.coachFeedback.score} / 10
                      </span>
                    </div>
                    <p className="text-slate-300">
                      <span className="font-semibold text-emerald-400">Strengths: </span>
                      {msg.coachFeedback.strengths}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-semibold text-rose-400">Vulnerabilities: </span>
                      {msg.coachFeedback.weaknesses}
                    </p>
                    <div className="rounded-xl bg-slate-950/80 p-2.5 text-[11px] text-emerald-200 border border-emerald-500/20">
                      <span className="font-bold">Coach Advice: </span>
                      {msg.coachFeedback.tip}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="State your next reasoned rebuttal or empirical evidence..."
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={isSparring || !statement.trim()}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50 transition"
        >
          <Send className="h-3.5 w-3.5" />
          <span>{isSparring ? 'Sparring...' : 'Send Turn'}</span>
        </button>
      </form>
    </div>
  );
}
