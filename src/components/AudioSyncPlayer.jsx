import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Volume2, VolumeX, Sparkles, Radio } from 'lucide-react';
import { useDebate } from '../context/DebateContext.jsx';

export default function AudioSyncPlayer() {
  const {
    currentDebate,
    audioCurrentTime,
    setAudioCurrentTime,
    isPlayingAudio,
    activeStatementId,
    setActiveStatementId,
    toggleAudioPlayback,
    playbackSpeed,
    setPlaybackSpeed,
    audioVolume,
    setAudioVolume,
    isAudioMuted,
    toggleMute,
    testAudioSound,
    voiceEngine,
  } = useDebate();

  const [totalDuration, setTotalDuration] = useState(180); // Default 3 minutes
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const intervalRef = useRef(null);

  const statements = currentDebate?.statements || [];

  // Calculate total debate duration from last statement timestamp
  useEffect(() => {
    if (statements.length > 0) {
      const maxTime = Math.max(...statements.map((s) => s.timestamp_end || s.timestamp_start + 15), 180);
      setTotalDuration(Math.ceil(maxTime));
    }
  }, [statements]);

  // Audio timer increment when playing
  useEffect(() => {
    if (isPlayingAudio) {
      intervalRef.current = setInterval(() => {
        setAudioCurrentTime((prev) => {
          const next = prev + 0.5 * playbackSpeed;
          if (next >= totalDuration) {
            return totalDuration;
          }

          // Check if current time falls within any statement
          const active = statements.find(
            (s) => next >= (s.timestamp_start || 0) && next <= (s.timestamp_end || s.timestamp_start + 15)
          );
          if (active && active.id !== activeStatementId) {
            setActiveStatementId(active.id);
          }
          return next;
        });
      }, 500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlayingAudio, playbackSpeed, totalDuration, statements, activeStatementId, setAudioCurrentTime, setActiveStatementId]);

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setAudioCurrentTime(time);
    const active = statements.find(
      (s) => time >= (s.timestamp_start || 0) && time <= (s.timestamp_end || s.timestamp_start + 15)
    );
    if (active) {
      setActiveStatementId(active.id);
      if (isPlayingAudio) {
        voiceEngine.speakStatement(active, { rate: playbackSpeed });
      }
    }
  };

  const handleSkip = (delta) => {
    const newTime = Math.max(0, Math.min(totalDuration, audioCurrentTime + delta));
    setAudioCurrentTime(newTime);
    const active = statements.find(
      (s) => newTime >= (s.timestamp_start || 0) && newTime <= (s.timestamp_end || s.timestamp_start + 15)
    );
    if (active) {
      setActiveStatementId(active.id);
      if (isPlayingAudio) {
        voiceEngine.speakStatement(active, { rate: playbackSpeed });
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeStatement = statements.find((s) => s.id === activeStatementId) || statements[0];
  const isSarah = activeStatement?.speaker_name?.toLowerCase().includes('sarah');

  return (
    <div className="w-full border-t border-slate-800 bg-slate-950/95 px-4 py-2.5 backdrop-blur-md sticky bottom-0 z-30 shadow-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* Active sentence preview */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            onClick={toggleAudioPlayback}
            className={`h-9 w-9 cursor-pointer flex items-center justify-center rounded-xl border transition shrink-0 ${
              isPlayingAudio
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 shadow-md shadow-indigo-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isPlayingAudio ? 'Pause Spoken Debate' : 'Play Spoken Debate'}
          >
            {isPlayingAudio ? (
              <div className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-indigo-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                <span className="w-1 bg-indigo-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-4" />
                <span className="w-1 bg-indigo-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
              </div>
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1">
                <Radio className="h-3 w-3" />
                Multimodal Audio Stream
              </span>
              {activeStatement && (
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                    isSarah
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {activeStatement.speaker_name}
                </span>
              )}
              {isPlayingAudio && (
                <span className="text-[10px] font-code text-emerald-400 animate-pulse flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Voice Speaking
                </span>
              )}
            </div>
            <p className="truncate text-xs text-slate-300 mt-0.5" title={activeStatement?.text}>
              {activeStatement ? activeStatement.text : 'Click Play to hear debaters speak with synchronized NLP tracking'}
            </p>
          </div>

          {/* Quick Audio Test Button */}
          <button
            onClick={testAudioSound}
            className="hidden lg:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300 transition shrink-0"
            title="Play an audio chime & test speaker voice"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Test Sound</span>
          </button>
        </div>

        {/* Player controls */}
        <div className="flex flex-col items-center gap-1.5 md:w-96">
          <div className="flex items-center gap-3">
            {/* Back 5s */}
            <button
              onClick={() => handleSkip(-5)}
              className="rounded p-1 text-slate-400 hover:text-slate-200 transition"
              title="Rewind 5s"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            {/* Main Play / Pause Button */}
            <button
              onClick={toggleAudioPlayback}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md transition ${
                isPlayingAudio
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
              title={isPlayingAudio ? 'Pause Voice' : 'Play Voice'}
            >
              {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>

            {/* Forward 5s */}
            <button
              onClick={() => handleSkip(5)}
              className="rounded p-1 text-slate-400 hover:text-slate-200 transition"
              title="Forward 5s"
            >
              <FastForward className="h-3.5 w-3.5" />
            </button>

            {/* Speed pills */}
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[10px] font-code text-slate-300 focus:outline-none hover:border-slate-700 cursor-pointer"
              title="Playback Speed"
            >
              <option value="0.75">0.75x</option>
              <option value="1.0">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2.0">2.0x</option>
            </select>

            {/* Volume / Mute Controls */}
            <div className="relative flex items-center">
              <button
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className={`rounded p-1 transition ${
                  isAudioMuted ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                title={isAudioMuted ? 'Unmute' : 'Mute'}
              >
                {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>

              {showVolumeSlider && (
                <div
                  onMouseLeave={() => setShowVolumeSlider(false)}
                  className="absolute bottom-7 -left-10 z-50 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 shadow-2xl backdrop-blur-md"
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isAudioMuted ? 0 : audioVolume}
                    onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                    className="h-1.5 w-20 cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500"
                  />
                  <span className="text-[10px] font-code text-slate-300 w-6">
                    {Math.round((isAudioMuted ? 0 : audioVolume) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline slider */}
          <div className="flex w-full items-center gap-2 text-[11px] font-code text-slate-400">
            <span>{formatTime(audioCurrentTime)}</span>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.5"
              value={audioCurrentTime}
              onChange={handleSeek}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500"
            />
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
