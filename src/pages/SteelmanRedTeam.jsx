import React, { useState } from 'react';
import { ShieldAlert, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';
import { requestSteelman, requestRedTeam } from '../services/api.js';

export default function SteelmanRedTeam() {
  const { currentDebate } = useDebate();
  const statements = currentDebate?.statements || [];

  const [inputArg, setInputArg] = useState(
    statements[0]?.text ||
      'Social media algorithms are harmful to children and must be regulated by the state.'
  );
  const [steelmanResult, setSteelmanResult] = useState(null);
  const [redTeamResult, setRedTeamResult] = useState(null);
  const [loadingSteelman, setLoadingSteelman] = useState(false);
  const [loadingRedTeam, setLoadingRedTeam] = useState(false);

  const handleGenerateSteelman = async () => {
    if (!inputArg.trim()) return;
    try {
      setLoadingSteelman(true);
      const res = await requestSteelman(currentDebate?.id || 'demo', inputArg);
      setSteelmanResult(res);
    } catch (err) {
      alert('Steelman generation notice: ' + err.message);
    } finally {
      setLoadingSteelman(false);
    }
  };

  const handleGenerateRedTeam = async () => {
    if (!inputArg.trim()) return;
    try {
      setLoadingRedTeam(true);
      const res = await requestRedTeam(currentDebate?.id || 'demo', inputArg);
      setRedTeamResult(res);
    } catch (err) {
      alert('Red team generation notice: ' + err.message);
    } finally {
      setLoadingRedTeam(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
            Cognitive Rigor Modules
          </span>
          <span className="text-xs text-slate-400">• Steelman & Red Team</span>
        </div>
        <h1 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">
          Steelman Engine & Red Team Stress-Testing
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl leading-relaxed">
          The <span className="text-indigo-300 font-semibold">Steelman Engine</span> reconstructs opposing arguments into their most formidable, charitable form. The <span className="text-rose-300 font-semibold">Red Team Engine</span> aggressively attacks assumptions to identify critical reasoning vulnerabilities.
        </p>
      </div>

      {/* Target Input Statement */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <label className="text-xs font-bold text-slate-200 block">
          Target Proposition to Reconstruct or Stress-Test:
        </label>
        <textarea
          value={inputArg}
          onChange={(e) => setInputArg(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Load from Debate:</span>
            {statements.slice(0, 3).map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setInputArg(s.text)}
                className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] text-slate-300 hover:border-indigo-500"
              >
                Statement #{idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateSteelman}
              disabled={loadingSteelman || !inputArg.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{loadingSteelman ? 'Reconstructing...' : 'Steelman Argument'}</span>
            </button>
            <button
              onClick={handleGenerateRedTeam}
              disabled={loadingRedTeam || !inputArg.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50 transition"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{loadingRedTeam ? 'Stress-Testing...' : 'Red Team Attack'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Steelman Card */}
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Steelman Form (Optimal Synthesis)</span>
            </div>
            <span className="text-[10px] text-slate-400">Charitable Reconstruction</span>
          </div>

          {steelmanResult ? (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="rounded-xl border border-indigo-500/20 bg-slate-950 p-3.5 text-slate-100 font-medium">
                "{steelmanResult.steelman}"
              </div>
              <div className="text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-indigo-400">Why this version is stronger:</p>
                <p className="text-slate-400">{steelmanResult.rationale}</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Click "Steelman Argument" to produce the strongest, most coherent version of this claim.
            </div>
          )}
        </div>

        {/* Red Team Card */}
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4" />
              <span>Red Team Stress-Test (Devil's Advocate)</span>
            </div>
            <span className="text-[10px] text-slate-400">Vulnerability Audit</span>
          </div>

          {redTeamResult ? (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="rounded-xl border border-rose-500/20 bg-slate-950 p-3.5 text-rose-100">
                "{redTeamResult.attack_vector}"
              </div>
              <div className="text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-rose-400">Critical Assumptions Attacked:</p>
                <p className="text-slate-400">{redTeamResult.assumptions_broken}</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Click "Red Team Attack" to simulate rigorous adversarial counter-arguments and uncover blindspots.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
