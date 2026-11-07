/**
 * OneWord: 3초 의사결정 판결 알고리즘 & 카테고리 프리셋 (v0.4)
 */

import { JUDGES } from "./personas.js";

export const CATEGORY_PRESETS = {
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
};

export class VerdictEngine {
  constructor() {
    this.categories = {
      shopping: ["살까", "구매", "지름", "결제", "세일", "신발", "옷", "아이폰", "맥북", "키보드", "얼마", "할인", "리셀"],
      career: ["이직", "퇴사", "회사", "공부", "코딩", "면접", "연봉", "프로젝트", "취업", "지원", "포폴", "창업", "협상"],
      love: ["고백", "연락", "카톡", "차단", "짝사랑", "전남친", "전여친", "손절", "소개팅", "만날까", "인연"],
      daily: ["먹을까", "야식", "라면", "치킨", "운동", "헬스", "잘까", "게임", "미룰까", "출근", "청소", "취침", "쇼츠"]
    };
  }

  detectCategory(question) {
    const q = question.toLowerCase();
    for (const [cat, keywords] of Object.entries(this.categories)) {
      for (const kw of keywords) {
        if (q.includes(kw)) {
          return cat;
        }
      }
    }
    return "daily";
  }

  evaluate(question) {
    const category = this.detectCategory(question);
    const q = question.toLowerCase();

    let word = "NOW";
    let wordKr = "지금 당장";
    let punchline = "고민의 유통기한은 끝났다. 즉각 실행하라.";

    if (category === "shopping") {
      if (q.includes("비싸") || q.includes("돈") || q.includes("참을까") || q.includes("할부")) {
        word = "DROP";
        wordKr = "포기해라";
        punchline = "통장은 이미 답을 알고 있다. 충동을 내려놓아라.";
      } else {
        word = "BUY";
        wordKr = "질러라";
        punchline = "망설이는 시간조차 기회비용이다. 결제하고 잊어라.";
      }
    } else if (category === "career") {
      if (q.includes("퇴사") || q.includes("때려") || q.includes("런")) {
        word = "RUN";
        wordKr = "탈출해라";
        punchline = "죽은 조직에 영혼을 갈아넣지 마라. 네 무대를 찾아 떠나라.";
      } else {
        word = "STAY";
        wordKr = "버텨라";
        punchline = "아직 증명할 것이 남았다. 실력을 쌓아 판을 뒤집어라.";
      }
    } else if (category === "love") {
      if (q.includes("손절") || q.includes("차단") || q.includes("끝낼까")) {
        word = "BLOCK";
        wordKr = "끊어내라";
        punchline = "미련은 쓰레기통에 버려라. 새 인연을 맞이할 자리를 비워라.";
      } else {
        word = "SPEAK";
        wordKr = "말해라";
        punchline = "마음속에 묻어두면 썩는다. 거절당해도 진심을 던져라.";
      }
    } else {
      if (q.includes("자야") || q.includes("피곤") || q.includes("새벽") || q.includes("잘까") || q.includes("취침")) {
        word = "SLEEP";
        wordKr = "잠이나 자라";
        punchline = "새벽의 감상은 전부 허상이다. 침대로 기어들어가라.";
      } else if (q.includes("먹을까") || q.includes("라면") || q.includes("야식") || q.includes("치킨")) {
        word = "PASS";
        wordKr = "참아라";
        punchline = "30분의 쾌락 뒤에 12시간의 소화 불량과 자책이 기다린다.";
      } else if (q.includes("운동") || q.includes("헬스") || q.includes("시작")) {
        word = "START";
        wordKr = "움직여라";
        punchline = "생각을 멈추고 몸을 던져라. 첫 5분이 모든 것을 바꾼다.";
      }
    }

    const opinions = {
      reason: JUDGES.reason.evaluate(question, category),
      instinct: JUDGES.instinct.evaluate(question, category),
      realist: JUDGES.realist.evaluate(question, category)
    };

    const hashId = "v_" + Date.now().toString(36);

    return {
      id: hashId,
      question: question.trim(),
      category: category,
      verdict_word: word,
      verdict_kr: wordKr,
      punchline: punchline,
      confidence: Math.floor(Math.random() * 10) + 90,
      opinions: opinions,
      decided_at: new Date().toISOString()
    };
  }
}
