/**
 * OneWord: AI 심판관 커스텀 성향 튜너 (v0.8.3)
 * 3인의 심판관(닥터 로직·캡틴 바이브·미스터 팩트)의 발언 가중치 및 최종 판결 성향을 조율하는 엔진
 */

export const BIAS_MODES = {
  balanced: {
    id: "balanced",
    icon: "⚖️",
    nameKo: "밸런스 모드",
    nameEn: "Balanced Mode",
    badgeKo: "⚖️ 밸런스 심판",
    badgeEn: "⚖️ BALANCED",
    descKo: "이성 33% · 행동 33% · 현실 33% 균등 토론",
    descEn: "Equal 33% split between Logic, Vibe & Reality",
    weights: { reason: 0.33, instinct: 0.33, realist: 0.34 },
    sliderVal: 50
  },
  rational: {
    id: "rational",
    icon: "🧠",
    nameKo: "극단적 이성파",
    nameEn: "Hyper-Rational",
    badgeKo: "🧠 이성/절제 모드",
    badgeEn: "🧠 HYPER-RATIONAL",
    descKo: "닥터 로직 80% — 충동 억제 & 냉철한 손익 계산",
    descEn: "Dr. Logic 80% — Impulse control & cold calculus",
    weights: { reason: 0.80, instinct: 0.10, realist: 0.10 },
    sliderVal: 10
  },
  vibe: {
    id: "vibe",
    icon: "⚡",
    nameKo: "도파민 풀악셀",
    nameEn: "Full-Vibe YOLO",
    badgeKo: "⚡ 도파민 풀악셀",
    badgeEn: "⚡ FULL-VIBE YOLO",
    descKo: "캡틴 바이브 80% — 직진과 실행, 저지르고 보기",
    descEn: "Captain Vibe 80% — Adrenaline, action & no regrets",
    weights: { reason: 0.10, instinct: 0.80, realist: 0.10 },
    sliderVal: 90
  },
  realist: {
    id: "realist",
    icon: "💀",
    nameKo: "현실 팩폭러",
    nameEn: "Brutal Reality",
    badgeKo: "💀 현실 팩폭 모드",
    badgeEn: "💀 BRUTAL REALITY",
    descKo: "미스터 팩트 80% — 통장 잔고 & 내일의 후회 팩폭",
    descEn: "Mr. Fact 80% — Cold hard bank balance & morning regrets",
    weights: { reason: 0.20, instinct: 0.10, realist: 0.70 },
    sliderVal: 30
  }
};

export class JudgeBiasTuner {
  static STORAGE_KEY = "oneword_judge_bias";

  constructor() {
    this.currentMode = this.loadMode();
  }

  loadMode() {
    try {
      const saved = localStorage.getItem(JudgeBiasTuner.STORAGE_KEY);
      if (saved && BIAS_MODES[saved]) {
        return saved;
      }
    } catch (e) {
      // LocalStorage 에러 대비
    }
    return "balanced";
  }

  setMode(mode) {
    if (!BIAS_MODES[mode]) mode = "balanced";
    this.currentMode = mode;
    try {
      localStorage.setItem(JudgeBiasTuner.STORAGE_KEY, mode);
    } catch (e) {}
    return this.getModeInfo();
  }

  getMode() {
    return this.currentMode;
  }

  getModeInfo() {
    return BIAS_MODES[this.currentMode] || BIAS_MODES.balanced;
  }

  getBadgeText(lang = "ko") {
    const info = this.getModeInfo();
    return lang === "en" ? info.badgeEn : info.badgeKo;
  }

  static fromSlider(val) {
    const num = Number(val);
    if (num <= 20) return "rational";
    if (num >= 80) return "vibe";
    if (num > 20 && num < 45) return "realist";
    return "balanced";
  }
}
