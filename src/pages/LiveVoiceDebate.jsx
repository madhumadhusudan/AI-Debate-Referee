import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Square,
  Users,
  Sparkles,
  AlertTriangle,
  Scale,
  Activity,
  Check,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function LiveVoiceDebate() {
  const {
    currentDebate,
    postStatement,
    playSentenceAudio,
    setFeedbackTarget,
    isPlayingAudio,
    activeStatementId,
    toggleAudioPlayback,
    testAudioSound,
    voiceEngine,
  } = useDebate();

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSpeakerSide, setActiveSpeakerSide] = useState('A'); // 'A' or 'B'
  const [interimText, setInterimText] = useState('');
  const [manualInputText, setManualInputText] = useState('');
  const [editingStatementId, setEditingStatementId] = useState(null);
  const [editText, setEditText] = useState('');

  // Audio visualization
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const playbackAnimFrameRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const participants = currentDebate?.participants || [];
  const partA = participants[0] || { id: 'p-sarah', name: 'Dr. Sarah Chen', side: 'Affirmative' };
  const partB = participants[1] || { id: 'p-marcus', name: 'Marcus Vance', side: 'Negative' };

  const statements = currentDebate?.statements || [];
  const fallacies = currentDebate?.fallacies || [];
  const contradictions = currentDebate?.contradictions || [];

  // Animate canvas when audio playback is active
  useEffect(() => {
    if (!isPlayingAudio || isRecording) {
      if (playbackAnimFrameRef.current) cancelAnimationFrame(playbackAnimFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const animatePlayback = () => {
      playbackAnimFrameRef.current = requestAnimationFrame(animatePlayback);
      phase += 0.15;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = 24;
      const barWidth = canvas.width / bars;
      const activeStmt = statements.find((s) => s.id === activeStatementId);
      const isSarah = activeStmt?.speaker_name?.toLowerCase().includes('sarah') ?? (activeSpeakerSide === 'A');

      for (let i = 0; i < bars; i++) {
        const wave = Math.sin(phase + i * 0.45) * 0.5 + 0.5;
        const wave2 = Math.cos(phase * 0.8 + i * 0.3) * 0.3 + 0.3;
        const barHeight = Math.max(4, (wave * 0.7 + wave2 * 0.3) * canvas.height * 0.85);

        ctx.fillStyle = isSarah ? '#6366f1' : '#f59e0b';
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 3, barHeight);
      }
    };

    animatePlayback();

    return () => {
      if (playbackAnimFrameRef.current) cancelAnimationFrame(playbackAnimFrameRef.current);
    };
  }, [isPlayingAudio, isRecording, activeStatementId, statements, activeSpeakerSide]);

  // Setup Web Speech API for real-time live microphone transcription
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interim = '';
        let finalStr = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += transcript;
          } else {
            interim += transcript;
          }
        }

        if (finalStr.trim()) {
          commitSpokenStatement(finalStr.trim());
          setInterimText('');
        } else {
          setInterimText(interim);
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition warning:', e.error);
      };

      recognitionRef.current = recognition;
    }
  }, [activeSpeakerSide, currentDebate]);

  // Audio Visualizer waveform via Web Audio API
  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / dataArray.length) * 1.8;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
          ctx.fillStyle = activeSpeakerSide === 'A' ? '#6366f1' : '#f59e0b';
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }
      };
      draw();
    } catch (err) {
      console.warn('Audio visualizer fallback (mic access):', err.message);
    }
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const startLiveRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
    startVisualizer();
  };

  const stopLiveRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    clearInterval(recordingTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    stopVisualizer();

    if (interimText.trim()) {
      commitSpokenStatement(interimText.trim());
      setInterimText('');
    }
  };

  const commitSpokenStatement = async (text) => {
    if (!text || !text.trim()) return;
    const speaker = activeSpeakerSide === 'A' ? partA : partB;
    const startSec = Math.max(0, recordingSeconds - 8);
    const endSec = recordingSeconds;

    await postStatement({
      participant_id: speaker.id,
      speaker_name: speaker.name,
      text: text.trim(),
      timestamp_start: startSec,
      timestamp_end: endSec,
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInputText.trim()) return;
    commitSpokenStatement(manualInputText.trim());
    setManualInputText('');
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h1 className="font-cinzel text-lg font-bold text-slate-100">
              Live Multimodal Voice Debate
            </h1>
            <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
              Mode B: Voice & Microphone
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time speech recognition, active turn detection, and simultaneous NLP arbitration.
          </p>
        </div>

        {/* Live Audio & Speaker Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Audio Test Button */}
          <button
            onClick={testAudioSound}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300 transition"
            title="Play an audio chime & voice self-test"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Test Sound</span>
          </button>

          {/* Listen to Spoken Debate */}
          <button
            onClick={toggleAudioPlayback}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-md ${
              isPlayingAudio
                ? 'bg-amber-600 text-white shadow-amber-600/20 hover:bg-amber-500'
                : 'bg-indigo-600/90 text-white shadow-indigo-600/20 hover:bg-indigo-500'
            }`}
            title="Hear all debaters speak in sequence"
          >
            {isPlayingAudio ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            <span>{isPlayingAudio ? 'Pause Spoken Debate' : 'Listen to Spoken Debate'}</span>
          </button>

          {/* Active Speaker Switcher */}
          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveSpeakerSide('A')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeSpeakerSide === 'A'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎙 {partA.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75">(Side A)</span>
            </button>
            <button
              onClick={() => setActiveSpeakerSide('B')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeSpeakerSide === 'B'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎙 {partB.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75">(Side B)</span>
            </button>
          </div>

          {/* Record Button */}
          {!isRecording ? (
            <button
              onClick={startLiveRecording}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition"
            >
              <Mic className="h-4 w-4" />
              <span>Start Live Turn</span>
            </button>
          ) : (
            <button
              onClick={stopLiveRecording}
              className="flex items-center gap-2 rounded-xl bg-slate-800 border border-rose-500 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-slate-700 transition animate-pulse"
            >
              <Square className="h-4 w-4 fill-current" />
              <span>Stop Recording ({recordingSeconds}s)</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Column Desktop Layout (Feature #56) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Participant A Profile & Statements (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-4">
            <div className="flex items-center gap-3">
              <img
                src={partA.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                alt={partA.name}
                className="h-10 w-10 rounded-xl object-cover border border-indigo-500/30"
              />
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-100 truncate">{partA.name}</h3>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[9px] text-indigo-300 font-semibold">
                  {partA.side}
                </span>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-slate-950 p-2 text-[11px] text-slate-400 border border-slate-800/80">
              <p className="font-semibold text-slate-300 mb-0.5">Core Thesis</p>
              <p className="text-[10px] leading-relaxed">
                Algorithmic amplification creates verifiable externalities requiring transparent public oversight.
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-code text-slate-400">
              <span>WPM: {partA.wpm || 138}</span>
              <span>Turns: {statements.filter((s) => s.participant_id === partA.id).length}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Side A Propositions ({statements.filter((s) => s.participant_id === partA.id).length})
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {statements
                .filter((s) => s.participant_id === partA.id)
                .map((s) => (
                  <div
                    key={s.id}
                    onClick={() => playSentenceAudio(s)}
                    className="cursor-pointer rounded-xl border border-indigo-500/20 bg-slate-950/70 p-2.5 text-xs text-slate-300 hover:border-indigo-500/40 transition"
                  >
                    <div className="flex items-center justify-between text-[10px] text-indigo-400 mb-1">
                      <span>{s.timestamp_start}s - {s.timestamp_end}s</span>
                      <span className="capitalize">{s.statement_type}</span>
                    </div>
                    <p className="line-clamp-3 text-[11px]">{s.text}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Live Transcript & Waveform (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Waveform Canvas */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-1 px-1">
              <span className="font-semibold text-slate-300">
                {isRecording ? `Active Mic Feed • ${activeSpeakerSide === 'A' ? partA.name : partB.name}` : 'Audio Input Idle'}
              </span>
              <span className="font-code">{isRecording ? `${recordingSeconds}s` : '00:00'}</span>
            </div>
            <canvas ref={canvasRef} width={420} height={48} className="w-full rounded-lg bg-slate-900/50" />
          </div>

          {/* Live Transcript Stream */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">
                Dynamic Transcript Timeline
              </span>
              <span className="text-[10px] text-slate-400">Click sentence to play exact audio</span>
            </div>

            {/* Interim live text when user is talking */}
            {interimText && (
              <div className="mb-3 rounded-xl border border-indigo-500/40 bg-indigo-950/20 p-3 animate-pulse">
                <div className="flex items-center gap-1 text-[10px] text-indigo-300 font-semibold mb-1">
                  <span>Transcribing live:</span>
                  <span className="font-bold">{activeSpeakerSide === 'A' ? partA.name : partB.name}</span>
                </div>
                <p className="text-xs text-slate-200 italic">{interimText}</p>
              </div>
            )}

            {/* Past Statements Stream */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {statements.map((s) => {
                const isSideA = s.participant_id === partA.id || s.speaker_name.includes('Sarah');
                const isSpeakingThis = s.id === activeStatementId && isPlayingAudio;
                return (
                  <div
                    key={s.id}
                    className={`rounded-xl border p-3 transition duration-200 ${
                      isSpeakingThis
                        ? 'border-indigo-400 bg-indigo-950/30 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                        : isSideA
                        ? 'border-indigo-500/20 bg-slate-950/80 hover:border-indigo-500/40'
                        : 'border-amber-500/20 bg-slate-950/80 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-xs ${
                            isSideA ? 'text-indigo-300' : 'text-amber-300'
                          }`}
                        >
                          {s.speaker_name}
                        </span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-code text-slate-400">
                          {s.timestamp_start}s - {s.timestamp_end}s
                        </span>
                        <span className="rounded-full bg-slate-800 px-2 py-0.2 text-[9px] font-medium text-slate-300 capitalize">
                          {s.statement_type || 'Claim'}
                        </span>
                        {isSpeakingThis && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-bold text-emerald-400 animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Speaking...
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => playSentenceAudio(s)}
                          className={`rounded p-1 transition ${
                            isSpeakingThis
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'text-slate-400 hover:text-indigo-400'
                          }`}
                          title={isSpeakingThis ? 'Pause Voice' : 'Listen to Segment'}
                        >
                          {isSpeakingThis ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
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
                          className="text-[9px] text-slate-500 hover:text-indigo-300 transition"
                          title="Correct AI Classification"
                        >
                          Correct
                        </button>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-200">{s.text}</p>

                    {s.emotion && (
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>Vocal Tone Signal:</span>
                        <span className="font-semibold text-slate-300">{s.emotion}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick text submit fallback */}
            <form onSubmit={handleManualSubmit} className="mt-3 flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={manualInputText}
                onChange={(e) => setManualInputText(e.target.value)}
                placeholder={`Type spoken turn for ${activeSpeakerSide === 'A' ? partA.name : partB.name}...`}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
              >
                Submit Turn
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time AI Referee Panel (3 cols) (Feature #36) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Real-time metrics card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Live Referee Metrics
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2">
                <span className="text-[10px] text-slate-400 uppercase">Statements</span>
                <p className="text-sm font-bold font-code text-slate-100">{statements.length}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2">
                <span className="text-[10px] text-slate-400 uppercase">Claims</span>
                <p className="text-sm font-bold font-code text-indigo-300">
                  {currentDebate?.claims?.length || 4}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2">
                <span className="text-[10px] text-slate-400 uppercase">Evidence</span>
                <p className="text-sm font-bold font-code text-emerald-300">
                  {currentDebate?.evidence?.length || 3}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2">
                <span className="text-[10px] text-slate-400 uppercase">Fallacies</span>
                <p className="text-sm font-bold font-code text-amber-300">
                  {fallacies.length}
                </p>
              </div>
            </div>
          </div>

          {/* Active Fallacy Alerts */}
          <div className="rounded-2xl border border-amber-500/20 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Fallacy Intercepts ({fallacies.length})
              </h4>
              <span className="text-[9px] text-slate-500">Heuristic Engine</span>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {fallacies.map((f) => (
                <div key={f.id} className="rounded-lg border border-amber-500/20 bg-slate-950 p-2 text-[11px]">
                  <p className="font-semibold text-amber-300">{f.fallacy_name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{f.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dialectical Contradiction Alerts */}
          <div className="rounded-2xl border border-purple-500/20 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                Tensions & Contradictions ({contradictions.length})
              </h4>
              <span className="text-[9px] text-slate-500">NLI Classifier</span>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {contradictions.map((ct) => (
                <div key={ct.id} className="rounded-lg border border-purple-500/20 bg-slate-950 p-2 text-[11px]">
                  <p className="font-semibold text-purple-300">{ct.contradiction_type}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{ct.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
