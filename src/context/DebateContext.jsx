import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllDebates, fetchDebateById, addStatementToDebate } from '../services/api.js';
import { voiceEngine } from '../utils/voiceEngine.js';

const DebateContext = createContext(null);

export function DebateProvider({ children }) {
  const [debates, setDebates] = useState([]);
  const [activeDebateId, setActiveDebateId] = useState('demo-social-media');
  const [currentDebate, setCurrentDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Audio synchronization state (Flagship #76)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeStatementId, setActiveStatementId] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [audioVolume, setAudioVolume] = useState(1.0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Multilingual state ('en', 'kn' - Kannada, 'ta' - Tamil, 'te' - Telugu, 'ml' - Malayalam)
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Modals
  const [isVoiceReportOpen, setIsVoiceReportOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null); // { id, originalPrediction, taskType }

  const currentDebateRef = useRef(null);
  currentDebateRef.current = currentDebate;
  const isPlayingAudioRef = useRef(isPlayingAudio);
  isPlayingAudioRef.current = isPlayingAudio;
  const playbackSpeedRef = useRef(playbackSpeed);
  playbackSpeedRef.current = playbackSpeed;

  // Load debates list on mount
  const loadDebates = useCallback(async () => {
    try {
      setLoading(true);
      const list = await fetchAllDebates();
      setDebates(list);
      if (list.length > 0) {
        const targetId = list.some((d) => d.id === activeDebateId) ? activeDebateId : list[0].id;
        setActiveDebateId(targetId);
        const detail = await fetchDebateById(targetId);
        setCurrentDebate(detail);
      }
    } catch (err) {
      console.error('Error loading debates:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeDebateId]);

  useEffect(() => {
    loadDebates();
  }, []);

  // Switch active debate
  const selectDebate = async (id) => {
    try {
      voiceEngine.stop();
      setLoading(true);
      setActiveDebateId(id);
      const detail = await fetchDebateById(id);
      setCurrentDebate(detail);
      setActiveStatementId(null);
      setAudioCurrentTime(0);
      setIsPlayingAudio(false);
    } catch (err) {
      console.error('Error switching debate:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new statement
  const postStatement = async (statementData) => {
    if (!currentDebate) return;
    try {
      const result = await addStatementToDebate(currentDebate.id, statementData);
      // Refresh current debate details
      const updated = await fetchDebateById(currentDebate.id);
      setCurrentDebate(updated);
      return result;
    } catch (err) {
      console.error('Failed to post statement:', err);
      throw err;
    }
  };

  // Speak a statement and optionally chain to subsequent statements
  const speakStatementAtIndex = useCallback((statements, index, chain = true) => {
    if (!statements || index >= statements.length || index < 0) {
      setIsPlayingAudio(false);
      return;
    }

    const statement = statements[index];
    setActiveStatementId(statement.id);
    setAudioCurrentTime(statement.timestamp_start || 0);
    setIsPlayingAudio(true);

    voiceEngine.speakStatement(statement, {
      rate: playbackSpeedRef.current,
      playChimeOnStart: index === 0,
      onStart: () => {
        setIsPlayingAudio(true);
        setActiveStatementId(statement.id);
      },
      onEnd: () => {
        // If chaining is enabled and still in playing state, speak next
        if (chain && isPlayingAudioRef.current) {
          const nextIndex = index + 1;
          if (nextIndex < statements.length) {
            // Brief natural pause between debater turns
            setTimeout(() => {
              if (isPlayingAudioRef.current) {
                speakStatementAtIndex(statements, nextIndex, true);
              }
            }, 600);
          } else {
            setIsPlayingAudio(false);
            voiceEngine.playCue('gavel');
          }
        }
      },
      onError: (err) => {
        console.warn('Voice playback issue for statement:', statement.id, err);
      },
    });
  }, []);

  // Seek and play specific transcript sentence
  const playSentenceAudio = (statement) => {
    if (!statement) return;
    const statements = currentDebate?.statements || [];
    const index = statements.findIndex((s) => s.id === statement.id);

    // If already playing this exact statement, toggle pause
    if (isPlayingAudio && activeStatementId === statement.id && voiceEngine.isSpeaking) {
      voiceEngine.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (index !== -1) {
      speakStatementAtIndex(statements, index, true);
    } else {
      setActiveStatementId(statement.id);
      setAudioCurrentTime(statement.timestamp_start || 0);
      setIsPlayingAudio(true);
      voiceEngine.speakStatement(statement, {
        rate: playbackSpeed,
        playChimeOnStart: true,
        onEnd: () => setIsPlayingAudio(false),
      });
    }
  };

  // Toggle overall debate audio playback
  const toggleAudioPlayback = () => {
    const statements = currentDebate?.statements || [];
    if (statements.length === 0) return;

    if (isPlayingAudio) {
      voiceEngine.pause();
      voiceEngine.playCue('stop');
      setIsPlayingAudio(false);
    } else {
      // Find where to resume from
      let targetIndex = 0;
      if (activeStatementId) {
        const foundIdx = statements.findIndex((s) => s.id === activeStatementId);
        if (foundIdx !== -1) targetIndex = foundIdx;
      } else {
        const foundTimeIdx = statements.findIndex(
          (s) => audioCurrentTime >= (s.timestamp_start || 0) && audioCurrentTime <= (s.timestamp_end || s.timestamp_start + 15)
        );
        if (foundTimeIdx !== -1) targetIndex = foundTimeIdx;
      }
      speakStatementAtIndex(statements, targetIndex, true);
    }
  };

  const stopAudio = () => {
    voiceEngine.stop();
    setIsPlayingAudio(false);
  };

  const testAudioSound = () => {
    voiceEngine.testAudio();
  };

  const updateVolume = (val) => {
    setAudioVolume(val);
    voiceEngine.setVolume(val);
    if (val === 0) setIsAudioMuted(true);
    else setIsAudioMuted(false);
  };

  const toggleMute = () => {
    const muted = voiceEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  const updatePlaybackSpeed = (speed) => {
    setPlaybackSpeed(speed);
  };

  return (
    <DebateContext.Provider
      value={{
        debates,
        currentDebate,
        activeDebateId,
        loading,
        error,
        selectDebate,
        loadDebates,
        postStatement,
        audioCurrentTime,
        setAudioCurrentTime,
        isPlayingAudio,
        setIsPlayingAudio,
        activeStatementId,
        setActiveStatementId,
        playSentenceAudio,
        toggleAudioPlayback,
        stopAudio,
        testAudioSound,
        playbackSpeed,
        setPlaybackSpeed: updatePlaybackSpeed,
        audioVolume,
        setAudioVolume: updateVolume,
        isAudioMuted,
        toggleMute,
        selectedLanguage,
        setSelectedLanguage,
        isVoiceReportOpen,
        setIsVoiceReportOpen,
        feedbackTarget,
        setFeedbackTarget,
        voiceEngine,
      }}
    >
      {children}
    </DebateContext.Provider>
  );
}

export function useDebate() {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error('useDebate must be used within a DebateProvider');
  }
  return context;
}
