/**
 * OneWord: Main Application Controller (v0.8.2 - Decision DNA & Analytics Dashboard)
 */

import { VerdictEngine } from "./engine/verdict.js";
import { StorageManager } from "./storage/history.js";
import { sound, SOUND_THEMES } from "./audio/sound.js";
import { CardGenerator, CARD_STYLES } from "./canvas/cardGenerator.js";
import { NeonParticleBurst } from "./fx/particles.js";
import { VoteSimulator } from "./engine/voting.js";
import { i18n, TRANSLATIONS } from "./i18n/translations.js";
import { IntentShare } from "./share/intentShare.js";
import { InstallPromptManager } from "./pwa/installPrompt.js";
import { StatsAnalyzer } from "./analytics/stats.js";
import { JudgeBiasTuner, BIAS_MODES } from "./engine/bias.js";
import { TagEngine, POPULAR_TAGS } from "./engine/tags.js";

const engine = new VerdictEngine();
const particleBurst = new NeonParticleBurst("fxCanvas");
const installManager = new InstallPromptManager();
const biasTuner = new JudgeBiasTuner();

const THEMES = {
  shopping: {
    border: "border-amber-500",
    text: "text-amber-400",
    glow: "shadow-amber-500/50",
    badge: "bg-amber-950 text-amber-400 border-amber-800",
    colorHex: "#ffb703"
  },
  career: {
    border: "border-cyan-500",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/50",
    badge: "bg-cyan-950 text-cyan-400 border-cyan-800",
    colorHex: "#00e5ff"
  },
  love: {
    border: "border-pink-500",
    text: "text-pink-400",
    glow: "shadow-pink-500/50",
    badge: "bg-pink-950 text-pink-400 border-pink-800",
    colorHex: "#ff007f"
  },
  daily: {
    border: "border-purple-500",
    text: "text-purple-400",
    glow: "shadow-purple-500/50",
    badge: "bg-purple-950 text-purple-400 border-purple-800",
    colorHex: "#a855f7"
  }
};

const CATEGORIES_ORDER = ["all", "shopping", "career", "love", "daily"];

document.addEventListener("DOMContentLoaded", () => {
  const questionInput = document.getElementById("questionInput");
  const submitBtn = document.getElementById("submitBtn");
  const inputSection = document.getElementById("inputSection");
  const judgingSection = document.getElementById("judgingSection");
  const resultSection = document.getElementById("resultSection");
  const resultCard = document.getElementById("resultCard");
  const presetsList = document.getElementById("presetsList");
  const categoryTabs = document.querySelectorAll(".cat-tab");
  const randomDiceBtn = document.getElementById("randomDiceBtn");

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

  // 바이럴 SNS 공유 버튼 엘리먼트
  const shareXBtn = document.getElementById("shareXBtn");
  const shareXText = document.getElementById("shareXText");
  const shareThreadsBtn = document.getElementById("shareThreadsBtn");
  const shareThreadsText = document.getElementById("shareThreadsText");
  const copyTextBtn = document.getElementById("copyTextBtn");
  const copyTextLabel = document.getElementById("copyTextLabel");

  const historyList = document.getElementById("historyList");
  const historySection = document.getElementById("historySection");
  const historyCountBadge = document.getElementById("historyCountBadge");

  // 다국어 i18n 엘리먼트
  const langToggleBtn = document.getElementById("langToggleBtn");
  const langCurrentBadge = document.getElementById("langCurrentBadge");

  // 시민 배심원 투표 엘리먼트
  const userVotedBadge = document.getElementById("userVotedBadge");
  const pollParticipantCount = document.getElementById("pollParticipantCount");
  const pollAgreeBtn = document.getElementById("pollAgreeBtn");
  const pollDisagreeBtn = document.getElementById("pollDisagreeBtn");
  const pollAgreeBar = document.getElementById("pollAgreeBar");
  const pollDisagreeBar = document.getElementById("pollDisagreeBar");
  const pollAgreeText = document.getElementById("pollAgreeText");
  const pollDisagreeText = document.getElementById("pollDisagreeText");
  const pollConsensusText = document.getElementById("pollConsensusText");

  // 카드 비주얼 테마 스타일러 엘리먼트
  const cardStyleBtns = document.querySelectorAll(".card-style-btn");
  const activeCardStyleLabel = document.getElementById("activeCardStyleLabel");
  let currentCardStyle = "cyber";

  // 사운드 테마 드롭다운 엘리먼트
  const soundThemeBtn = document.getElementById("soundThemeBtn");
  const soundThemeLabel = document.getElementById("soundThemeLabel");
  const soundThemeMenu = document.getElementById("soundThemeMenu");
  const soundThemeOpts = document.querySelectorAll(".sound-theme-opt");
  const soundMuteToggleBtn = document.getElementById("soundMuteToggleBtn");
  const soundMuteLabel = document.getElementById("soundMuteLabel");

  // 모달 엘리먼트
  const historyModal = document.getElementById("historyModal");
  const openHistoryModalBtn = document.getElementById("openHistoryModalBtn");
  const closeHistoryModalBtn = document.getElementById("closeHistoryModalBtn");
  const viewAllHistoryBtn = document.getElementById("viewAllHistoryBtn");
  const modalHistoryList = document.getElementById("modalHistoryList");
  const clearAllHistoryBtn = document.getElementById("clearAllHistoryBtn");
  const modalCatFilters = document.querySelectorAll(".modal-cat-filter");

  // 통계 모달 엘리먼트
  const statsModal = document.getElementById("statsModal");
  const openStatsModalBtn = document.getElementById("openStatsModalBtn");
  const closeStatsModalBtn = document.getElementById("closeStatsModalBtn");
  const closeStatsModalFooterBtn = document.getElementById("closeStatsModalFooterBtn");
  const statsModalBackdrop = document.getElementById("statsModalBackdrop");

  const kpiTotalVal = document.getElementById("kpiTotalVal");
  const kpiTopCatVal = document.getElementById("kpiTopCatVal");
  const kpiTopWordVal = document.getElementById("kpiTopWordVal");
  const personaTitle = document.getElementById("personaTitle");
  const personaDesc = document.getElementById("personaDesc");

  const statBarShopping = document.getElementById("statBarShopping");
  const statBarShoppingText = document.getElementById("statBarShoppingText");
  const statBarCareer = document.getElementById("statBarCareer");
  const statBarCareerText = document.getElementById("statBarCareerText");
  const statBarLove = document.getElementById("statBarLove");
  const statBarLoveText = document.getElementById("statBarLoveText");
  const statBarDaily = document.getElementById("statBarDaily");
  const statBarDailyText = document.getElementById("statBarDailyText");

  let currentCategory = "all";
  let modalFilterCat = "all";

  // AI 심판관 성향 튜너 엘리먼트
  const biasModal = document.getElementById("biasModal");
  const openBiasModalBtn = document.getElementById("openBiasModalBtn");
  const openBiasTunerBtn = document.getElementById("openBiasTunerBtn");
  const closeBiasModalBtn = document.getElementById("closeBiasModalBtn");
  const closeBiasModalFooterBtn = document.getElementById("closeBiasModalFooterBtn");
  const biasModalBackdrop = document.getElementById("biasModalBackdrop");
  const biasCards = document.querySelectorAll(".bias-card");
  const biasSlider = document.getElementById("biasSlider");
  const biasSliderValueText = document.getElementById("biasSliderValueText");
  const currentBiasBadge = document.getElementById("currentBiasBadge");
  const verdictBiasBadge = document.getElementById("verdictBiasBadge");
  const inlineBiasLabel = document.getElementById("inlineBiasLabel");
  const biasBtnLabel = document.getElementById("biasBtnLabel");
  const biasModalTitle = document.getElementById("biasModalTitle");
  const biasModalDesc = document.getElementById("biasModalDesc");
  const biasSliderHelpText = document.getElementById("biasSliderHelpText");
  const biasApplyBtnLabel = document.getElementById("biasApplyBtnLabel");

  // 태그 및 해시태그 엘리먼트
  const trendingTagsList = document.getElementById("trendingTagsList");
  const trendingTagsLabel = document.getElementById("trendingTagsLabel");
  const verdictTagsSection = document.getElementById("verdictTagsSection");
  const tagsHeading = document.getElementById("tagsHeading");
  const tagCopyHint = document.getElementById("tagCopyHint");
  const verdictTagsList = document.getElementById("verdictTagsList");

  // PWA A2HS 인스톨 매니저 및 서비스워커 초기화
  installManager.init();

  // 오디오 초기화
  const unlockAudio = () => {
    sound.init();
    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
  };
  document.addEventListener("click", unlockAudio);
  document.addEventListener("keydown", unlockAudio);

  // 다국어 UI 렌더링 함수
  function updateI18nUI() {
    const curLang = i18n.getLanguage();
    if (langCurrentBadge) {
      langCurrentBadge.textContent = curLang.toUpperCase();
      langCurrentBadge.classList.toggle("text-cyan-400", true);
    }

    // 텍스트 일괄 치환
    const map = [
      ["mainTitle", "title", true],
      ["mainSubtitle", "subtitle"],
      ["mobileSwipeHint", "swipe_hint"],
      ["inputLabel", "input_label"],
      ["randomDiceText", "random_btn"],
      ["submitBtnText", "submit_btn"],
      ["recommendPresetsLabel", "recommend_presets"],
      ["oneClickHint", "one_click_hint"],
      ["judgingTitle", "judging_title"],
      ["judgeReasonLabel", "judge_reason"],
      ["judgeInstinctLabel", "judge_instinct"],
      ["judgeRealistLabel", "judge_realist"],
      ["pollTitle", "poll_title"],
      ["pollAgreeBtnText", "poll_agree"],
      ["pollDisagreeBtnText", "poll_disagree"],
      ["cardStyleTitle", "card_style_label"],
      ["downloadSquareText", "save_square"],
      ["downloadStoryText", "save_story"],
      ["shareXText", "share_x"],
      ["shareThreadsText", "share_threads"],
      ["copyTextLabel", "copy_text"],
      ["shareBtnText", "copy_link"],
      ["resetBtnText", "reset_btn"],
      ["recentHistoryTitle", "recent_history"],
      ["viewAllHistoryBtn", "view_all_history"],
      ["modalTitle", "history_modal_title"],
      ["modalSubtitle", "history_modal_subtitle"],
      ["clearAllHistoryBtn", "clear_all_btn"],
      ["archiveBtnLabel", "archive_btn"]
    ];

    map.forEach(([id, key, isHtml]) => {
      const el = document.getElementById(id);
      if (el) {
        if (isHtml) {
          el.innerHTML = i18n.t(key);
        } else {
          el.textContent = i18n.t(key);
        }
      }
    });

    // 카테고리 탭 텍스트
    categoryTabs.forEach(tab => {
      const cat = tab.dataset.category;
      tab.textContent = i18n.t(`cat_${cat}`);
    });

    if (questionInput) {
      questionInput.placeholder = i18n.t("input_placeholder");
    }

    renderPresets(currentCategory);
    if (window.currentVerdict) {
      renderPoll(window.currentVerdict);
    }

    // PWA 인스톨 UI 다국어 번역 동기화
    installManager.setLanguage(curLang, TRANSLATIONS);

    // 통계 모달 텍스트 번역
    const statsBtnLabel = document.getElementById("statsBtnLabel");
    if (statsBtnLabel) statsBtnLabel.textContent = i18n.t("stats_btn");
    const statsModalTitle = document.getElementById("statsModalTitle");
    if (statsModalTitle) statsModalTitle.innerHTML = `<span>${i18n.t("stats_modal_title")}</span>`;
    const statsModalSubtitle = document.getElementById("statsModalSubtitle");
    if (statsModalSubtitle) statsModalSubtitle.textContent = i18n.t("stats_modal_subtitle");
    const kpiTotalLabel = document.getElementById("kpiTotalLabel");
    if (kpiTotalLabel) kpiTotalLabel.textContent = i18n.t("stats_total_label");
    const kpiTopCatLabel = document.getElementById("kpiTopCatLabel");
    if (kpiTopCatLabel) kpiTopCatLabel.textContent = i18n.t("stats_top_cat_label");
    const kpiTopWordLabel = document.getElementById("kpiTopWordLabel");
    if (kpiTopWordLabel) kpiTopWordLabel.textContent = i18n.t("stats_top_word_label");
    const personaHeading = document.getElementById("personaHeading");
    if (personaHeading) personaHeading.textContent = i18n.t("stats_persona_heading");
    const breakdownHeading = document.getElementById("breakdownHeading");
    if (breakdownHeading) breakdownHeading.innerHTML = `<span>${i18n.t("stats_category_breakdown")}</span>`;

    if (statsModal && !statsModal.classList.contains("hidden")) {
      renderStats();
    }

    // AI 심판관 성향 튜너 다국어 번역 동기화
    if (biasBtnLabel) biasBtnLabel.textContent = i18n.t("bias_btn");
    if (inlineBiasLabel) inlineBiasLabel.textContent = i18n.t("bias_badge_label");
    if (biasModalTitle) biasModalTitle.innerHTML = `<span>${i18n.t("bias_modal_title")}</span>`;
    if (biasModalDesc) biasModalDesc.textContent = i18n.t("bias_modal_desc");
    if (biasSliderHelpText) biasSliderHelpText.textContent = i18n.t("bias_slider_help");
    if (biasApplyBtnLabel) biasApplyBtnLabel.textContent = i18n.t("bias_apply_btn");

    const biasBalancedName = document.getElementById("biasBalancedName");
    if (biasBalancedName) biasBalancedName.textContent = i18n.t("bias_balanced_name");
    const biasBalancedDesc = document.getElementById("biasBalancedDesc");
    if (biasBalancedDesc) biasBalancedDesc.textContent = i18n.t("bias_balanced_desc");

    const biasRationalName = document.getElementById("biasRationalName");
    if (biasRationalName) biasRationalName.textContent = i18n.t("bias_rational_name");
    const biasRationalDesc = document.getElementById("biasRationalDesc");
    if (biasRationalDesc) biasRationalDesc.textContent = i18n.t("bias_rational_desc");

    const biasVibeName = document.getElementById("biasVibeName");
    if (biasVibeName) biasVibeName.textContent = i18n.t("bias_vibe_name");
    const biasVibeDesc = document.getElementById("biasVibeDesc");
    if (biasVibeDesc) biasVibeDesc.textContent = i18n.t("bias_vibe_desc");

    const biasRealistName = document.getElementById("biasRealistName");
    if (biasRealistName) biasRealistName.textContent = i18n.t("bias_realist_name");
    const biasRealistDesc = document.getElementById("biasRealistDesc");
    if (biasRealistDesc) biasRealistDesc.textContent = i18n.t("bias_realist_desc");

    // 태그 텍스트 동기화 및 렌더링
    if (trendingTagsLabel) trendingTagsLabel.textContent = i18n.t("trending_tags_label");
    if (tagsHeading) tagsHeading.textContent = i18n.t("tags_heading");
    if (tagCopyHint) tagCopyHint.textContent = i18n.t("click_to_copy_tags");
    renderTrendingTags();
    if (window.currentVerdict) {
      renderVerdictTags(window.currentVerdict);
    }

    updateBiasUI();
  }

  // 언어 토글 이벤트
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      sound.playClick();
      sound.triggerHaptic([20]);
      const nextLang = i18n.getLanguage() === "ko" ? "en" : "ko";
      i18n.setLanguage(nextLang);
      updateI18nUI();
    });
  }

  // 사운드 테마 버튼 라벨 업데이트 함수
  function updateSoundThemeUI() {
    const activeTheme = sound.getTheme();
    const info = SOUND_THEMES[activeTheme] || SOUND_THEMES.court;

    if (sound.isMuted) {
      soundThemeLabel.textContent = "🔇 MUTE";
      soundThemeBtn.classList.remove("text-cyan-400");
      soundThemeBtn.classList.add("text-gray-500");
      if (soundMuteLabel) soundMuteLabel.textContent = "🔊 Unmute";
    } else {
      soundThemeLabel.textContent = `${info.label.split(" ")[0]} ${activeTheme.toUpperCase()}`;
      soundThemeBtn.classList.remove("text-gray-500");
      soundThemeBtn.classList.add("text-cyan-400");
      if (soundMuteLabel) soundMuteLabel.textContent = "🔇 Mute";
    }

    soundThemeOpts.forEach(opt => {
      const isSelected = opt.dataset.theme === activeTheme && !sound.isMuted;
      opt.classList.toggle("text-cyan-300", isSelected);
      opt.classList.toggle("font-bold", isSelected);
      opt.classList.toggle("text-gray-300", !isSelected);
    });
  }

  // 사운드 테마 메뉴 토글
  if (soundThemeBtn) {
    soundThemeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sound.init();
      sound.playClick();
      soundThemeMenu.classList.toggle("hidden");
    });
  }

  document.addEventListener("click", (e) => {
    if (soundThemeMenu && !soundThemeMenu.contains(e.target) && e.target !== soundThemeBtn) {
      soundThemeMenu.classList.add("hidden");
    }
  });

  soundThemeOpts.forEach(opt => {
    opt.addEventListener("click", () => {
      const theme = opt.dataset.theme;
      sound.setTheme(theme);
      sound.isMuted = false;
      sound.init();
      sound.playClick();
      soundThemeMenu.classList.add("hidden");
      updateSoundThemeUI();
    });
  });

  if (soundMuteToggleBtn) {
    soundMuteToggleBtn.addEventListener("click", () => {
      sound.isMuted = !sound.isMuted;
      sound.playClick();
      soundThemeMenu.classList.add("hidden");
      updateSoundThemeUI();
    });
  }

  updateSoundThemeUI();

  // 카드 비주얼 스타일러 스위칭
  cardStyleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sound.playClick();
      sound.triggerHaptic([20]);
      const style = btn.dataset.style;
      currentCardStyle = style;

      cardStyleBtns.forEach(b => {
        b.className = "card-style-btn py-2 px-1 rounded-lg text-xs font-medium border border-gray-800 bg-gray-900/60 text-gray-400 hover:text-gray-200 transition cursor-pointer text-center";
      });
      btn.className = "card-style-btn py-2 px-1 rounded-lg text-xs font-bold border border-cyan-500 bg-cyan-950/80 text-cyan-300 transition cursor-pointer text-center";

      const info = CARD_STYLES[style] || CARD_STYLES.cyber;
      if (activeCardStyleLabel) {
        activeCardStyleLabel.textContent = `${info.label}`;
      }
    });
  });

  // 초기 렌더링
  updateI18nUI();
  renderHistory();
  checkUrlHash();

  // 카테고리 탭 스위칭 함수
  function switchCategory(cat) {
    currentCategory = cat;
    categoryTabs.forEach(t => {
      const isMatch = t.dataset.category === cat;
      if (isMatch) {
        t.className = "cat-tab px-3.5 py-1.5 rounded-xl text-xs font-bold transition border border-cyan-500 bg-cyan-950/80 text-cyan-300 shadow-sm cursor-pointer";
      } else {
        t.className = "cat-tab px-3.5 py-1.5 rounded-xl text-xs font-medium transition border border-gray-800 bg-gray-900/60 text-gray-400 hover:text-gray-200 cursor-pointer";
      }
    });
    renderPresets(cat);
  }

  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      sound.playClick();
      sound.triggerHaptic([25]);
      switchCategory(tab.dataset.category);
    });
  });

  function renderPresets(cat) {
    const list = i18n.getPresets(cat);
    presetsList.innerHTML = "";

    list.forEach(p => {
      const btn = document.createElement("button");
      btn.className = "preset-btn text-xs bg-gray-950 hover:bg-gray-800 text-gray-300 border border-gray-800 px-3 py-1.5 rounded-lg transition cursor-pointer";
      btn.textContent = p.label;
      btn.addEventListener("click", () => {
        sound.init();
        sound.playClick();
        sound.triggerHaptic([30]);
        questionInput.value = p.prompt;
        questionInput.focus();
      });
      presetsList.appendChild(btn);
    });
  }

  // 🎲 랜덤 고민 셔플러
  if (randomDiceBtn) {
    randomDiceBtn.addEventListener("click", () => {
      sound.init();
      sound.playClick();
      sound.triggerHaptic([40]);

      const allPresets = i18n.getPresets("all");
      const pick = allPresets[Math.floor(Math.random() * allPresets.length)];

      typeText(questionInput, pick.prompt, 18, () => {
        questionInput.focus();
      });
    });
  }

  // 모바일 터치 스와이프 제스처 리스너
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;

    if (Math.abs(diffX) > 60 && Math.abs(diffY) < 45) {
      const curIdx = CATEGORIES_ORDER.indexOf(currentCategory);
      if (diffX < 0) {
        const nextIdx = (curIdx + 1) % CATEGORIES_ORDER.length;
        switchCategory(CATEGORIES_ORDER[nextIdx]);
        sound.playClick();
        sound.triggerHaptic([20]);
      } else {
        const prevIdx = (curIdx - 1 + CATEGORIES_ORDER.length) % CATEGORIES_ORDER.length;
        switchCategory(CATEGORIES_ORDER[prevIdx]);
        sound.playClick();
        sound.triggerHaptic([20]);
      }
    }
  }, { passive: true });

  // 시민 배심원 투표 렌더러
  function renderPoll(verdict) {
    const poll = VoteSimulator.getPollData(verdict);
    if (!poll) return;

    verdict.poll = poll;

    if (pollParticipantCount) {
      const unit = i18n.getLanguage() === "en" ? "voters" : "명 참여";
      pollParticipantCount.textContent = `${poll.totalVotes.toLocaleString()} ${unit}`;
    }

    if (pollAgreeBar && pollDisagreeBar) {
      pollAgreeBar.style.width = `${poll.agreePercent}%`;
      pollDisagreeBar.style.width = `${poll.disagreePercent}%`;
    }

    if (pollAgreeText && pollDisagreeText) {
      const agreeWord = i18n.getLanguage() === "en" ? "Agree" : "인정";
      const disagreeWord = i18n.getLanguage() === "en" ? "Disagree" : "반대";
      pollAgreeText.textContent = `${agreeWord} ${poll.agreePercent}% (${poll.agreeVotes.toLocaleString()})`;
      pollDisagreeText.textContent = `${disagreeWord} ${poll.disagreePercent}% (${poll.disagreeVotes.toLocaleString()})`;
    }

    if (pollConsensusText) {
      pollConsensusText.textContent = `"${poll.consensusText}"`;
    }

    if (userVotedBadge) {
      if (poll.userVote) {
        userVotedBadge.classList.remove("hidden");
        userVotedBadge.textContent = poll.userVote === "agree" 
          ? i18n.t("poll_voted_agree") 
          : i18n.t("poll_voted_disagree");
      } else {
        userVotedBadge.classList.add("hidden");
      }
    }

    if (pollAgreeBtn && pollDisagreeBtn) {
      pollAgreeBtn.classList.toggle("ring-2", poll.userVote === "agree");
      pollAgreeBtn.classList.toggle("ring-emerald-400", poll.userVote === "agree");
      pollDisagreeBtn.classList.toggle("ring-2", poll.userVote === "disagree");
      pollDisagreeBtn.classList.toggle("ring-rose-400", poll.userVote === "disagree");
    }
  }

  if (pollAgreeBtn) {
    pollAgreeBtn.addEventListener("click", () => {
      sound.playClick();
      sound.triggerHaptic([30, 60]);
      if (!window.currentVerdict) return;
      VoteSimulator.castVote(window.currentVerdict, "agree");
      renderPoll(window.currentVerdict);
    });
  }

  if (pollDisagreeBtn) {
    pollDisagreeBtn.addEventListener("click", () => {
      sound.playClick();
      sound.triggerHaptic([30, 60]);
      if (!window.currentVerdict) return;
      VoteSimulator.castVote(window.currentVerdict, "disagree");
      renderPoll(window.currentVerdict);
    });
  }

  // 𝕏 (트위터) 공유
  if (shareXBtn) {
    shareXBtn.addEventListener("click", () => {
      sound.playClick();
      sound.triggerHaptic([30]);
      if (!window.currentVerdict) return;
      IntentShare.shareToX(window.currentVerdict, i18n.getLanguage());
    });
  }

  // 🧵 스레드 공유
  if (shareThreadsBtn) {
    shareThreadsBtn.addEventListener("click", () => {
      sound.playClick();
      sound.triggerHaptic([30]);
      if (!window.currentVerdict) return;
      IntentShare.shareToThreads(window.currentVerdict, i18n.getLanguage());
    });
  }

  // 📋 판결문 텍스트 클립보드 복사
  if (copyTextBtn) {
    copyTextBtn.addEventListener("click", async () => {
      sound.playClick();
      sound.triggerHaptic([40]);
      if (!window.currentVerdict) return;
      const ok = await IntentShare.copyFormattedText(window.currentVerdict, i18n.getLanguage());
      if (ok) {
        const origText = copyTextLabel.textContent;
        copyTextLabel.textContent = i18n.t("copied_text");
        copyTextBtn.classList.add("text-emerald-400", "border-emerald-600");
        setTimeout(() => {
          copyTextLabel.textContent = origText;
          copyTextBtn.classList.remove("text-emerald-400", "border-emerald-600");
        }, 2200);
      }
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
    const shareUrl = IntentShare.getShareUrl(window.currentVerdict);

    navigator.clipboard.writeText(shareUrl).then(() => {
      const originalText = shareBtn.innerHTML;
      shareBtn.innerHTML = `<span>${i18n.t("copied_link")}</span>`;
      shareBtn.classList.add("bg-green-600");
      setTimeout(() => {
        shareBtn.innerHTML = originalText;
        shareBtn.classList.remove("bg-green-600");
      }, 2000);
    }).catch(() => {
      alert(`Share Link: ${shareUrl}`);
    });
  });

  // 1:1 피드 카드 다운로드
  if (downloadSquareBtn) {
    downloadSquareBtn.addEventListener("click", () => {
      sound.playClick();
      if (!window.currentVerdict) return;
      downloadSquareBtn.textContent = i18n.getLanguage() === "en" ? "Generating..." : "생성 중...";
      setTimeout(() => {
        CardGenerator.downloadImage(window.currentVerdict, "square", currentCardStyle);
        downloadSquareBtn.innerHTML = `<span id="downloadSquareText">${i18n.t("save_square")}</span>`;
      }, 100);
    });
  }

  // 9:16 스토리 카드 다운로드
  if (downloadStoryBtn) {
    downloadStoryBtn.addEventListener("click", () => {
      sound.playClick();
      if (!window.currentVerdict) return;
      downloadStoryBtn.textContent = i18n.getLanguage() === "en" ? "Generating..." : "생성 중...";
      setTimeout(() => {
        CardGenerator.downloadImage(window.currentVerdict, "story", currentCardStyle);
        downloadStoryBtn.innerHTML = `<span id="downloadStoryText">${i18n.t("save_story")}</span>`;
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
      const confirmMsg = i18n.getLanguage() === "en" ? "Clear all verdict records?" : "정말로 모든 판결 기록을 삭제하시겠습니까?";
      if (confirm(confirmMsg)) {
        StorageManager.clearHistory();
        renderHistory();
        renderModalHistory(modalFilterCat);
        renderStats();
      }
    });
  }

  // 통계 모달 렌더링 및 이벤트
  function renderStats() {
    const history = StorageManager.getHistory();
    const curLang = i18n.getLanguage();
    const stats = StatsAnalyzer.analyze(history, curLang);

    if (kpiTotalVal) kpiTotalVal.textContent = stats.total;
    if (kpiTopCatVal) kpiTopCatVal.textContent = stats.topCategoryLabel;
    if (kpiTopWordVal) kpiTopWordVal.textContent = stats.topVerdictWord;

    if (personaTitle) personaTitle.innerHTML = `<span>${stats.persona.title}</span>`;
    if (personaDesc) personaDesc.textContent = stats.persona.desc;

    if (statBarShopping && statBarShoppingText) {
      statBarShopping.style.width = `${stats.categoryPercents.shopping}%`;
      statBarShoppingText.textContent = `${stats.categoryPercents.shopping}% (${stats.categoryCounts.shopping})`;
    }
    if (statBarCareer && statBarCareerText) {
      statBarCareer.style.width = `${stats.categoryPercents.career}%`;
      statBarCareerText.textContent = `${stats.categoryPercents.career}% (${stats.categoryCounts.career})`;
    }
    if (statBarLove && statBarLoveText) {
      statBarLove.style.width = `${stats.categoryPercents.love}%`;
      statBarLoveText.textContent = `${stats.categoryPercents.love}% (${stats.categoryCounts.love})`;
    }
    if (statBarDaily && statBarDailyText) {
      statBarDaily.style.width = `${stats.categoryPercents.daily}%`;
      statBarDailyText.textContent = `${stats.categoryPercents.daily}% (${stats.categoryCounts.daily})`;
    }
  }

  const openStatsModal = () => {
    sound.playClick();
    renderStats();
    if (statsModal) statsModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };
  const closeStatsModal = () => {
    sound.playClick();
    if (statsModal) statsModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  if (openStatsModalBtn) openStatsModalBtn.addEventListener("click", openStatsModal);
  if (closeStatsModalBtn) closeStatsModalBtn.addEventListener("click", closeStatsModal);
  if (closeStatsModalFooterBtn) closeStatsModalFooterBtn.addEventListener("click", closeStatsModal);
  if (statsModalBackdrop) statsModalBackdrop.addEventListener("click", closeStatsModal);

  // 성향 튜너 UI 업데이트 및 이벤트 바인딩
  function updateBiasUI() {
    const currentMode = biasTuner.getMode();
    const curLang = i18n.getLanguage();
    const info = biasTuner.getModeInfo();

    if (currentBiasBadge) {
      currentBiasBadge.textContent = curLang === "en" ? info.badgeEn : info.badgeKo;
    }

    biasCards.forEach(card => {
      const isSelected = card.dataset.bias === currentMode;
      const check = card.querySelector(".bias-check");
      const nameEl = card.querySelector(".bias-name");

      card.className = isSelected
        ? "bias-card p-3.5 rounded-xl border border-cyan-500 bg-cyan-950/40 cursor-pointer transition relative shadow-sm"
        : "bias-card p-3.5 rounded-xl border border-gray-800 bg-gray-950/60 hover:border-gray-700 cursor-pointer transition relative";

      if (check) check.classList.toggle("hidden", !isSelected);
      if (nameEl) {
        nameEl.className = isSelected
          ? "mt-2 font-bold text-sm text-cyan-300 bias-name"
          : "mt-2 font-bold text-sm text-gray-200 bias-name";
      }
    });

    if (biasSlider) {
      biasSlider.value = info.sliderVal || 50;
    }
    if (biasSliderValueText) {
      const name = curLang === "en" ? info.nameEn : info.nameKo;
      biasSliderValueText.textContent = `${info.icon} ${name} (${info.sliderVal}%)`;
    }
  }

  const openBiasModal = () => {
    sound.playClick();
    updateBiasUI();
    if (biasModal) biasModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };
  const closeBiasModal = () => {
    sound.playClick();
    if (biasModal) biasModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  if (openBiasModalBtn) openBiasModalBtn.addEventListener("click", openBiasModal);
  if (openBiasTunerBtn) openBiasTunerBtn.addEventListener("click", openBiasModal);
  if (closeBiasModalBtn) closeBiasModalBtn.addEventListener("click", closeBiasModal);
  if (closeBiasModalFooterBtn) closeBiasModalFooterBtn.addEventListener("click", closeBiasModal);
  if (biasModalBackdrop) biasModalBackdrop.addEventListener("click", closeBiasModal);

  biasCards.forEach(card => {
    card.addEventListener("click", () => {
      sound.playClick();
      sound.triggerHaptic([20]);
      const mode = card.dataset.bias;
      biasTuner.setMode(mode);
      updateBiasUI();
    });
  });

  if (biasSlider) {
    biasSlider.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      const mode = JudgeBiasTuner.fromSlider(val);
      biasTuner.setMode(mode);
      const curLang = i18n.getLanguage();
      const info = biasTuner.getModeInfo();
      if (biasSliderValueText) {
        const name = curLang === "en" ? info.nameEn : info.nameKo;
        biasSliderValueText.textContent = `${info.icon} ${name} (${val}%)`;
      }
      biasCards.forEach(card => {
        const isSelected = card.dataset.bias === mode;
        const check = card.querySelector(".bias-check");
        card.className = isSelected
          ? "bias-card p-3.5 rounded-xl border border-cyan-500 bg-cyan-950/40 cursor-pointer transition relative shadow-sm"
          : "bias-card p-3.5 rounded-xl border border-gray-800 bg-gray-950/60 hover:border-gray-700 cursor-pointer transition relative";
        if (check) check.classList.toggle("hidden", !isSelected);
      });
      if (currentBiasBadge) {
        currentBiasBadge.textContent = curLang === "en" ? info.badgeEn : info.badgeKo;
      }
    });
  }

  updateBiasUI();

  // 트렌딩 고민 태그 렌더링
  function renderTrendingTags() {
    if (!trendingTagsList) return;
    trendingTagsList.innerHTML = "";
    const curLang = i18n.getLanguage();
    const tags = POPULAR_TAGS[curLang] || POPULAR_TAGS.ko;

    tags.forEach(item => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-gray-950 border border-gray-800 text-gray-400 hover:text-cyan-300 hover:border-cyan-800 hover:bg-cyan-950/40 transition cursor-pointer flex items-center space-x-1";
      btn.innerHTML = `<span class="text-cyan-500 font-bold">#</span><span>${item.label.replace('#', '')}</span>`;
      btn.addEventListener("click", () => {
        sound.playClick();
        sound.triggerHaptic([20]);
        typeText(questionInput, item.prompt, 15);
      });
      trendingTagsList.appendChild(btn);
    });
  }

  // 판결 결과 해시태그 칩스 렌더링
  function renderVerdictTags(verdict) {
    if (!verdictTagsList) return;
    verdictTagsList.innerHTML = "";
    const curLang = i18n.getLanguage();
    const tags = (verdict.tags && verdict.tags.length) 
      ? verdict.tags 
      : TagEngine.generateTags(verdict, curLang);

    tags.forEach(tag => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-cyan-300 hover:border-cyan-500 hover:bg-cyan-950/60 transition cursor-pointer active:scale-95 flex items-center space-x-1";
      chip.textContent = tag;
      chip.title = i18n.t("click_to_copy_tags");

      chip.addEventListener("click", () => {
        sound.playClick();
        sound.triggerHaptic([30]);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(tag).then(() => {
            const orig = chip.textContent;
            chip.textContent = i18n.t("tag_copied_toast");
            chip.classList.add("border-emerald-500", "text-emerald-400");
            setTimeout(() => {
              chip.textContent = orig;
              chip.classList.remove("border-emerald-500", "text-emerald-400");
            }, 1800);
          });
        }
      });
      verdictTagsList.appendChild(chip);
    });
  }

  renderTrendingTags();

  function typeText(element, text, speed = 20, onComplete = null) {
    const isInput = element.tagName === "TEXTAREA" || element.tagName === "INPUT";
    if (isInput) {
      element.value = "";
    } else {
      element.textContent = "";
    }

    let idx = 0;
    const timer = setInterval(() => {
      if (idx < text.length) {
        if (isInput) {
          element.value += text.charAt(idx);
        } else {
          element.textContent += text.charAt(idx);
        }
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

    const verdict = engine.evaluate(q, i18n.getLanguage(), biasTuner.getMode());
    window.currentVerdict = verdict;
    StorageManager.saveVerdict(verdict);

    judgeReason.textContent = "";
    judgeInstinct.textContent = "";
    judgeRealist.textContent = "";

    setTimeout(() => {
      sound.playJudgeCue(440, 0);
      typeText(judgeReason, `"${verdict.opinions.reason}"`, 18, () => {
        setTimeout(() => {
          sound.playJudgeCue(580, 1);
          typeText(judgeInstinct, `"${verdict.opinions.instinct}"`, 18, () => {
            setTimeout(() => {
              sound.playJudgeCue(720, 2);
              typeText(judgeRealist, `"${verdict.opinions.realist}"`, 18, () => {
                setTimeout(() => {
                  revealVerdict(verdict);
                }, 400);
              });
            }, 180);
          });
        }, 180);
      });
    }, 200);
  }

  function revealVerdict(verdict) {
    sound.playGavelImpact();

    judgingSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    document.body.classList.add("shake-screen");
    setTimeout(() => document.body.classList.remove("shake-screen"), 450);

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

    if (verdictBiasBadge) {
      verdictBiasBadge.textContent = verdict.bias_badge || biasTuner.getBadgeText(i18n.getLanguage());
    }

    if (confidenceBadge) {
      const confWord = i18n.getLanguage() === "en" ? "Confidence:" : "판결 확신도:";
      confidenceBadge.textContent = `${confWord} ${verdict.confidence || 98}%`;
    }

    // 네온 파티클 폭죽 버스트 연출
    const rect = resultCard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.4;
    particleBurst.burst(centerX, centerY, theme.colorHex, 50);

    // 시민 배심원 투표 렌더링
    renderPoll(verdict);

    // 바이럴 해시태그 렌더링
    renderVerdictTags(verdict);

    renderHistory();
  }

  function applyTheme(theme, verdict) {
    if (!resultCard) return;
    resultCard.className = `bg-gray-900 border-2 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden neon-glow select-none ${theme.border}`;
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
          ${i18n.t("no_history")}
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
            🔍 ${i18n.getLanguage() === "en" ? "Reopen" : "다시 열기"}
          </button>
          <div class="flex items-center space-x-2">
            <button class="save-img-btn text-gray-300 hover:text-white cursor-pointer">
              🖼️ ${i18n.getLanguage() === "en" ? "Save Card" : "카드저장"}
            </button>
            <button class="del-verdict-btn text-red-400 hover:text-red-300 cursor-pointer">
              ✕ ${i18n.getLanguage() === "en" ? "Delete" : "삭제"}
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
        CardGenerator.downloadImage(item, "square", currentCardStyle);
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
