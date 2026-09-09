# ⚖️ AI Debate Referee
### *“Analyze the Argument. Understand the Reasoning. Improve the Thinking.”*

**AI Debate Referee** is an intelligent multimodal debate, argument, and reasoning analysis platform. Built with a dual-stack NLP pipeline, Transformer Natural Language Inference (NLI), dialectical topology mapping, real-time speech synchronization, and deep cognitive dissection, it serves as an impartial intellectual epistemologist.

---
## UI View and ScreenShot
<img width="1363" height="588" alt="Screenshot 2026-09-05 221752" src="https://github.com/user-attachments/assets/3574a5da-8c33-413e-9bdf-18512b28526c" />

## 🧭 Core Philosophy & The Referee's Mandate

> **“The AI does not decide who won. It explains how the reasoning works.”**

Traditional debate tools attempt to score debates like a sport or predict winners based on superficial metrics. The **AI Debate Referee** deliberately rejects this premise. Instead:
- It **deconstructs statements** into foundational premises, logical steps, and empirical citations.
- It **identifies logical fallacies**, rhetorical evasion, and latent contradictions without partisan bias.
- It **measures argument robustness mathematically** across 6 transparent health dimensions.
- It **strengthens both sides** via autonomous Steelman reconstruction and adversarial Red Team stress-testing.

---

## 🌟 What Makes This Project Exceptional?

| Feature | Description |
|---|---|
| 🩺 **Argument Health Check (Flagship #1)** | Transparent, formula-based scoring across 6 dimensions: Evidence Coverage, Logical Coherence, Claim Support, Dialectical Consistency, Counterargument Handling, and Evidence Gap Risk. |
| 🔬 **Argument X-Ray (Flagship #2)** | Cognitive breakdown of any statement into 8 core components: *Claim, Reason, Evidence, Assumption, Inference, Conclusion, Epistemic Weakness,* and *Steelman Counterargument*. |
| ⚔️ **Evidence Battle Matrix (Flagship #3)** | Side-by-side methodological audit of empirical citations, evaluating source reliability, methodological directness, empirical independence, and relevance. |
| 📈 **Reasoning Evolution Timeline (Flagship #4)** | Interactive chronological flow mapping how arguments develop, shift, get conceded, or get reinforced across debate turns. |
| 🎙️ **Multimodal Audio Sync & Dual Voice Engine (Flagship #5)** | Real-time speech synthesis and acoustic synthesis with debater voice personas, synchronized transcript highlighting, and a persistent scrubbable audio player. |
| 🛡️ **Steelman & Red Team Engine** | Automatically generates the most cogent version of an opponent’s argument (Steelman) and subjects positions to adversarial stress-testing (Red Team). |
| 🔍 **24+ Logical Fallacy Taxonomy** | Deep detection of fallacies (Ad Hominem, Straw Man, Slippery Slope, False Dilemma, etc.) with confidence scores, exact explanations, and actionable repair tips. |
| 📑 **21-Section Comprehensive Referee Report** | Exhaustive analytical audit exportable in one click to **Printable PDF**, **Structured JSON**, **Tabular CSV**, or **Plain Text (TXT)**. |
| 🥊 **Interactive Debate Trainer** | Real-time sparring module where users practice debating against an adaptive AI opponent while receiving instant tactical coaching and voice feedback. |
| 🌐 **Multilingual & Indic Language Support** | Full interface and analysis support for **English**, **Kannada (ಕನ್ನಡ)**, **Tamil (தமிழ்)**, **Telugu (తెలుగు)**, and **Malayalam (മലയാളം)**. |
| 🔄 **Human-in-the-Loop Active Learning** | Built-in correction modal allowing users to report false-positive fallacy detections or misclassified claims to refine the model. |

---

## 🚀 Step-by-Step Guide: How to Create a Debate

Creating and analyzing a debate in AI Debate Referee is straightforward and supports multiple input workflows:

### Method 1: Using the New Debate Dialog (Recommended)

1. **Launch the Dialog**:
   - In the top navigation bar, click the **Debate Selector dropdown** (showing the active debate title).
   - Click **"+ Start New Debate"** at the bottom of the list.

2. **Configure Debate Metadata**:
   - **Debate Session Title**: Enter a descriptive title (e.g., *"Universal Basic Income (UBI) vs. Targeted Social Safety Nets"*).
   - **Resolution Topic / Core Question**: Enter the formal proposition to arbitrate (e.g., *"Should sovereign nations enact a universal, unconditional monthly cash dividend for all adult citizens?"*).

3. **Define Participants & Stances**:
   - **Participant A (Affirmative / Proposition)**:
     - *Name*: e.g., `Dr. Sarah Chen`
     - *Role / Affiliation*: e.g., `Development Economist, Oxford Policy Institute`
   - **Participant B (Negative / Opposition)**:
     - *Name*: e.g., `Marcus Vance`
     - *Role / Affiliation*: e.g., `Senior Fellow in Public Finance, Adam Smith Center`

4. **Choose Arbitration Mode**:
   - **Mode A: Text Debate**: Ideal for written transcripts, essays, and turn-by-turn structured rebuttals.
   - **Mode B: Live Voice Debate**: Ideal for spoken debates, real-time podcast arbitration, and audio recording.

5. **Initialize**: Click **"Create & Launch Session"**. Your new session is instantly created and loaded into the active workspace.

---

### Method 2: Ingesting Arguments in Text Debate Mode

1. Navigate to **"Text Debate"** in the sidebar.
2. Select the **Active Speaker** button (e.g., *Dr. Sarah Chen* or *Marcus Vance*).
3. Type or paste your reasoned statement into the text area.
4. Click **"Submit Statement (NLP Parse)"**.
5. **Instant NLP Extraction**:
   - Linguistic tokenization, POS tagging, and sentiment analysis occur immediately.
   - The NLP engine classifies the statement as a *Claim, Evidence, Rebuttal, or Question*.
   - The statement is scanned against 24+ fallacy patterns and cross-checked against prior statements for logical contradictions.
   - The active speaker button automatically toggles to the other debater for smooth dialectical flow.

---

### Method 3: Ingesting Spoken Arguments in Live Voice Debate Mode

1. Navigate to **"Live Voice Debate"** in the sidebar.
2. Select the speaking debater (*Side A* or *Side B*).
3. Click **"Start Live Ingestion"** to enable the microphone:
   - The system uses the **Web Speech API** for high-accuracy live transcription.
   - The real-time **Web Audio API visualizer** renders sound frequency wavebars.
4. Speak into the microphone. You will see words transcribe in real-time in the live buffer.
5. Pause or click **"Post Statement"** (or let silence automatically segment the turn).
6. The statement is indexed with precise start/end timestamps and synchronized with the multimodal audio timeline.

---

### Method 4: Programmatic API Ingestion (REST)

You can also create debates and inject statements programmatically using the built-in REST API:

```bash
# 1. Create a Debate Session
curl -X POST http://localhost:3000/api/debates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Autonomous Weapons Governance",
    "topic": "Should the UN ban fully autonomous lethal weapons systems?",
    "mode": "text",
    "participants": [
      { "name": "Elena Rostova", "role": "International Law Scholar", "side": "Affirmative" },
      { "name": "David Sterling", "role": "Defense Strategy Director", "side": "Negative" }
    ]
  }'

# Returns: { "id": "deb-1714890000000", ... }

# 2. Add Statements to the Debate
curl -X POST http://localhost:3000/api/debates/deb-1714890000000/statements \
  -H "Content-Type: application/json" \
  -d '{
    "speaker_name": "Elena Rostova",
    "text": "Autonomous systems lack moral agency. Empirical warfare audits show targeting failure rates exceed 12% in urban environments without human oversight.",
    "timestamp_start": 0,
    "timestamp_end": 14
  }'
```

---

## 🔬 In-Depth Feature Tour

### 1. Argument Health Check (Flagship #1)
Rather than an arbitrary letter grade, the Health Check uses an explainable mathematical formula:
$$\text{Health Score} = \sum (w_i \times D_i) - \text{FallacyPenalty} - \text{ContradictionPenalty}$$
- **Evidence Coverage (20%)**: Percentage of claims supported by empirical evidence or citations.
- **Logical Coherence (25%)**: Structural consistency of deductive/inductive premises.
- **Claim Support (20%)**: Depth of justification backing core propositions.
- **Dialectical Consistency (15%)**: Absence of internal contradictions across statements.
- **Counterargument Handling (10%)**: Proactive address of opposing claims.
- **Evidence Gap Risk (10%)**: Identification of unverified assumptions vulnerable to collapse.

### 2. Argument X-Ray (Flagship #2)
Click on any statement to view its 8-part cognitive dissection:
- **Claim**: The central normative or factual proposition.
- **Reason**: The logical rationale underpinning the claim.
- **Evidence**: Empirical data points, historical precedents, or studies cited.
- **Assumption**: Unstated premises that must hold true for the claim to be valid.
- **Inference**: The deductive or inductive bridge connecting premise to conclusion.
- **Conclusion**: The resultant action or policy stance demanded.
- **Epistemic Weakness**: Areas where counter-evidence or vague terms create vulnerabilities.
- **Steelman Counterargument**: The strongest possible objection an expert opponent could formulate.

### 3. Evidence Battle Matrix (Flagship #3)
Compares the epistemic weight of citations provided by both sides:
- **Directness**: Direct empirical data vs. secondary interpretations vs. anecdotal claims.
- **Source Independence**: Peer-reviewed independent meta-analyses vs. institutional or partisan think tanks.
- **Relevance Score**: How tightly the evidence maps to the actual contested claim.
- **Clash Resolution**: Identifies points where conflicting studies contradict each other.

### 4. Reasoning Evolution Timeline (Flagship #4)
Visualizes dialectical progression across the entire debate duration:
- Tracks when claims are introduced, conceded, reinforced, or sidestepped.
- Displays shifts in argumentative momentum and dialectical pivots.

### 5. Multimodal Audio Sync & Dual Voice Engine (Flagship #5)
- **Speech Synthesis**: Plays back arguments using synthesized voices tailored with distinct vocal characteristics for Proposition (Dr. Sarah Chen), Opposition (Marcus Vance), and the Referee Moderator.
- **Acoustic Synthesizer**: Generates harmonic chimes, gavel strikes, and audio alerts via the Web Audio API (`AudioContext`).
- **Interactive Scrubber**: The persistent bottom player allows seeking to any timestamp with real-time transcript highlighting, speed toggles (0.75x to 2.0x), and volume control.

### 6. Steelman & Red Team Epistemic Engine
- **Steelman**: Rewrites each speaker's argument into its most defensible, robust intellectual incarnation, eliminating rhetorical flaws.
- **Red Team Attack**: Simulates a world-class adversarial cross-examiner stress-testing the debate's central thesis, highlighting structural failure points.

### 7. 24+ Logical Fallacy Taxonomy
Detects formal and informal fallacies with zero tolerance for generic hand-waving:
- *Ad Hominem, Straw Man, False Dilemma, Slippery Slope, Circular Reasoning, Hasty Generalization, False Cause (Post Hoc), Appeal to Authority, Appeal to Emotion, Red Herring, Tu Quoque, Equivocation, Loaded Question, Cherry Picking, Anecdotal Fallacy, False Analogy, Appeal to Ignorance, Moving the Goalposts, No True Scotsman, Confirmation Bias.*

### 8. 21-Section Comprehensive Referee Report
Generates an exhaustive academic audit covering:
1. Debate Overview
2. Executive Summary
3. Participant Analysis
4. Statement Breakdown
5. Claims Inventory
6. Evidence Quality
7. Fallacy Report
8. Contradiction Matrix
9. Assumption Analysis
10. Speech Metrics
11. Topic Adherence
12. Steelman Arguments
13. Counterfactual Scenarios
14. Argument Health Score
15. Key Clash Points
16. Unresolved Questions
17. Cognitive Biases
18. Historical Analogies
19. Red Team Attack
20. Recommendations
21. Methodology Notes

---

## 🛠️ Architecture & Technology Stack

```
AI DEBATE REFEREE SYSTEM
│
├── Client Tier (React 18 + Vite + Tailwind CSS)
│   ├── Interactive Dialectic Workspace (Dashboard, Live Voice, Text Mode)
│   ├── Flagship Analytical Modules (Health Check, X-Ray, Evidence Battle, Timeline)
│   ├── Multimodal Audio Engine (SpeechSynthesis + Web Audio API Chimes)
│   └── Multilingual Localization (English, Kannada, Tamil, Telugu, Malayalam)
│
├── Server Tier (Node.js Express + SQLite3)
│   ├── REST Endpoints (/api/debates, /api/statements, /api/reports, /api/spar)
│   ├── Rule-Based & Statistical NLP Engine (Tokenizer, POS, Sentiment, NLI)
│   ├── 24+ Heuristic & Semantic Fallacy Detectors
│   └── Relational SQLite Engine with Persistent Schemas
│
└── Deep Learning Reference Pipeline (Python FastAPI + Transformers)
    ├── RoBERTa-large-MNLI Zero-Shot Premise Entailment / Contradiction
    ├── Sentence-Transformers Dense Semantic Embeddings (64 to 768-dim)
    └── SpaCy Linguistic Dependency & Named Entity Recognition (NER)
```

---

## 🏃 Running the Application

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Development Server
```bash
# 1. Install dependencies
npm install

# 2. Start the full-stack server (Node.js Express + Vite)
npm run dev
```

The application will launch on **`http://localhost:3000`**.

### Production Build
```bash
# Build the client bundle
npm run build

# Start the production server
npm start
```

### Python NLP Pipeline (Optional Reference Engine)
If you wish to run the specialized Python deep learning backend alongside Express:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

---

## ⌨️ Quick Tips & Keyboard Shortcuts

- **Test Sound**: Click the **"Test Sound"** button in the top navigation bar or the bottom player at any time to verify your browser's audio output.
- **Audio Scrubber**: Click any statement row in the transcript to jump the audio player directly to that time index.
- **Speaker Toggle**: In Text Debate mode, the system automatically alternates speakers after each submitted proposition to maintain dialectical rhythm.
- **Active Learning**: Click the small badge next to any detected fallacy to open the **Human-in-the-Loop Feedback Modal** and submit corrections or flags.

---

## 📜 License & Acknowledgments

Built for intellectual clarity, dialectical rigour, and transparent epistemology.  
*“The AI does not decide who won. It explains how the reasoning works.”*
