/**
 * OneWord: Main Application Controller
 */

import { VerdictEngine } from "./engine/verdict.js";
import { StorageManager } from "./storage/history.js";

const engine = new VerdictEngine();

document.addEventListener("DOMContentLoaded", () => {
  const questionInput = document.getElementById("questionInput");
  const submitBtn = document.getElementById("submitBtn");
  const inputSection = document.getElementById("inputSection");
  const judgingSection = document.getElementById("judgingSection");
  const resultSection = document.getElementById("resultSection");
  const presetBtns = document.querySelectorAll(".preset-btn");

  const judgeReason = document.getElementById("judgeReason");
  const judgeInstinct = document.getElementById("judgeInstinct");
  const judgeRealist = document.getElementById("judgeRealist");

  const verdictWord = document.getElementById("verdictWord");
  const verdictKr = document.getElementById("verdictKr");
  const verdictQuestion = document.getElementById("verdictQuestion");
  const punchline = document.getElementById("punchline");
  const shareBtn = document.getElementById("shareBtn");
  const resetBtn = document.getElementById("resetBtn");
  const historyList = document.getElementById("historyList");
  const historySection = document.getElementById("historySection");

  // 공유 링크로 접속한 경우 확인
  checkUrlHash();
  renderHistory();

  // 프리셋 클릭 이벤트
  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      questionInput.value = btn.dataset.prompt;
      questionInput.focus();
    });
  });

  // 제출 이벤트
  submitBtn.addEventListener("click", handleSubmit);
  questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });

  // 다시 판결받기
  resetBtn.addEventListener("click", () => {
    resultSection.classList.add("hidden");
    inputSection.classList.remove("hidden");
    questionInput.value = "";
    questionInput.focus();
    window.location.hash = "";
  });

  // 결과 공유 (클립보드 복사)
  shareBtn.addEventListener("click", () => {
    if (!window.currentVerdict) return;
    const hash = StorageManager.encodeState(window.currentVerdict);
    const shareUrl = `${window.location.origin}${window.location.pathname}#${hash}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      const originalText = shareBtn.textContent;
      shareBtn.textContent = "링크 복사 완료! 🎉";
      shareBtn.classList.add("bg-green-600");
      setTimeout(() => {
        shareBtn.textContent = originalText;
        shareBtn.classList.remove("bg-green-600");
      }, 2000);
    }).catch(() => {
      alert(`공유 링크: ${shareUrl}`);
    });
  });

  function handleSubmit() {
    const q = questionInput.value.trim();
    if (!q) {
      questionInput.focus();
      return;
    }

    // 1. 입력창 숨기고 심판 연출 시작
    inputSection.classList.add("hidden");
    judgingSection.classList.remove("hidden");

    // 2. 판결 연산
    const verdict = engine.evaluate(q);
    window.currentVerdict = verdict;
    StorageManager.saveVerdict(verdict);

    // 3. 3대 심판관 타이핑 연출 (각 0.8초 간격)
    judgeReason.textContent = "분석 중...";
    judgeInstinct.textContent = "대기 중...";
    judgeRealist.textContent = "대기 중...";

    setTimeout(() => {
      judgeReason.textContent = `"${verdict.opinions.reason}"`;
    }, 600);

    setTimeout(() => {
      judgeInstinct.textContent = `"${verdict.opinions.instinct}"`;
    }, 1300);

    setTimeout(() => {
      judgeRealist.textContent = `"${verdict.opinions.realist}"`;
    }, 2000);

    // 4. 최종 선고 (3초 후)
    setTimeout(() => {
      judgingSection.classList.add("hidden");
      resultSection.classList.remove("hidden");

      verdictWord.textContent = verdict.verdict_word;
      verdictKr.textContent = verdict.verdict_kr;
      verdictQuestion.textContent = `Q. ${verdict.question}`;
      punchline.textContent = `"${verdict.punchline}"`;

      renderHistory();
    }, 2800);
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
      const div = document.createElement("div");
      div.className = "flex items-center justify-between p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition";
      div.innerHTML = `
        <div class="truncate mr-3">
          <span class="text-xs text-gray-500">[${item.category.toUpperCase()}]</span>
          <span class="text-sm text-gray-300 font-medium ml-1">${item.question}</span>
        </div>
        <span class="px-2 py-1 bg-cyan-950 text-cyan-400 font-bold text-xs rounded border border-cyan-800 tracking-wider">
          ${item.verdict_word}
        </span>
      `;
      div.addEventListener("click", () => {
        window.currentVerdict = item;
        inputSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
        verdictWord.textContent = item.verdict_word;
        verdictKr.textContent = item.verdict_kr;
        verdictQuestion.textContent = `Q. ${item.question}`;
        punchline.textContent = `"${item.punchline}"`;
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
      resultSection.classList.remove("hidden");
      verdictWord.textContent = decoded.verdict_word;
      verdictKr.textContent = decoded.verdict_kr;
      verdictQuestion.textContent = `Q. ${decoded.question}`;
      punchline.textContent = `"${decoded.punchline}"`;
    }
  }
});
