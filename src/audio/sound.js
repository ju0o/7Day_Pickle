/**
 * OneWord: Web Audio API 기반 무외부음원 사운드 신디사이저 (v0.6 - Multi-Theme & Haptic)
 * 외부 mp3/wav 파일 다운로드 없이 브라우저 오실레이터로 100% 실시간 합성
 * 4대 사운드 테마(Court, Cyber, Minimal, 8-Bit) 및 모바일 햅틱 진동 피드백 탑재
 */

export const SOUND_THEMES = {
  court: { id: "court", label: "🔨 법정 (Court)", desc: "묵직한 원목 법봉과 엄숙한 저음 타격" },
  cyber: { id: "cyber", label: "⚡ 사이버 (Cyber)", desc: "레이저 블래스트와 고주파 신스 글리치" },
  minimal: { id: "minimal", label: "🔔 미니멀 (Minimal)", desc: "청아한 싱잉볼과 맑은 차임 여운" },
  retro8bit: { id: "retro8bit", label: "👾 8비트 (8-Bit)", desc: "패미컴 아케이드 점프와 레트로 폭발음" }
};

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.currentTheme = "court";

    // 저장된 테마 복원
    if (typeof localStorage !== "undefined") {
      const savedTheme = localStorage.getItem("oneword_sound_theme");
      if (savedTheme && SOUND_THEMES[savedTheme]) {
        this.currentTheme = savedTheme;
      }
    }
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setTheme(themeId) {
    if (SOUND_THEMES[themeId]) {
      this.currentTheme = themeId;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("oneword_sound_theme", themeId);
      }
    }
  }

  getTheme() {
    return this.currentTheme;
  }

  // 모바일 햅틱 진동 피드백 (지원 기기 한정)
  triggerHaptic(pattern = [40, 60, 140]) {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        navigator.vibrate(pattern);
      }
    } catch (e) {}
  }

  // 1. 키 스트로크 / 클릭음 (테마별)
  playClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      switch (this.currentTheme) {
        case "cyber":
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(1400 + Math.random() * 300, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
          break;

        case "minimal":
          osc.type = "sine";
          osc.frequency.setValueAtTime(480, now);
          gain.gain.setValueAtTime(0.025, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
          break;

        case "retro8bit":
          osc.type = "square";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.setValueAtTime(900, now + 0.015);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
          break;

        case "court":
        default:
          osc.type = "sine";
          osc.frequency.setValueAtTime(800 + Math.random() * 350, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
          break;
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // 2. 심판관 등장 큐음 (테마별)
  playJudgeCue(freq = 520, step = 0) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      switch (this.currentTheme) {
        case "cyber":
          // 고주파 디지털 글리치 스윕
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq * 1.5, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 3, now + 0.08);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          break;

        case "minimal":
          // 부드러운 싱잉볼 단음
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq * 0.8, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
          break;

        case "retro8bit":
          // 패미컴 아케이드 코인 비프
          osc.type = "square";
          osc.frequency.setValueAtTime(987.77, now); // B5
          osc.frequency.setValueAtTime(1318.51, now + 0.05); // E6
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          break;

        case "court":
        default:
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + 0.1);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          break;
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // 3. 최종 선고 타격음 (테마별 법봉 및 충격음)
  playGavelImpact() {
    this.triggerHaptic([50, 80, 160]);
    if (this.isMuted || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      switch (this.currentTheme) {
        case "cyber":
          this._playCyberImpact(now);
          break;

        case "minimal":
          this._playMinimalBell(now);
          break;

        case "retro8bit":
          this._play8BitFanfare(now);
          break;

        case "court":
        default:
          this._playCourtGavel(now);
          break;
      }
    } catch (e) {}
  }

  // [A] 클래식 법정 (원목 법봉 + 묵직한 서브우퍼)
  _playCourtGavel(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.45);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);

    // 타격 노이즈
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 0.12);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.14);
  }

  // [B] 사이버펑크 (레이저 임팩트 + 신스 글리치 킥)
  _playCyberImpact(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1500, now);
    filter.Q.value = 3;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // [C] 미니멀 (528Hz 힐링 명상 벨 사운드)
  _playMinimalBell(now) {
    const harmonics = [528, 1056, 1584];
    harmonics.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      const amp = 0.25 / (idx + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    });
  }

  // [D] 8비트 아케이드 (레트로 보스 격파 폭발)
  _play8BitFanfare(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554.37, now + 0.08);
    osc.frequency.setValueAtTime(659.25, now + 0.16);
    osc.frequency.setValueAtTime(880, now + 0.24);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }
}

export const sound = new SoundEngine();
