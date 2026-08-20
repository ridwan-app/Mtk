// Kid-friendly Web Audio Synthesizer for engaging game sound effects

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Lazy initialize on first interaction
  }

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Soft button click
  public playClick() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio not supported
    }
  }

  // Correct answer cheerful chime (major arpeggio)
  public playCorrect() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.09);

        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.09);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.09 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.09);
        osc.stop(ctx.currentTime + index * 0.09 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // Gentle encouraging error tone
  public playWrong() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  // Airplane engine roar / takeoff whoosh
  public playTakeoff() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {
      // ignore
    }
  }

  // Star ding
  public playStar(starIndex: number = 0) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const freqs = [659.25, 783.99, 1046.5]; // E5, G5, C6
      const freq = freqs[starIndex % freqs.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // ignore
    }
  }

  // Celebration fanfare on island completion
  public playFanfare() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const fanfareNotes = [
        { f: 523.25, t: 0.0, d: 0.15 },
        { f: 523.25, t: 0.15, d: 0.15 },
        { f: 523.25, t: 0.3, d: 0.15 },
        { f: 659.25, t: 0.45, d: 0.35 },
        { f: 783.99, t: 0.7, d: 0.2 },
        { f: 1046.5, t: 0.9, d: 0.6 },
      ];

      fanfareNotes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);

        gain.gain.setValueAtTime(0, ctx.currentTime + n.t);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + n.t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.t + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + n.d + 0.05);
      });
    } catch {
      // ignore
    }
  }

  // Play cute cartoon mascot chirps / babble voice (for Kiko the Garuda mascot)
  public playMascotChirp(durationSeconds: number = 0.3) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const chirpPitches = [880, 1100, 1320, 987, 1200];
      const count = Math.max(2, Math.min(6, Math.floor(durationSeconds * 8)));

      for (let i = 0; i < count; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const p = chirpPitches[i % chirpPitches.length] + Math.random() * 80;
        const startTime = ctx.currentTime + i * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(p, startTime);
        osc.frequency.exponentialRampToValueAtTime(p * 1.25, startTime + 0.05);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.055);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.06);
      }
    } catch {
      // ignore
    }
  }
}

// -------------------------------------------------------------
// MASCOT SPEECH SYNTHESIZER (Bahasa Indonesia TTS + Mascot Voice)
// -------------------------------------------------------------
class MascotSpeechManager {
  private isSpeakingState: boolean = false;
  private listeners: Set<(speaking: boolean) => void> = new Set();
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Load voices when available
      window.speechSynthesis.onvoiceschanged = () => {
        this.findIndonesianVoice();
      };
      this.findIndonesianVoice();
    }
  }

  private findIndonesianVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    // Look for Indonesian voice (id-ID or containing 'id' / 'indonesia')
    const idVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('id') ||
        v.name.toLowerCase().includes('indonesia') ||
        v.lang.toLowerCase().includes('id-id')
    );
    this.selectedVoice = idVoice || null;
    return this.selectedVoice;
  }

  public addListener(callback: (speaking: boolean) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.listeners.forEach((cb) => cb(speaking));
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  // Pre-process text to make it sound natural and clear in Indonesian
  public cleanTextForSpeech(rawText: string): string {
    if (!rawText) return '';

    let cleaned = rawText
      // Replace math operations with Indonesian spoken words
      .replace(/÷/g, ' dibagi ')
      .replace(/×/g, ' dikali ')
      .replace(/\+/g, ' ditambah ')
      .replace(/ - /g, ' dikurang ')
      .replace(/=/g, ' sama dengan ')
      .replace(/Rp\s*([0-9.,]+)/gi, '$1 rupiah')
      .replace(/cm²/gi, ' sentimeter persegi ')
      .replace(/cm/gi, ' sentimeter ')
      .replace(/km/gi, ' kilometer ')
      .replace(/kg/gi, ' kilogram ')
      .replace(/°/g, ' derajat ')
      // Strip emojis
      .replace(
        /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu,
        ''
      )
      // Clean duplicate spaces and punctuation artifacts
      .replace(/\.{2,}/g, '.')
      .replace(/\s+/g, ' ')
      .trim();

    return cleaned;
  }

  // Speak text using Web Speech API (Indonesian) + Mascot Chirps
  public speak(text: string, onFinish?: () => void) {
    if (typeof window === 'undefined') return;

    // Play cute mascot chirp sound immediately
    soundManager.playMascotChirp(0.25);

    if (!('speechSynthesis' in window)) {
      if (onFinish) onFinish();
      return;
    }

    try {
      // Cancel previous speech if running
      window.speechSynthesis.cancel();

      const cleaned = this.cleanTextForSpeech(text);
      if (!cleaned) {
        if (onFinish) onFinish();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'id-ID';
      utterance.rate = 1.02; // Friendly, energetic kid speed
      utterance.pitch = 1.22; // Cheerful, cute high pitch for Kiko Garuda

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      } else {
        const idVoice = this.findIndonesianVoice();
        if (idVoice) utterance.voice = idVoice;
      }

      utterance.onstart = () => {
        this.notify(true);
      };

      utterance.onend = () => {
        this.notify(false);
        if (onFinish) onFinish();
      };

      utterance.onerror = () => {
        this.notify(false);
        if (onFinish) onFinish();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.notify(false);
      if (onFinish) onFinish();
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notify(false);
  }
}

export const soundManager = new SoundManager();
export const mascotSpeechManager = new MascotSpeechManager();
