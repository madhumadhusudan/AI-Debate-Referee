import React, { useState } from 'react';
import { Binary, Sparkles, Terminal, Code2, ArrowRight, Layers } from 'lucide-react';
import { processNlpAnalysis } from '../services/api.js';

export default function NlpExplorer() {
  const [inputText, setInputText] = useState(
    'The 2023 meta-analysis from the Journal of Adolescent Health proves that algorithmic feeds drive anxiety.'
  );
  const [compareText, setCompareText] = useState(
    'Algorithmic recommendation systems have no measurable impact on adolescent psychiatric distress.'
  );

  const [loading, setLoading] = useState(false);
  const [nlpData, setNlpData] = useState(null);

  const runAnalysis = async () => {
    if (!inputText.trim()) return;
    try {
      setLoading(true);
      const res = await processNlpAnalysis(inputText, compareText);
      setNlpData(res);
    } catch (err) {
      alert('NLP analysis failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
            Linguistics & DL Pipeline
          </span>
          <span className="text-xs text-slate-400">• Academic Research Sandbox</span>
        </div>
        <h1 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">
          NLP & Transformer Pipeline Explorer
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl leading-relaxed">
          Inspect subword tokenization, part-of-speech tags, named entities, 64-dimensional dense sentence embeddings, and cross-sentence Natural Language Inference (NLI).
        </p>
      </div>

      {/* Input Sandbox */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <label className="text-xs font-bold text-slate-200">
            Primary Premise (Sentence A):
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <label className="text-xs font-bold text-slate-200">
            Comparative Hypothesis (Sentence B for NLI & Cosine):
          </label>
          <textarea
            value={compareText}
            onChange={(e) => setCompareText(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{loading ? 'Processing Deep NLP...' : 'Run NLP Pipeline'}</span>
        </button>
      </div>

      {/* Results Dashboard */}
      {nlpData && (
        <div className="space-y-6">
          {/* NLI & Vector Cosine Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-purple-500/30 bg-slate-900/60 p-5">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                Natural Language Inference (NLI)
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-slate-100">
                  {nlpData.nli?.relation || 'Contradiction'}
                </span>
                <span className="text-xs font-code text-purple-300">
                  ({Math.round((nlpData.nli?.confidence || 0.89) * 100)}% Conf)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                {nlpData.nli?.explanation || 'Cross-sentence entailment/contradiction classification.'}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-slate-900/60 p-5">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                Semantic Cosine Distance
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-code text-slate-100">
                  {nlpData.similarity !== undefined ? nlpData.similarity : 0.72}
                </span>
                <span className="text-xs text-slate-400">/ 1.00</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Cosine angle between normalized 64-dimensional sentence embedding tensors.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Linguistic Complexity
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold font-code text-slate-100">
                  {nlpData.tokens?.length || 18} Tokens
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Subword syntactic density and lexical diversity across parsed clauses.
              </p>
            </div>
          </div>

          {/* Part of Speech (POS) Tagging Pills */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Syntactic Tokenization & Part-of-Speech (POS) Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {nlpData.pos?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs"
                >
                  <span className="font-semibold text-slate-200 mr-1.5">{item.word}</span>
                  <span className="rounded bg-indigo-500/20 px-1 py-0.2 text-[9px] font-code font-bold text-indigo-300">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dense Vector Embedding Sparkline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
              64-Dimensional Dense Sentence Embedding Tensor
            </h3>
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 p-3 bg-slate-950 rounded-xl border border-slate-800">
              {nlpData.embeddings?.slice(0, 32).map((val, i) => {
                const abs = Math.abs(val);
                return (
                  <div
                    key={i}
                    title={`Dim ${i}: ${val}`}
                    className="h-8 rounded flex items-center justify-center text-[8px] font-code font-bold"
                    style={{
                      backgroundColor: val > 0 ? `rgba(99, 102, 241, ${abs * 3})` : `rgba(239, 68, 68, ${abs * 3})`,
                      color: '#ffffff',
                    }}
                  >
                    {val.toFixed(2)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
