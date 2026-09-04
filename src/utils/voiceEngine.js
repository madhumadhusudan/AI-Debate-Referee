/**
 * AI Debate Referee - Multimodal Voice & Audio Engine
 * Provides dual-engine audio playback:
 * 1. Web Speech Synthesis with speaker personas (Dr. Sarah Chen vs Marcus Vance vs Referee)
 * 2. Web Audio API acoustic synthesizer & audio cues (chimes, gavels, fallback voice formants)
 * Fixes browser/Chromium iframe bugs (garbage collection cancellation, stuck pauses, missing voices).
 */

class VoiceEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.audioCtx = null;
    this.voices = [];
    this.currentUtterance = null;
    this.keepAliveTimer = null;
    this.isSpeaking = false;
    this.volume = 1.0;
    this.isMuted = false;
    this.fallbackOscillators = [];
    this.activeStatementId = null;

    if (typeof window !== 'undefined') {
      this.initVoices();
      if (this.synth) {
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.initVoices();
        }
      }
      // Resume AudioContext on any first user interaction
      const unlockAudio = () => {
        this.getAudioContext();
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        if (this.synth && this.synth.paused) {
          this.synth.resume();
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
    }
  }

  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  initVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
    } catch (e) {
      this.voices = [];
    }
  }

  getBestVoice(persona = 'moderator', lang = 'en') {
    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }
    const englishVoices = this.voices.filter((v) => v.lang.startsWith('en') || v.lang.startsWith('EN'));
    const pool = englishVoices.length > 0 ? englishVoices : this.voices;
    if (pool.length === 0) return null;

    if (persona === 'female' || persona === 'sarah') {
      // Look for natural female sounding voices
      const female = pool.find(
        (v) =>
          /female|woman|sarah|samantha|zira|karen|victoria|moira|fiona|cora|jenny/i.test(v.name) ||
          /google.*female/i.test(v.name)
      );
      return female || pool[0];
    } else if (persona === 'male' || persona === 'marcus') {
      // Look for natural male sounding voices
      const male = pool.find(
        (v) =>
          /male|man|david|daniel|george|alex|fred|marcus|james|guy|tom|oliver/i.test(v.name) ||
          /google.*male/i.test(v.name)
      );
      return male || pool[Math.min(1, pool.length - 1)];
    } else {
      // Moderator / Referee: Natural authoritative voice
      const preferred = pool.find(
        (v) => /natural|neural|premium|enhanced|google|siri/i.test(v.name)
      );
      return preferred || pool[0];
    }
  }

  /**
   * Play an audible acoustic chime or cue (debater turn chime, gavel, start/stop)
   */
  playCue(type = 'start') {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      osc.connect(gain);

      if (type === 'start') {
        // High upbeat dual tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
        gain.gain.setValueAtTime(0.12 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'stop') {
        // Subtle descending tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.15); // E4
        gain.gain.setValueAtTime(0.08 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'gavel') {
        // Debate gavel strike (wooden resonant click)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
        gain.gain.setValueAtTime(0.35 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'fallacy') {
        // Amber fallacy alert
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(320, now + 0.1);
        gain.gain.setValueAtTime(0.1 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.26);
      }
    } catch (e) {
      console.warn('Audio cue error:', e);
    }
  }

  /**
   * Audible acoustic formant vocal simulation (used if system TTS produces no audio or fails)
   */
  playSyntheticVocalCadence(text, pitchMultiplier = 1.0, onEnd = () => {}) {
    if (this.isMuted) {
      onEnd();
      return;
    }
    try {
      const ctx = this.getAudioContext();
      if (!ctx) {
        onEnd();
        return;
      }

      const words = text.split(/\s+/).filter(Boolean);
      const wordDuration = 0.22;
      const totalTime = Math.max(1.5, Math.min(words.length * wordDuration, 12));
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const baseFreq = (pitchMultiplier > 1 ? 220 : 130) * pitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 * pitchMultiplier, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.05 * this.volume, now);

      // Vary pitch and formants per word to create human speech cadence
      words.forEach((_, idx) => {
        const t = now + idx * wordDuration;
        const inflect = (Math.sin(idx * 0.8) * 25 + (idx % 3 === 0 ? 30 : -15));
        osc.frequency.setValueAtTime(baseFreq + inflect, t);
        filter.frequency.setValueAtTime((800 + Math.cos(idx) * 350) * pitchMultiplier, t);
      });

      gain.gain.setValueAtTime(0.06 * this.volume, now + totalTime - 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + totalTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + totalTime);

      setTimeout(() => {
        onEnd();
      }, totalTime * 1000);
    } catch (err) {
      console.warn('Synthetic vocal fallback failed:', err);
      onEnd();
    }
  }

  /**
   * Main Speak Method
   * Speaks any given text with chosen debater voice persona and rate
   */
  speakText(text, options = {}) {
    const {
      persona = 'moderator', // 'female' | 'sarah' | 'male' | 'marcus' | 'moderator'
      rate = 1.0,
      pitch = null,
      onStart = () => {},
      onEnd = () => {},
      onError = () => {},
      playChimeOnStart = false,
      statementId = null,
    } = options;

    this.stop();

    if (!text || !text.trim() || this.isMuted) {
      onEnd();
      return;
    }

    if (playChimeOnStart) {
      this.playCue('start');
    }

    this.activeStatementId = statementId;
    this.isSpeaking = true;

    // Check if SpeechSynthesis is available
    if (this.synth && typeof window.SpeechSynthesisUtterance !== 'undefined') {
      try {
        // Cancel any lingering queued speech
        this.synth.cancel();

        // Determine pitch and voice
        let targetPitch = 1.0;
        let voicePersona = persona;

        if (persona === 'female' || persona === 'sarah' || (typeof persona === 'string' && persona.toLowerCase().includes('sarah'))) {
          targetPitch = pitch || 1.18;
          voicePersona = 'female';
        } else if (persona === 'male' || persona === 'marcus' || (typeof persona === 'string' && persona.toLowerCase().includes('marcus'))) {
          targetPitch = pitch || 0.88;
          voicePersona = 'male';
        } else {
          targetPitch = pitch || 1.0;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = Math.max(0.6, Math.min(rate, 2.0));
        utterance.pitch = targetPitch;
        utterance.volume = this.volume;

        const matchedVoice = this.getBestVoice(voicePersona);
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        let hasStarted = false;

        utterance.onstart = () => {
          hasStarted = true;
          this.isSpeaking = true;
          onStart();
        };

        utterance.onend = () => {
          this.isSpeaking = false;
          this.activeStatementId = null;
          this.clearKeepAlive();
          onEnd();
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error event:', e);
          this.isSpeaking = false;
          this.activeStatementId = null;
          this.clearKeepAlive();
          // Fallback to acoustic simulation if synthesis errored
          if (!hasStarted) {
            this.playSyntheticVocalCadence(text, targetPitch, onEnd);
          } else {
            onError(e);
          }
        };

        // Retain reference on window to prevent Chromium garbage collection bug
        window.__activeDebateUtterance = utterance;
        this.currentUtterance = utterance;

        // Chrome keep-alive hack for speeches longer than 14 seconds
        this.clearKeepAlive();
        this.keepAliveTimer = setInterval(() => {
          if (this.synth && this.synth.speaking) {
            this.synth.pause();
            this.synth.resume();
          } else {
            this.clearKeepAlive();
          }
        }, 10000);

        // Resume synth if stuck
        if (this.synth.paused) {
          this.synth.resume();
        }

        this.synth.speak(utterance);

        // Timeout safety: If speak() did not fire onstart within 800ms, fallback to acoustic
        setTimeout(() => {
          if (!hasStarted && this.isSpeaking) {
            console.warn('SpeechSynthesis onstart timeout; deploying acoustic speech synthesis fallback.');
            this.playSyntheticVocalCadence(text, targetPitch, () => {
              this.isSpeaking = false;
              this.activeStatementId = null;
              onEnd();
            });
          }
        }, 800);

        return;
      } catch (err) {
        console.warn('SpeechSynthesis threw exception:', err);
      }
    }

    // Fallback: Web Audio acoustic vocal simulation
    const targetPitch = (persona === 'female' || persona === 'sarah') ? 1.2 : 0.9;
    onStart();
    this.playSyntheticVocalCadence(text, targetPitch, () => {
      this.isSpeaking = false;
      this.activeStatementId = null;
      onEnd();
    });
  }

  /**
   * Speak a specific debate statement object
   */
  speakStatement(statement, options = {}) {
    if (!statement) return;
    const isSarah = (statement.speaker_name || '').toLowerCase().includes('sarah') || statement.participant_id === 'p-sarah';
    const persona = isSarah ? 'female' : 'male';

    return this.speakText(statement.text, {
      persona,
      statementId: statement.id,
      ...options,
    });
  }

  pause() {
    if (this.synth && this.synth.speaking) {
      try {
        this.synth.pause();
      } catch (e) {}
    }
    this.isSpeaking = false;
  }

  resume() {
    if (this.synth && this.synth.paused) {
      try {
        this.synth.resume();
        this.isSpeaking = true;
      } catch (e) {}
    }
  }

  stop() {
    this.clearKeepAlive();
    this.activeStatementId = null;
    this.isSpeaking = false;
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
  }

  clearKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.isMuted = this.volume === 0;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    }
    return this.isMuted;
  }

  /**
   * Self-test sound generation: plays a 440Hz->880Hz chime and speaks a confirmation
   */
  testAudio() {
    this.playCue('start');
    setTimeout(() => {
      this.speakText('Audio and voice engine active. AI Debate Referee ready.', {
        persona: 'moderator',
        rate: 1.05,
      });
    }, 250);
  }
}

export const voiceEngine = new VoiceEngine();
export default voiceEngine;
