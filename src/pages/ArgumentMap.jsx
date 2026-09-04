import React, { useState } from 'react';
import { Network, Sparkles, Filter, Info } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function ArgumentMap() {
  const { currentDebate } = useDebate();
  const [activeNode, setActiveNode] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const claims = currentDebate?.claims || [];
  const evidence = currentDebate?.evidence || [];
  const fallacies = currentDebate?.fallacies || [];

  const nodes = [
    { id: 'c-1', label: 'Child Mental Health Crisis', type: 'claim', side: 'Affirmative', x: 220, y: 110, strength: 'High' },
    { id: 'ev-1', label: 'Journal Meta-Analysis (+35% Dep.)', type: 'evidence', side: 'Affirmative', x: 120, y: 240, strength: 'High' },
    { id: 'ev-2', label: 'EU Digital Services Audits', type: 'evidence', side: 'Affirmative', x: 320, y: 240, strength: 'Medium' },
    { id: 'c-2', label: 'State Censorship & Monopoly Risk', type: 'claim', side: 'Negative', x: 580, y: 110, strength: 'High' },
    { id: 'ev-3', label: 'Stanford Platform Cost Report', type: 'evidence', side: 'Negative', x: 680, y: 240, strength: 'High' },
    { id: 'f-1', label: 'Slippery Slope Fallacy', type: 'fallacy', side: 'Negative', x: 480, y: 240, strength: 'Vulnerable' },
    { id: 'asm-1', label: 'Causality Assumption', type: 'assumption', side: 'Affirmative', x: 220, y: 350, strength: 'Unverified' },
  ];

  const edges = [
    { from: 'ev-1', to: 'c-1', relation: 'Supports' },
    { from: 'ev-2', to: 'c-1', relation: 'Supports' },
    { from: 'asm-1', to: 'c-1', relation: 'Underpins' },
    { from: 'c-2', to: 'c-1', relation: 'Rebuts' },
    { from: 'ev-3', to: 'c-2', relation: 'Supports' },
    { from: 'f-1', to: 'c-2', relation: 'Weakens' },
  ];

  const filteredNodes = filterType === 'all' ? nodes : nodes.filter((n) => n.type === filterType);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
              Interactive 2D Graph
            </span>
            <span className="text-xs text-slate-400">• Dialectical Topology</span>
          </div>
          <h1 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">
            Argument Relationship Map
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Visual topology mapping directed relations between claims, empirical evidence, unstated assumptions, and logical fallacies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-950 p-1.5 border border-slate-800 shrink-0">
          {['all', 'claim', 'evidence', 'fallacy', 'assumption'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Canvas Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[460px]">
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map((edge, i) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const isRebuttal = edge.relation === 'Rebuts';
              const isWeakening = edge.relation === 'Weakens';

              return (
                <g key={i}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isRebuttal ? '#ef4444' : isWeakening ? '#f59e0b' : '#6366f1'}
                    strokeWidth={isRebuttal ? 2.5 : 1.5}
                    strokeDasharray={isWeakening ? '4,4' : undefined}
                    strokeOpacity={0.6}
                  />
                  {/* Midpoint Label */}
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 4}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {edge.relation}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Render Interactive Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = activeNode?.id === node.id;
            let bgColor = 'bg-indigo-950 border-indigo-500 text-indigo-200';
            if (node.type === 'evidence') bgColor = 'bg-emerald-950 border-emerald-500 text-emerald-200';
            if (node.type === 'fallacy') bgColor = 'bg-amber-950 border-amber-500 text-amber-200';
            if (node.type === 'assumption') bgColor = 'bg-purple-950 border-purple-500 text-purple-200';

            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(node)}
                style={{ position: 'absolute', left: `${node.x - 70}px`, top: `${node.y - 25}px` }}
                className={`cursor-pointer rounded-xl border-2 p-2.5 text-center shadow-lg transition transform hover:scale-105 w-36 ${bgColor} ${
                  isSelected ? 'ring-4 ring-white/20 scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-between text-[8px] uppercase tracking-wider font-bold opacity-75 mb-0.5">
                  <span>{node.type}</span>
                  <span>{node.side}</span>
                </div>
                <p className="text-[11px] font-semibold truncate">{node.label}</p>
              </div>
            );
          })}
        </div>

        {/* Node Inspector Detail Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Info className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Node Topological Inspector
            </h3>
          </div>

          {activeNode ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Node Identifier:</span>
                <p className="font-code text-indigo-300 font-semibold mt-0.5">{activeNode.id}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Entity Title:</span>
                <p className="text-sm font-bold text-slate-100 mt-0.5">{activeNode.label}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2">
                  <span className="text-[9px] uppercase text-slate-400">Classification</span>
                  <p className="text-xs font-semibold text-slate-200 capitalize mt-0.5">{activeNode.type}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2">
                  <span className="text-[9px] uppercase text-slate-400">Affiliation</span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">{activeNode.side}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Epistemic Status:</span>
                <p className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-300 mt-1 leading-relaxed">
                  Evaluated as <span className="font-semibold text-indigo-300">{activeNode.strength}</span> in the dialectical graph. Connected to central proposition via multi-hop causal inference.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Click any node on the graph to inspect its logical linkages and empirical backing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
