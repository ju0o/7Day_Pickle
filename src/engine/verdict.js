/**
 * OneWord: 3초 의사결정 판결 알고리즘 (Verdict Engine)
 */

import { JUDGES } from "./personas.js";

export class VerdictEngine {
  constructor() {
    this.categories = {
      shopping: ["살까", "구매", "지름", "결제", "세일", "신발", "옷", "아이폰", "맥북", "키보드", "얼마", "할인"],
      career: ["이직", "퇴사", "회사", "공부", "코딩", "면접", "연봉", "프로젝트", "취업", "지원", "포폴"],
      love: ["고백", "연락", "카톡", "차단", "짝사랑", "전남친", "전여친", "손절", "소개팅", "만날까"],
      daily: ["먹을까", "야식", "라면", "치킨", "운동", "헬스", "잘까", "게임", "미룰까", "출근", "청소"]
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
    return "daily"; // 기본값
  }

  evaluate(question) {
    const category = this.detectCategory(question);
    const q = question.toLowerCase();

    let word = "NOW";
    let wordKr = "지금 당장";
    let punchline = "고민의 유통기한은 끝났다. 즉각 실행하라.";

    // 카테고리 및 질문 뉘앙스 분석
    if (category === "shopping") {
      if (q.includes("비싸") || q.includes("돈") || q.includes("참을까")) {
        word = "DROP";
        wordKr = "포기해라";
        punchline = "통장은 이미 답을 알고 있다. 충동을 내려놓아라.";
      } else {
        word = "BUY";
        wordKr = "질러라";
        punchline = "망설이는 시간조차 기회비용이다. 결제하고 잊어라.";
      }
    } else if (category === "career") {
      if (q.includes("퇴사") || q.includes("이직") || q.includes("런")) {
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
      if (q.includes("자야") || q.includes("피곤") || q.includes("새벽")) {
        word = "SLEEP";
        wordKr = "잠이나 자라";
        punchline = "새벽의 감상은 전부 허상이다. 침대로 기어들어가라.";
      } else if (q.includes("먹을까") || q.includes("라면") || q.includes("야식")) {
        word = "PASS";
        wordKr = "참아라";
        punchline = "30분의 쾌락 뒤에 12시간의 소화 불량과 자책이 기다린다.";
      } else if (q.includes("운동") || q.includes("시작")) {
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
      confidence: Math.floor(Math.random() * 10) + 90, // 90~99%
      opinions: opinions,
      decided_at: new Date().toISOString()
    };
  }
}
