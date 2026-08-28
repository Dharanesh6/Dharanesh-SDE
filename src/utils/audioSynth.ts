// Web Audio API Synthesizer & Sound FX Engine for Real-Time CV Volume Control

class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private isPlaying: boolean = false;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.gain.connect(this.ctx.destination);
    } catch {}
  }

  public startTone(freq = 440, initialVolume = 70) {
    this.init();
    if (!this.ctx || !this.gain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.osc) {
      try {
        this.osc.stop();
        this.osc.disconnect();
      } catch {}
    }

    this.osc = this.ctx.createOscillator();
    this.osc.type = 'sine';
    this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    this.osc.connect(this.gain);
    this.osc.start();
    this.isPlaying = true;
    this.setVolume(initialVolume);
  }

  public setVolume(volume0to100: number) {
    if (!this.gain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(volume0to100, 100));
    const targetGain = (clamped / 100) * 0.28;
    this.gain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.04);

    if (this.osc) {
      // Dynamic frequency modulation: higher finger distance = higher musical pitch
      const targetFreq = 220 + clamped * 3.5;
      this.osc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.04);
    }
  }

  public playClickSound() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {}
  }

  public playAlertSound() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  public stopTone() {
    if (this.osc) {
      try {
        this.osc.stop();
        this.osc.disconnect();
      } catch {}
      this.osc = null;
    }
    this.isPlaying = false;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioSynth = new AudioSynthEngine();
