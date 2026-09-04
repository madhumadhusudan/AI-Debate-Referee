/**
 * AI Debate Referee - Client API Service
 * Handles all REST endpoints with resilience and real-time fallbacks.
 */

const BASE_URL = '/api';

export async function fetchAllDebates() {
  const res = await fetch(`${BASE_URL}/debates`);
  if (!res.ok) throw new Error('Failed to fetch debates');
  return res.json();
}

export async function fetchDebateById(id) {
  const res = await fetch(`${BASE_URL}/debates/${id}`);
  if (!res.ok) throw new Error('Failed to fetch debate');
  return res.json();
}

export async function createDebate(payload) {
  const res = await fetch(`${BASE_URL}/debates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create debate');
  return res.json();
}

export async function addStatementToDebate(debateId, statementData) {
  const res = await fetch(`${BASE_URL}/debates/${debateId}/statements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(statementData),
  });
  if (!res.ok) throw new Error('Failed to add statement');
  return res.json();
}

export async function processNlpAnalysis(text, compareText = '') {
  const res = await fetch(`${BASE_URL}/nlp/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, compareText }),
  });
  if (!res.ok) throw new Error('Failed to process NLP analysis');
  return res.json();
}

export async function requestSteelman(debateId, text) {
  const res = await fetch(`${BASE_URL}/debates/${debateId}/steelman`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to generate steelman');
  return res.json();
}

export async function requestRedTeam(debateId, text) {
  const res = await fetch(`${BASE_URL}/debates/${debateId}/red-team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to generate red team analysis');
  return res.json();
}

export async function sparWithAi(topic, position, statement, history = []) {
  const res = await fetch(`${BASE_URL}/debate-trainer/spar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic,
      position,
      user_statement: statement,
      history,
    }),
  });
  if (!res.ok) throw new Error('Failed to spar with AI');
  return res.json();
}

export async function submitHumanFeedback(feedbackData) {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedbackData),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}

export async function fetchFeedbackDataset() {
  const res = await fetch(`${BASE_URL}/feedback`);
  if (!res.ok) throw new Error('Failed to load feedback dataset');
  return res.json();
}
