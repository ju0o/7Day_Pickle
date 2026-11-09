/**
 * OneWord: Multilingual i18n & Global Presets Engine (v0.7.0)
 * 한국어 / 영어 원클릭 실시간 토글 지원 (외부 의존성 제로)
 */

export const TRANSLATIONS = {
  ko: {
    title: '결정 장애, <span class="text-cyan-400">단 한 단어</span>로 끝냅니다.',
    subtitle: "수많은 고민과 핑계는 접어두세요. 3명의 가상 AI 심판관이 3초 만에 선고합니다.",
    swipe_hint: "💡 모바일 화면에서 좌우로 스와이프하면 카테고리가 즉시 전환됩니다",
    input_label: "판결받을 고민 질문 입력",
    input_placeholder: "예: 새벽 2시인데 라면 끓여먹을까? / 이직 준비 지금 시작할까?",
    random_btn: "🎲 랜덤 고민 셔플",
    submit_btn: "⚖️ 3초 만에 최종 판결받기",
    recommend_presets: "💡 추천 고민 질문:",
    one_click_hint: "원클릭 즉시 자동 입력",
    judging_title: "3인의 AI 심판관이 난상토론 중입니다...",
    judge_reason: "🧠 닥터 로직 (이성):",
    judge_instinct: "⚡ 캡틴 바이브 (행동):",
    judge_realist: "💀 미스터 팩트 (현실):",
    poll_title: "👥 시민 배심원단 투표",
    poll_agree: "👍 완전 인정",
    poll_disagree: "👎 결사 반대",
    poll_voted_agree: "👍 인정 투표완료",
    poll_voted_disagree: "👎 반대 투표완료",
    card_style_label: "🎨 SNS 카드 테마 선택:",
    save_square: "🖼️ 1:1 피드 카드 저장",
    save_story: "📱 9:16 스토리 저장",
    copy_link: "🔗 판결 링크 복사",
    copied_link: "링크 복사 완료! 🎉",
    share_x: "𝕏 공유",
    share_threads: "🧵 스레드 공유",
    copy_text: "📋 텍스트 복사",
    copied_text: "판결문 복사 완료! 📋",
    native_share: "📱 시스템 공유",
    reset_btn: "🔄 다른 고민 판결받기",
    recent_history: "최근 내 판결",
    view_all_history: "전체 보기 (보관함) →",
    history_modal_title: "🗂️ 내 판결 보관함",
    history_modal_subtitle: "내 브라우저 LocalStorage에 안전하게 보관된 판결 목록",
    clear_all_btn: "🗑️ 전체 기록 비우기",
    no_history: "보관된 판결이 없습니다.",
    archive_btn: "🗂️ 보관함",
    cat_all: "🔥 전체",
    cat_shopping: "🛍️ 지름신",
    cat_career: "💼 커리어",
    cat_love: "💌 연애",
    cat_daily: "🍜 일상"
  },
  en: {
    title: 'Decision fatigue, <span class="text-cyan-400">ended in ONE WORD</span>.',
    subtitle: "Stop overthinking. 3 virtual AI judges debate and deliver the final verdict in 3 seconds.",
    swipe_hint: "💡 Swipe left or right on mobile to quickly switch categories",
    input_label: "ENTER YOUR DILEMMA FOR VERDICT",
    input_placeholder: "e.g. Should I buy the new M3 MacBook? / Quit my 9-to-5 for a startup?",
    random_btn: "🎲 Random Dilemma",
    submit_btn: "⚖️ Get Verdict in 3 Seconds",
    recommend_presets: "💡 Recommended Dilemmas:",
    one_click_hint: "One-click auto-fill",
    judging_title: "3 AI Judges are in heated debate...",
    judge_reason: "🧠 Dr. Logic (Reason):",
    judge_instinct: "⚡ Captain Vibe (Instinct):",
    judge_realist: "💀 Mr. Fact (Realist):",
    poll_title: "👥 Citizen Jury Poll",
    poll_agree: "👍 Totally Agree",
    poll_disagree: "👎 Strongly Disagree",
    poll_voted_agree: "👍 Agreed (Voted)",
    poll_voted_disagree: "👎 Disagreed (Voted)",
    card_style_label: "🎨 SNS Card Visual Theme:",
    save_square: "🖼️ Save 1:1 Feed Card",
    save_story: "📱 Save 9:16 Story",
    copy_link: "🔗 Copy Verdict Link",
    copied_link: "Link Copied! 🎉",
    share_x: "𝕏 Post",
    share_threads: "🧵 Threads",
    copy_text: "📋 Copy Text",
    copied_text: "Verdict Copied! 📋",
    native_share: "📱 System Share",
    reset_btn: "🔄 Judge Another Dilemma",
    recent_history: "Recent Verdicts",
    view_all_history: "View All (Archive) →",
    history_modal_title: "🗂️ My Verdict Archive",
    history_modal_subtitle: "Locally and privately preserved in your browser",
    clear_all_btn: "🗑️ Clear All History",
    no_history: "No saved verdicts found.",
    archive_btn: "🗂️ Archive",
    cat_all: "🔥 All",
    cat_shopping: "🛍️ Shopping",
    cat_career: "💼 Career",
    cat_love: "💌 Love",
    cat_daily: "🍜 Daily"
  }
};

export const GLOBAL_PRESETS = {
  ko: {
    all: [
      { label: "🍜 새벽 라면 먹을까", prompt: "새벽 2시인데 컵라면 물 올릴까?", category: "daily" },
      { label: "💼 이직 준비할까", prompt: "이직 준비 지금 당장 시작할까?", category: "career" },
      { label: "🎧 에어팟 맥스 살까", prompt: "에어팟 맥스 지금 살까 말까?", category: "shopping" },
      { label: "💬 그 사람 연락할까", prompt: "새벽에 전 연인한테 카톡 보내볼까?", category: "love" }
    ],
    shopping: [
      { label: "🎧 에어팟 맥스", prompt: "에어팟 맥스 70만원 주고 지금 살까?", category: "shopping" },
      { label: "👟 한정판 스니커즈", prompt: "한정판 스니커즈 리셀가로 살까?", category: "shopping" },
      { label: "💻 M3 맥북 프로", prompt: "할부로 M3 맥북 프로 지를까 말까?", category: "shopping" }
    ],
    career: [
      { label: "💼 이직 준비 시작", prompt: "이직 준비 지금 당장 시작할까?", category: "career" },
      { label: "🚪 충동 퇴사할까", prompt: "회사 때려치우고 1인 창업 해볼까?", category: "career" },
      { label: "📈 연봉 협상 지르기", prompt: "연봉 협상에서 15% 올려달라고 말할까?", category: "career" }
    ],
    love: [
      { label: "💬 새벽 카톡 보내기", prompt: "새벽에 전 연인한테 '자니?' 카톡할까?", category: "love" },
      { label: "💌 짝사랑 고백", prompt: "짝사랑 중인데 오늘 바로 고백해볼까?", category: "love" },
      { label: "🚫 손절 타이밍", prompt: "기운 빠지게 만드는 지인, 이제 손절할까?", category: "love" }
    ],
    daily: [
      { label: "🍜 새벽 라면 먹기", prompt: "새벽 2시인데 컵라면 물 올릴까?", category: "daily" },
      { label: "🏋️ 퇴근길 헬스장", prompt: "피곤한데 오늘 헬스장 가서 쇠질할까?", category: "daily" },
      { label: "🛌 유튜브 끄고 취침", prompt: "쇼츠 그만 보고 지금 바로 잘까?", category: "daily" }
    ]
  },
  en: {
    all: [
      { label: "🍕 Midnight Pizza?", prompt: "It's 1 AM, should I order a pepperoni pizza?", category: "daily" },
      { label: "💼 Quit My Job?", prompt: "Should I quit my 9-to-5 job to build a startup?", category: "career" },
      { label: "🎧 AirPods Max?", prompt: "Should I spend $550 on AirPods Max right now?", category: "shopping" },
      { label: "💬 Text My Ex?", prompt: "Should I send a midnight 'I miss you' text to my ex?", category: "love" }
    ],
    shopping: [
      { label: "🎧 AirPods Max", prompt: "Should I spend $550 on AirPods Max right now?", category: "shopping" },
      { label: "👟 Limited Sneakers", prompt: "Buy limited edition Dunks at $300 resell price?", category: "shopping" },
      { label: "💻 M3 MacBook Pro", prompt: "Finance a brand new M3 Max MacBook Pro?", category: "shopping" }
    ],
    career: [
      { label: "💼 Start Job Hunt", prompt: "Update my resume and start job hunting right now?", category: "career" },
      { label: "🚪 Quit for Startup", prompt: "Should I quit my 9-to-5 job to build a startup?", category: "career" },
      { label: "📈 Ask for 20% Raise", prompt: "Demand a 20% salary increase in tomorrow's 1-on-1?", category: "career" }
    ],
    love: [
      { label: "💬 Text My Ex", prompt: "Should I send a midnight 'I miss you' text to my ex?", category: "love" },
      { label: "💌 Confess My Crush", prompt: "Tell my best friend that I've fallen in love with them?", category: "love" },
      { label: "🚫 Block Toxic Friend", prompt: "Cut ties and block a toxic friend who drains my energy?", category: "love" }
    ],
    daily: [
      { label: "🍕 Midnight Pizza", prompt: "It's 1 AM, should I order a pepperoni pizza?", category: "daily" },
      { label: "🏋️ Hit the Gym", prompt: "Exhausted from work, should I still go hit heavy weights?", category: "daily" },
      { label: "🛌 Put Phone Down", prompt: "Stop doomscrolling TikTok and go to sleep right now?", category: "daily" }
    ]
  }
};

class I18nEngine {
  constructor() {
    this.currentLang = "ko";
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("oneword_lang");
      if (saved && (saved === "ko" || saved === "en")) {
        this.currentLang = saved;
      }
    }
  }

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(lang) {
    if (lang === "ko" || lang === "en") {
      this.currentLang = lang;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("oneword_lang", lang);
      }
    }
  }

  t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.ko;
    return dict[key] || key;
  }

  getPresets(category = "all") {
    const presets = GLOBAL_PRESETS[this.currentLang] || GLOBAL_PRESETS.ko;
    return presets[category] || presets.all;
  }
}

export const i18n = new I18nEngine();
