/**
 * OneWord: Main Application Controller (v0.2 - Audio & Animation Update)
 */

import { VerdictEngine } from "./engine/verdict.js";
import { StorageManager } from "./storage/history.js";
import { sound } from "./audio/sound.js";

const engine = new VerdictEngine();

const THEMES = {
  shopping: {
    border: "border-amber-500",
    text: "text-amber-400",
    glow: "shadow-amber-500/50",
    badge: "bg-amber-950 text-amber-400 border-amber-800"
  },
  career: {
    border: "border-cyan-500",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/50",
    badge: "bg-cyan-950 text-cyan-400 border-cyan-800"
  },
  love: {
    border: "border-pink-500",
    text: "text-pink-400",
    glow: "shadow-pink-500/50",
    badge: "bg-pink-950 text-pink-400 border-pink-800"
  },
  daily: {
    border: "border-purple-500",
    text: "text-purple-400",
    glow: "shadow-purple-500/50",
    badge: "bg-purple-950 text-purple-400 border-purple-800"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const questionInput = document.getElementById("questionInput");
  const submitBtn = document.getElementById("submitBtn");
  const inputSection = document.getElementById("inputSection");
  const judgingSection = document.getElementById("judgingSection");
  const resultSection = document.getElementById("resultSection");
  const resultCard = document.getElementById("resultCard");
  const presetBtns = document.querySelectorAll(".preset-btn");

  const judgeReason = document.getElementById("judgeReason");
  const judgeInstinct = document.getElementById("judgeInstinct");
  const judgeRealist = document.getElementById("judgeRealist");

  const verdictWord = document.getElementById("verdictWord");
  const verdictKr = document.getElementById("verdictKr");
  const verdictQuestion = document.getElementById("verdictQuestion");
  const punchline = document.getElementById("punchline");
  const categoryBadge = document.getElementById("categoryBadge");
  const confidenceBadge = document.getElementById("confidenceBadge");
  const shareBtn = document.getElementById("shareBtn");
  const resetBtn = document.getElementById("resetBtn");
  const historyList = document.getElementById("historyList");
  const historySection = document.getElementById("historySection");
  const soundToggleBtn = document.getElementById("soundToggleBtn");

  // 오디오 초기화 (첫 유저 제스처)
  const unlockAudio = () => {
    sound.init();
    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
  };
  document.addEventListener("click", unlockAudio);
  document.addEventListener("keydown", unlockAudio);

  // 사운드 토글
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      sound.isMuted = !sound.isMuted;
      soundToggleBtn.textContent = sound.isMuted ? "🔇 SOUND OFF" : "🔊 SOUND ON";
      soundToggleBtn.classList.toggle("text-gray-500", sound.isMuted);
      soundToggleBtn.classList.toggle("text-cyan-400", !sound.isMuted);
    });
  }

  // URL 해시 및 기록 확인
  checkUrlHash();
  renderHistory();

  // 프리셋 클릭
  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sound.init();
      sound.playClick();
      questionInput.value = btn.dataset.prompt;
      questionInput.focus();
    });
  });

  // 제출 이벤트
  submitBtn.addEventListener("click", () => {
    sound.init();
    handleSubmit();
  });
  questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sound.init();
      handleSubmit();
    }
  });

  // 다시 판결받기
  resetBtn.addEventListener("click", () => {
    sound.playClick();
    resultSection.classList.add("hidden");
    inputSection.classList.remove("hidden");
    questionInput.value = "";
    questionInput.focus();
    window.location.hash = "";
  });

  // 링크 복사
  shareBtn.addEventListener("click", () => {
    sound.playClick();
    if (!window.currentVerdict) return;
    const hash = StorageManager.encodeState(window.currentVerdict);
    const shareUrl = `${window.location.origin}${window.location.pathname}#${hash}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      const originalText = shareBtn.innerHTML;
      shareBtn.innerHTML = "<span>링크 복사 완료! 🎉</span>";
      shareBtn.classList.add("bg-green-600");
      setTimeout(() => {
        shareBtn.innerHTML = originalText;
        shareBtn.classList.remove("bg-green-600");
      }, 2000);
    }).catch(() => {
      alert(`공유 링크: ${shareUrl}`);
    });
  });

  function typeText(element, text, speed = 25, onComplete = null) {
    element.textContent = "";
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < text.length) {
        element.textContent += text.charAt(idx);
        if (idx % 3 === 0) sound.playClick();
        idx++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);
  }

  function handleSubmit() {
    const q = questionInput.value.trim();
    if (!q) {
      questionInput.focus();
      return;
    }

    inputSection.classList.add("hidden");
    judgingSection.classList.remove("hidden");

    const verdict = engine.evaluate(q);
    window.currentVerdict = verdict;
    StorageManager.saveVerdict(verdict);

    judgeReason.textContent = "";
    judgeInstinct.textContent = "";
    judgeRealist.textContent = "";

    // 1단계: 이성 심판관 발언 (0.2s)
    setTimeout(() => {
      sound.playJudgeCue(440);
      typeText(judgeReason, `"${verdict.opinions.reason}"`, 20, () => {
        // 2단계: 행동 심판관 발언 (이성 완료 후)
        setTimeout(() => {
          sound.playJudgeCue(580);
          typeText(judgeInstinct, `"${verdict.opinions.instinct}"`, 20, () => {
            // 3단계: 현실 심판관 발언 (행동 완료 후)
            setTimeout(() => {
              sound.playJudgeCue(720);
              typeText(judgeRealist, `"${verdict.opinions.realist}"`, 20, () => {
                // 4단계: 법봉 타격 & 최종 선고 (0.5s 후)
                setTimeout(() => {
                  revealVerdict(verdict);
                }, 500);
              });
            }, 200);
          });
        }, 200);
      });
    }, 200);
  }

  function revealVerdict(verdict) {
    sound.playGavelImpact();

    judgingSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    // 화면 셰이크 효과
    document.body.classList.add("shake-screen");
    setTimeout(() => document.body.classList.remove("shake-screen"), 500);

    // 테마 적용
    const theme = THEMES[verdict.category] || THEMES.daily;
    applyTheme(theme, verdict);

    verdictWord.textContent = verdict.verdict_word;
    verdictKr.textContent = verdict.verdict_kr;
    verdictQuestion.textContent = `Q. ${verdict.question}`;
    punchline.textContent = `"${verdict.punchline}"`;

    if (categoryBadge) {
      categoryBadge.textContent = verdict.category.toUpperCase();
      categoryBadge.className = `px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${theme.badge}`;
    }

    if (confidenceBadge) {
      confidenceBadge.textContent = `판결 확신도: ${verdict.confidence || 98}%`;
    }

    renderHistory();
  }

  function applyTheme(theme, verdict) {
    if (!resultCard) return;
    // 이전 테마 클래스 제거
    resultCard.className = `bg-gray-900 border-2 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden neon-glow ${theme.border}`;
    verdictWord.className = `text-6xl sm:text-7xl font-black tracking-tighter ${theme.text} neon-text`;
  }

  function renderHistory() {
    const history = StorageManager.getHistory();
    if (history.length === 0) {
      historySection.classList.add("hidden");
      return;
    }

    historySection.classList.remove("hidden");
    historyList.innerHTML = "";

    history.slice(0, 5).forEach(item => {
      const theme = THEMES[item.category] || THEMES.daily;
      const div = document.createElement("div");
      div.className = "flex items-center justify-between p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition cursor-pointer";
      div.innerHTML = `
        <div class="truncate mr-3">
          <span class="text-xs px-1.5 py-0.5 rounded ${theme.badge}">${item.category.toUpperCase()}</span>
          <span class="text-sm text-gray-300 font-medium ml-1.5">${item.question}</span>
        </div>
        <span class="px-2 py-1 font-bold text-xs rounded border tracking-wider ${theme.badge}">
          ${item.verdict_word}
        </span>
      `;
      div.addEventListener("click", () => {
        sound.playClick();
        window.currentVerdict = item;
        inputSection.classList.add("hidden");
        revealVerdict(item);
      });
      historyList.appendChild(div);
    });
  }

  function checkUrlHash() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const decoded = StorageManager.decodeState(hash);
    if (decoded) {
      window.currentVerdict = decoded;
      inputSection.classList.add("hidden");
      revealVerdict(decoded);
    }
  }
});
