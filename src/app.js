/**
 * OneWord: Main Application Controller (v0.4 - Category Filter & History Modal)
 */

import { VerdictEngine, CATEGORY_PRESETS } from "./engine/verdict.js";
import { StorageManager } from "./storage/history.js";
import { sound } from "./audio/sound.js";
import { CardGenerator } from "./canvas/cardGenerator.js";

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
  const presetsList = document.getElementById("presetsList");
  const categoryTabs = document.querySelectorAll(".cat-tab");

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
  const downloadSquareBtn = document.getElementById("downloadSquareBtn");
  const downloadStoryBtn = document.getElementById("downloadStoryBtn");

  const historyList = document.getElementById("historyList");
  const historySection = document.getElementById("historySection");
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const historyCountBadge = document.getElementById("historyCountBadge");

  // 모달 엘리먼트
  const historyModal = document.getElementById("historyModal");
  const openHistoryModalBtn = document.getElementById("openHistoryModalBtn");
  const closeHistoryModalBtn = document.getElementById("closeHistoryModalBtn");
  const viewAllHistoryBtn = document.getElementById("viewAllHistoryBtn");
  const modalHistoryList = document.getElementById("modalHistoryList");
  const clearAllHistoryBtn = document.getElementById("clearAllHistoryBtn");
  const modalCatFilters = document.querySelectorAll(".modal-cat-filter");

  let currentCategory = "all";
  let modalFilterCat = "all";

  // 오디오 초기화
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

  // 초기 렌더링
  renderPresets("all");
  renderHistory();
  checkUrlHash();

  // 카테고리 탭 스위칭
  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      sound.playClick();
      const cat = tab.dataset.category;
      currentCategory = cat;

      categoryTabs.forEach(t => {
        t.className = "cat-tab px-3.5 py-1.5 rounded-xl text-xs font-medium transition border border-gray-800 bg-gray-900/60 text-gray-400 hover:text-gray-200 cursor-pointer";
      });
      tab.className = "cat-tab px-3.5 py-1.5 rounded-xl text-xs font-bold transition border border-cyan-500 bg-cyan-950/80 text-cyan-300 shadow-sm cursor-pointer";

      renderPresets(cat);
    });
  });

  function renderPresets(cat) {
    const list = CATEGORY_PRESETS[cat] || CATEGORY_PRESETS.all;
    presetsList.innerHTML = "";

    list.forEach(p => {
      const btn = document.createElement("button");
      btn.className = "preset-btn text-xs bg-gray-950 hover:bg-gray-800 text-gray-300 border border-gray-800 px-3 py-1.5 rounded-lg transition cursor-pointer";
      btn.textContent = p.label;
      btn.addEventListener("click", () => {
        sound.init();
        sound.playClick();
        questionInput.value = p.prompt;
        questionInput.focus();
      });
      presetsList.appendChild(btn);
    });
  }

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

  // 1:1 피드 카드 다운로드
  if (downloadSquareBtn) {
    downloadSquareBtn.addEventListener("click", () => {
      sound.playClick();
      if (!window.currentVerdict) return;
      downloadSquareBtn.textContent = "생성 중...";
      setTimeout(() => {
        CardGenerator.downloadImage(window.currentVerdict, "square");
        downloadSquareBtn.textContent = "🖼️ 1:1 피드 카드 저장";
      }, 100);
    });
  }

  // 9:16 스토리 카드 다운로드
  if (downloadStoryBtn) {
    downloadStoryBtn.addEventListener("click", () => {
      sound.playClick();
      if (!window.currentVerdict) return;
      downloadStoryBtn.textContent = "생성 중...";
      setTimeout(() => {
        CardGenerator.downloadImage(window.currentVerdict, "story");
        downloadStoryBtn.textContent = "📱 9:16 스토리 저장";
      }, 100);
    });
  }

  // 모달 열기/닫기
  const openModal = () => {
    sound.playClick();
    historyModal.classList.remove("hidden");
    renderModalHistory(modalFilterCat);
  };
  const closeModal = () => {
    sound.playClick();
    historyModal.classList.add("hidden");
  };

  if (openHistoryModalBtn) openHistoryModalBtn.addEventListener("click", openModal);
  if (viewAllHistoryBtn) viewAllHistoryBtn.addEventListener("click", openModal);
  if (closeHistoryModalBtn) closeHistoryModalBtn.addEventListener("click", closeModal);
  historyModal.addEventListener("click", (e) => {
    if (e.target === historyModal) closeModal();
  });

  // 모달 카테고리 필터
  modalCatFilters.forEach(btn => {
    btn.addEventListener("click", () => {
      sound.playClick();
      modalCatFilters.forEach(b => {
        b.className = "modal-cat-filter px-2.5 py-1 rounded-lg bg-gray-950 text-gray-400 border border-gray-800 cursor-pointer";
      });
      btn.className = "modal-cat-filter px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 font-bold border border-cyan-800 cursor-pointer";
      modalFilterCat = btn.dataset.cat;
      renderModalHistory(modalFilterCat);
    });
  });

  // 전체 기록 비우기
  if (clearAllHistoryBtn) {
    clearAllHistoryBtn.addEventListener("click", () => {
      if (confirm("정말로 모든 판결 기록을 삭제하시겠습니까?")) {
        StorageManager.clearHistory();
        renderHistory();
        renderModalHistory(modalFilterCat);
      }
    });
  }

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

    setTimeout(() => {
      sound.playJudgeCue(440);
      typeText(judgeReason, `"${verdict.opinions.reason}"`, 20, () => {
        setTimeout(() => {
          sound.playJudgeCue(580);
          typeText(judgeInstinct, `"${verdict.opinions.instinct}"`, 20, () => {
            setTimeout(() => {
              sound.playJudgeCue(720);
              typeText(judgeRealist, `"${verdict.opinions.realist}"`, 20, () => {
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

    document.body.classList.add("shake-screen");
    setTimeout(() => document.body.classList.remove("shake-screen"), 500);

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
    resultCard.className = `bg-gray-900 border-2 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden neon-glow ${theme.border}`;
    verdictWord.className = `text-6xl sm:text-7xl font-black tracking-tighter ${theme.text} neon-text`;
  }

  function renderHistory() {
    const history = StorageManager.getHistory();
    if (historyCountBadge) {
      if (history.length > 0) {
        historyCountBadge.textContent = history.length;
        historyCountBadge.classList.remove("hidden");
      } else {
        historyCountBadge.classList.add("hidden");
      }
    }

    if (history.length === 0) {
      historySection.classList.add("hidden");
      return;
    }

    historySection.classList.remove("hidden");
    historyList.innerHTML = "";

    history.slice(0, 4).forEach(item => {
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

  function renderModalHistory(cat = "all") {
    const list = StorageManager.getHistory(cat);
    modalHistoryList.innerHTML = "";

    if (list.length === 0) {
      modalHistoryList.innerHTML = `
        <div class="text-center py-10 text-gray-500 text-sm">
          보관된 판결이 없습니다.
        </div>
      `;
      return;
    }

    list.forEach(item => {
      const theme = THEMES[item.category] || THEMES.daily;
      const card = document.createElement("div");
      card.className = "p-3.5 bg-gray-950 border border-gray-800 rounded-xl space-y-2 hover:border-gray-700 transition";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs px-1.5 py-0.5 rounded ${theme.badge}">${item.category.toUpperCase()}</span>
          <span class="text-xs font-mono text-gray-500">${new Date(item.decided_at || Date.now()).toLocaleDateString("ko-KR")}</span>
        </div>
        <div class="text-sm text-white font-semibold truncate">Q. ${item.question}</div>
        <div class="flex items-baseline space-x-2">
          <span class="text-xl font-black ${theme.text}">${item.verdict_word}</span>
          <span class="text-xs font-bold text-gray-400">(${item.verdict_kr})</span>
        </div>
        <p class="text-xs text-gray-400 italic line-clamp-1">"${item.punchline}"</p>
        <div class="pt-2 border-t border-gray-900 flex items-center justify-between text-xs">
          <button class="reopen-verdict-btn text-cyan-400 hover:underline cursor-pointer">
            🔍 다시 열기
          </button>
          <div class="flex items-center space-x-2">
            <button class="save-img-btn text-gray-300 hover:text-white cursor-pointer">
              🖼️ 카드저장
            </button>
            <button class="del-verdict-btn text-red-400 hover:text-red-300 cursor-pointer">
              ✕ 삭제
            </button>
          </div>
        </div>
      `;

      card.querySelector(".reopen-verdict-btn").addEventListener("click", () => {
        closeModal();
        window.currentVerdict = item;
        inputSection.classList.add("hidden");
        revealVerdict(item);
      });

      card.querySelector(".save-img-btn").addEventListener("click", () => {
        CardGenerator.downloadImage(item, "square");
      });

      card.querySelector(".del-verdict-btn").addEventListener("click", () => {
        StorageManager.deleteVerdict(item.id);
        renderHistory();
        renderModalHistory(modalFilterCat);
      });

      modalHistoryList.appendChild(card);
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
