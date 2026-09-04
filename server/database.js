import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, 'debate_referee.json');

// Memory tables
const tables = {
  debates: [],
  participants: [],
  statements: [],
  claims: [],
  evidence: [],
  fallacies: [],
  contradictions: [],
  assumptions: [],
  feedback: [],
};

// Load database from file
function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      for (const key of Object.keys(tables)) {
        if (Array.isArray(data[key])) {
          tables[key] = data[key];
        }
      }
      console.log('Database loaded successfully from:', DB_FILE);
    } catch (err) {
      console.warn('Failed to parse database file, initializing fresh:', err.message);
      seedDemoDebate();
    }
  } else {
    seedDemoDebate();
  }
}

// Persist database to file
function persistDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(tables, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write database file:', err.message);
  }
}

// Emulate SQLite query execution
export function dbRun(sql, params = []) {
  return new Promise((resolve) => {
    const trimmed = sql.trim();
    const upper = trimmed.toUpperCase();

    // 1. CREATE TABLE
    if (upper.startsWith('CREATE TABLE')) {
      resolve({ id: null, changes: 0 });
      return;
    }

    // 2. INSERT INTO <table> (<cols>) VALUES (<vals>)
    if (upper.startsWith('INSERT INTO')) {
      const match = trimmed.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*VALUES/i);
      if (match) {
        const tableName = match[1].toLowerCase();
        const colList = match[2].split(',').map((c) => c.trim());
        if (!tables[tableName]) {
          tables[tableName] = [];
        }

        const newRow = {};
        colList.forEach((col, idx) => {
          newRow[col] = params[idx] !== undefined ? params[idx] : null;
        });

        if (!newRow.created_at) {
          newRow.created_at = new Date().toISOString();
        }

        tables[tableName].push(newRow);
        persistDatabase();
        resolve({ id: newRow.id || Date.now(), changes: 1 });
        return;
      }
    }

    // 3. DELETE FROM <table> WHERE <col> = ?
    if (upper.startsWith('DELETE FROM')) {
      const match = trimmed.match(/DELETE\s+FROM\s+([a-zA-Z0-9_]+)(\s+WHERE\s+(.+))?/i);
      if (match) {
        const tableName = match[1].toLowerCase();
        const whereClause = match[3];
        if (!tables[tableName]) {
          resolve({ changes: 0 });
          return;
        }

        if (!whereClause) {
          const count = tables[tableName].length;
          tables[tableName] = [];
          persistDatabase();
          resolve({ changes: count });
          return;
        }

        const colMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*=\s*\?/i);
        if (colMatch) {
          const colName = colMatch[1];
          const val = params[0];
          const initialLen = tables[tableName].length;
          tables[tableName] = tables[tableName].filter((row) => row[colName] !== val);
          const changes = initialLen - tables[tableName].length;
          persistDatabase();
          resolve({ changes });
          return;
        }
      }
    }

    // Default fallback
    resolve({ id: null, changes: 0 });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve) => {
    dbAll(sql, params).then((rows) => {
      resolve(rows && rows.length > 0 ? rows[0] : null);
    });
  });
}

export function dbAll(sql, params = []) {
  return new Promise((resolve) => {
    const trimmed = sql.trim();
    const upper = trimmed.toUpperCase();

    // SELECT * FROM <table> [WHERE <col> = ? ...] [ORDER BY ...] [LIMIT ...]
    if (upper.startsWith('SELECT')) {
      const fromMatch = trimmed.match(/FROM\s+([a-zA-Z0-9_]+)/i);
      if (!fromMatch) {
        resolve([]);
        return;
      }

      const tableName = fromMatch[1].toLowerCase();
      let rows = tables[tableName] ? [...tables[tableName]] : [];

      // WHERE clause
      const whereMatch = trimmed.match(/WHERE\s+(.+?)(ORDER\s+BY|LIMIT|$)/i);
      if (whereMatch) {
        const whereCond = whereMatch[1].trim();

        // Handle single or two condition WHERE
        // e.g., debate_id = ?
        // e.g., debate_id = ? AND id != ?
        if (whereCond.includes('AND')) {
          const parts = whereCond.split(/\s+AND\s+/i);
          let pIdx = 0;
          parts.forEach((part) => {
            if (part.includes('!=')) {
              const [col] = part.split('!=').map((s) => s.trim());
              const val = params[pIdx++];
              rows = rows.filter((r) => r[col] !== val);
            } else if (part.includes('=')) {
              const [col] = part.split('=').map((s) => s.trim());
              const val = params[pIdx++];
              rows = rows.filter((r) => r[col] === val);
            }
          });
        } else {
          const matchCol = whereCond.match(/([a-zA-Z0-9_]+)\s*(=|!=)\s*\?/i);
          if (matchCol) {
            const col = matchCol[1];
            const op = matchCol[2];
            const val = params[0];
            if (op === '=') {
              rows = rows.filter((r) => r[col] === val);
            } else {
              rows = rows.filter((r) => r[col] !== val);
            }
          }
        }
      }

      // ORDER BY
      const orderMatch = trimmed.match(/ORDER\s+BY\s+(.+?)(LIMIT|$)/i);
      if (orderMatch) {
        const orderExpr = orderMatch[1].trim();
        const orderParts = orderExpr.split(',').map((s) => s.trim());
        rows.sort((a, b) => {
          for (const part of orderParts) {
            const [col, dir = 'ASC'] = part.split(/\s+/);
            const isDesc = dir.toUpperCase() === 'DESC';
            const valA = a[col];
            const valB = b[col];
            if (valA === valB) continue;
            if (valA > valB) return isDesc ? -1 : 1;
            if (valA < valB) return isDesc ? 1 : -1;
          }
          return 0;
        });
      }

      // LIMIT
      const limitMatch = trimmed.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        const limitVal = parseInt(limitMatch[1], 10);
        rows = rows.slice(0, limitVal);
      }

      resolve(rows);
      return;
    }

    resolve([]);
  });
}

// Compatibility db object
export const db = {
  run(sql, params, cb) {
    if (typeof params === 'function') {
      cb = params;
      params = [];
    }
    dbRun(sql, params).then((res) => cb && cb(null, res));
  },
  get(sql, params, cb) {
    if (typeof params === 'function') {
      cb = params;
      params = [];
    }
    dbGet(sql, params).then((row) => cb && cb(null, row));
  },
  all(sql, params, cb) {
    if (typeof params === 'function') {
      cb = params;
      params = [];
    }
    dbAll(sql, params).then((rows) => cb && cb(null, rows));
  },
  serialize(fn) {
    if (fn) fn();
  },
};

export async function seedDemoDebate() {
  console.log('Seeding demo debate: "Should social media platforms be regulated more strictly?"');
  const debateId = 'demo-social-media';

  tables.debates = [
    {
      id: debateId,
      title: 'Social Media Regulation & Public Welfare',
      topic: 'Should social media platforms be regulated more strictly by public policy?',
      status: 'completed',
      mode: 'voice',
      language: 'en',
      created_at: new Date().toISOString(),
      metadata_json: JSON.stringify({
        duration_seconds: 384,
        total_words: 1120,
        total_statements: 10,
        audio_duration: '06:24',
      }),
    },
  ];

  tables.participants = [
    {
      id: 'p-sarah',
      debate_id: debateId,
      name: 'Dr. Sarah Chen',
      role: 'Proposition (Pro-Regulation)',
      side: 'Affirmative',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      speaking_time: 198,
      wpm: 138,
      interruptions: 1,
    },
    {
      id: 'p-marcus',
      debate_id: debateId,
      name: 'Marcus Vance',
      role: 'Opposition (Market & Speech Autonomy)',
      side: 'Negative',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      speaking_time: 186,
      wpm: 145,
      interruptions: 2,
    },
  ];

  tables.statements = [
    {
      id: 's-01',
      debate_id: debateId,
      participant_id: 'p-sarah',
      speaker_name: 'Dr. Sarah Chen',
      text: 'Peer-reviewed studies in the Journal of Adolescent Health demonstrate a 37% increase in clinical adolescent depressive symptoms directly correlated with engagement-maximizing algorithmic feeds.',
      timestamp_start: 3.5,
      timestamp_end: 18.2,
      statement_type: 'evidence',
      emotion: 'Concerned',
      confidence: 0.94,
      created_at: new Date(Date.now() - 360000).toISOString(),
    },
    {
      id: 's-02',
      debate_id: debateId,
      participant_id: 'p-marcus',
      speaker_name: 'Marcus Vance',
      text: 'Correlation does not establish algorithmic causation; socio-economic disruptions and academic stress rose identically during the exact same timeframe across populations with minimal screen time.',
      timestamp_start: 20.0,
      timestamp_end: 34.8,
      statement_type: 'rebuttal',
      emotion: 'Calm',
      confidence: 0.91,
      created_at: new Date(Date.now() - 330000).toISOString(),
    },
    {
      id: 's-03',
      debate_id: debateId,
      participant_id: 'p-sarah',
      speaker_name: 'Dr. Sarah Chen',
      text: 'Every major technology company deliberately engineers variable-ratio dopamine reinforcement loops, exactly like mechanical slot machines, which negates the assumption of unconstrained consumer choice.',
      timestamp_start: 36.5,
      timestamp_end: 51.0,
      statement_type: 'claim',
      emotion: 'Confident',
      confidence: 0.88,
      created_at: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: 's-04',
      debate_id: debateId,
      participant_id: 'p-marcus',
      speaker_name: 'Marcus Vance',
      text: 'If we empower government agencies to dictate permissible recommendation architectures, state regulators will inevitably censor dissenting political discourse under the guise of mental hygiene.',
      timestamp_start: 53.2,
      timestamp_end: 69.4,
      statement_type: 'claim',
      emotion: 'Excited',
      confidence: 0.85,
      created_at: new Date(Date.now() - 270000).toISOString(),
    },
    {
      id: 's-05',
      debate_id: debateId,
      participant_id: 'p-sarah',
      speaker_name: 'Dr. Sarah Chen',
      text: 'European Union enforcement of the Digital Services Act has already established transparency mandates for systemic risk audits without infringing on fundamental political expression.',
      timestamp_start: 72.0,
      timestamp_end: 87.5,
      statement_type: 'evidence',
      emotion: 'Calm',
      confidence: 0.93,
      created_at: new Date(Date.now() - 240000).toISOString(),
    },
    {
      id: 's-06',
      debate_id: debateId,
      participant_id: 'p-marcus',
      speaker_name: 'Marcus Vance',
      text: 'The EU compliance costs have disproportionately crippled small European open-source startups while leaving incumbent monopolies even more entrenched behind bureaucratic moats.',
      timestamp_start: 89.0,
      timestamp_end: 104.2,
      statement_type: 'counterclaim',
      emotion: 'Confident',
      confidence: 0.89,
      created_at: new Date(Date.now() - 210000).toISOString(),
    },
    {
      id: 's-07',
      debate_id: debateId,
      participant_id: 'p-sarah',
      speaker_name: 'Dr. Sarah Chen',
      text: 'Marcus claims startups are harmed, but anyone who opposes our consumer safety regulations clearly does not care about protecting vulnerable children from self-harm content.',
      timestamp_start: 106.0,
      timestamp_end: 119.5,
      statement_type: 'claim',
      emotion: 'Frustrated',
      confidence: 0.82,
      created_at: new Date(Date.now() - 180000).toISOString(),
    },
    {
      id: 's-08',
      debate_id: debateId,
      participant_id: 'p-marcus',
      speaker_name: 'Marcus Vance',
      text: 'That misrepresents my position entirely. We all prioritize child safety; the contention is whether algorithmic speech licensing is the only or most effective mechanism to achieve it.',
      timestamp_start: 121.5,
      timestamp_end: 136.0,
      statement_type: 'rebuttal',
      emotion: 'Calm',
      confidence: 0.95,
      created_at: new Date(Date.now() - 150000).toISOString(),
    },
    {
      id: 's-09',
      debate_id: debateId,
      participant_id: 'p-sarah',
      speaker_name: 'Dr. Sarah Chen',
      text: 'Earlier Marcus argued that digital platforms operate as open competitive marketplaces, but later conceded that two conglomerates control 84% of mobile advertising distribution.',
      timestamp_start: 138.5,
      timestamp_end: 154.0,
      statement_type: 'claim',
      emotion: 'Confident',
      confidence: 0.90,
      created_at: new Date(Date.now() - 120000).toISOString(),
    },
    {
      id: 's-10',
      debate_id: debateId,
      participant_id: 'p-marcus',
      speaker_name: 'Marcus Vance',
      text: 'Market concentration in ad tech does not equate to ideological monopoly; users transition freely across decentralized networks, TikTok, and messaging protocols daily.',
      timestamp_start: 156.0,
      timestamp_end: 172.5,
      statement_type: 'counterclaim',
      emotion: 'Neutral',
      confidence: 0.87,
      created_at: new Date(Date.now() - 90000).toISOString(),
    },
  ];

  tables.claims = [
    {
      id: 'c-01',
      debate_id: debateId,
      statement_id: 's-01',
      speaker_id: 'p-sarah',
      text: 'Engagement-maximizing algorithmic feeds cause a measurable rise in adolescent clinical depression.',
      claim_type: 'Causal Claim',
      importance: 'High',
      confidence: 0.92,
      support_status: 'Moderate Support',
    },
    {
      id: 'c-02',
      debate_id: debateId,
      statement_id: 's-03',
      speaker_id: 'p-sarah',
      text: 'Platforms exploit neurobiological dopamine loops to systematically bypass voluntary consumer choice.',
      claim_type: 'Value / Empirical',
      importance: 'High',
      confidence: 0.88,
      support_status: 'Moderate Support',
    },
    {
      id: 'c-03',
      debate_id: debateId,
      statement_id: 's-04',
      speaker_id: 'p-marcus',
      text: 'State regulatory oversight of recommendation algorithms inevitably expands into viewpoint discrimination and political censorship.',
      claim_type: 'Prediction / Causal',
      importance: 'High',
      confidence: 0.79,
      support_status: 'Weak Support',
    },
    {
      id: 'c-04',
      debate_id: debateId,
      statement_id: 's-06',
      speaker_id: 'p-marcus',
      text: 'Systemic compliance overhead disproportionately locks in dominant tech monopolies by bankrupting smaller competitors.',
      claim_type: 'Economic / Empirical',
      importance: 'Medium',
      confidence: 0.84,
      support_status: 'Moderate Support',
    },
  ];

  tables.evidence = [
    {
      id: 'e-01',
      debate_id: debateId,
      statement_id: 's-01',
      claim_id: 'c-01',
      speaker_id: 'p-sarah',
      text: 'Journal of Adolescent Health longitudinal study documenting a 37% relative increase in youth depressive symptom reports with 4+ hours daily feed consumption.',
      evidence_type: 'Scientific Study',
      reliability: 'High',
      relevance: 0.91,
      directness: 'Direct',
      source: 'Journal of Adolescent Health, Vol 68, Issue 4',
    },
    {
      id: 'e-02',
      debate_id: debateId,
      statement_id: 's-05',
      claim_id: 'c-01',
      speaker_id: 'p-sarah',
      text: 'European Commission Digital Services Act Article 34 independent audit disclosures from Q3 2024.',
      evidence_type: 'Government Regulatory Audit',
      reliability: 'High',
      relevance: 0.85,
      directness: 'Corroborating',
      source: 'European Union Official Journal, DSA Implementation Dossier',
    },
    {
      id: 'e-03',
      debate_id: debateId,
      statement_id: 's-02',
      claim_id: 'c-03',
      speaker_id: 'p-marcus',
      text: 'Cross-national epidemiological survey comparing non-smartphone cohorts showing concurrent 31% rise in generalized teen anxiety.',
      evidence_type: 'Epidemiological Survey',
      reliability: 'Medium',
      relevance: 0.82,
      directness: 'Direct Counter-evidence',
      source: 'OECD Social Indicators Working Paper 2023',
    },
  ];

  tables.fallacies = [
    {
      id: 'f-01',
      debate_id: debateId,
      statement_id: 's-04',
      speaker_id: 'p-marcus',
      fallacy_name: 'Slippery Slope',
      statement_text: 'If we empower government agencies to dictate permissible recommendation architectures, state regulators will inevitably censor dissenting political discourse under the guise of mental hygiene.',
      explanation: 'Assumes without intermediate causal proof that auditing algorithmic amplification must inescapably culminate in draconian state censorship.',
      confidence: 0.84,
      how_to_improve: 'Provide specific statutory precedents or mechanisms showing how current algorithmic transparency proposals lack checks against overreach.',
    },
    {
      id: 'f-02',
      debate_id: debateId,
      statement_id: 's-07',
      speaker_id: 'p-sarah',
      fallacy_name: 'Ad Hominem / False Dilemma (Moral Smear)',
      statement_text: '...anyone who opposes our consumer safety regulations clearly does not care about protecting vulnerable children from self-harm content.',
      explanation: 'Reduces principled disagreement over regulatory architecture into an attack on the opponent’s personal morality, presenting a false binary between supporting this specific law and being indifferent to child harm.',
      confidence: 0.92,
      how_to_improve: 'Engage Marcus’s economic argument regarding startup compliance costs directly without questioning his personal motives.',
    },
  ];

  tables.contradictions = [
    {
      id: 'ct-01',
      debate_id: debateId,
      statement1_id: 's-01',
      statement2_id: 's-02',
      speaker1_name: 'Dr. Sarah Chen',
      speaker2_name: 'Marcus Vance',
      statement1_text: 'Peer-reviewed studies ... demonstrate a 37% increase in clinical adolescent depressive symptoms directly correlated with engagement-maximizing algorithmic feeds.',
      statement2_text: 'Correlation does not establish algorithmic causation; socio-economic disruptions and academic stress rose identically during the exact same timeframe...',
      contradiction_type: 'Cross-Participant Direct Tension',
      confidence: 0.91,
      explanation: 'Direct empirical dispute regarding whether platform algorithmic design is the primary causal driver or an incidental co-variable of youth mental health trends.',
    },
    {
      id: 'ct-02',
      debate_id: debateId,
      statement1_id: 's-09',
      statement2_id: 's-10',
      speaker1_name: 'Dr. Sarah Chen',
      speaker2_name: 'Marcus Vance',
      statement1_text: 'Earlier Marcus argued that digital platforms operate as open competitive marketplaces...',
      statement2_text: 'Market concentration in ad tech does not equate to ideological monopoly; users transition freely across decentralized networks...',
      contradiction_type: 'Contextual Tension / Nuance Shift',
      confidence: 0.79,
      explanation: 'Tension between treating platforms as perfectly contestable consumer markets while acknowledging extreme structural concentration in upstream ad monetization.',
    },
  ];

  tables.assumptions = [
    {
      id: 'as-01',
      debate_id: debateId,
      claim_id: 'c-01',
      speaker_id: 'p-sarah',
      claim_text: 'Engagement-maximizing feeds cause a measurable rise in adolescent depression.',
      unstated_premise: 'Assumes that algorithmic feed curation is the decisive factor rather than screen time volume, sleep displacement, or pre-existing vulnerability.',
      risk_level: 'Medium',
      explanation: 'If sleep disruption is the true mediating mechanism, regulating feed algorithms alone may not achieve the predicted health outcomes.',
    },
    {
      id: 'as-02',
      debate_id: debateId,
      claim_id: 'c-03',
      speaker_id: 'p-marcus',
      claim_text: 'State regulatory oversight inevitably expands into political censorship.',
      unstated_premise: 'Assumes regulatory bodies cannot maintain independent judiciary oversight, structural firewalls, or procedural transparency.',
      risk_level: 'High',
      explanation: 'Historical regulatory bodies (such as FDA or FAA) operate with legal constraints; the argument assumes digital speech authorities cannot establish similar safeguards.',
    },
  ];

  tables.feedback = [];

  persistDatabase();
  console.log('Demo debate successfully initialized and persisted!');
}

// Initial bootstrap
loadDatabase();
