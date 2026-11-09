/**
 * OneWord: 3초 의사결정 판결 알고리즘 & 카테고리 프리셋 (v0.6.4 - Bilingual 지원)
 */

import { JUDGES } from "./personas.js";
import { GLOBAL_PRESETS } from "../i18n/translations.js";

export const CATEGORY_PRESETS = GLOBAL_PRESETS.ko;

export class VerdictEngine {
  constructor() {
    this.categories = {
      shopping: [
        "살까", "구매", "지름", "결제", "세일", "신발", "옷", "아이폰", "맥북", "키보드", "얼마", "할인", "리셀",
        "buy", "purchase", "shopping", "iphone", "macbook", "expensive", "sale", "shoes", "price", "resell", "gadget", "afford"
      ],
      career: [
        "이직", "퇴사", "회사", "공부", "코딩", "면접", "연봉", "프로젝트", "취업", "지원", "포폴", "창업", "협상",
        "job", "quit", "resign", "career", "salary", "promotion", "startup", "interview", "resume", "boss", "work"
      ],
      love: [
        "고백", "연락", "카톡", "차단", "짝사랑", "전남친", "전여친", "손절", "소개팅", "만날까", "인연",
        "ex", "crush", "text", "message", "date", "confess", "breakup", "love", "friend", "relationship", "block"
      ],
      daily: [
        "먹을까", "야식", "라면", "치킨", "운동", "헬스", "잘까", "게임", "미룰까", "출근", "청소", "취침", "쇼츠",
        "eat", "pizza", "food", "sleep", "gym", "workout", "procrastinate", "youtube", "tiktok", "diet", "clean", "tired"
      ]
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

  evaluate(question, lang = "ko") {
    const category = this.detectCategory(question);
    const q = question.toLowerCase();

    // 언어 자동 감지 보완 (질문에 한글이 전혀 없고 영문 위주일 때 en 적용)
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(question);
    const activeLang = hasKorean ? lang : (lang === "en" ? "en" : "en");

    let word = "NOW";
    let wordKr = "지금 당장";
    let punchline = "고민의 유통기한은 끝났다. 즉각 실행하라.";

    if (activeLang === "en") {
      wordKr = "DO IT NOW";
      punchline = "The expiration date on your dilemma has passed. Act now.";
    }

    if (category === "shopping") {
      if (q.includes("비싸") || q.includes("돈") || q.includes("참을까") || q.includes("할부") || q.includes("expensive") || q.includes("afford") || q.includes("finance")) {
        word = "DROP";
        wordKr = activeLang === "en" ? "WALK AWAY" : "포기해라";
        punchline = activeLang === "en" 
          ? "Your bank account already knows the answer. Put the wallet down."
          : "통장은 이미 답을 알고 있다. 충동을 내려놓아라.";
      } else {
        word = "BUY";
        wordKr = activeLang === "en" ? "GET IT" : "질러라";
        punchline = activeLang === "en"
          ? "Overthinking is an opportunity cost. Swipe the card and move forward."
          : "망설이는 시간조차 기회비용이다. 결제하고 잊어라.";
      }
    } else if (category === "career") {
      if (q.includes("퇴사") || q.includes("때려") || q.includes("런") || q.includes("quit") || q.includes("resign")) {
        word = "RUN";
        wordKr = activeLang === "en" ? "ESCAPE" : "탈출해라";
        punchline = activeLang === "en"
          ? "Don't pour your soul into a sinking ship. Build your own stage."
          : "죽은 조직에 영혼을 갈아넣지 마라. 네 무대를 찾아 떠나라.";
      } else {
        word = "STAY";
        wordKr = activeLang === "en" ? "HOLD ON" : "버텨라";
        punchline = activeLang === "en"
          ? "You still have leverage to build. Sharpen your skills and change the game."
          : "아직 증명할 것이 남았다. 실력을 쌓아 판을 뒤집어라.";
      }
    } else if (category === "love") {
      if (q.includes("손절") || q.includes("차단") || q.includes("끝낼까") || q.includes("block") || q.includes("cut") || q.includes("toxic")) {
        word = "BLOCK";
        wordKr = activeLang === "en" ? "CUT TIES" : "끊어내라";
        punchline = activeLang === "en"
          ? "Stop recycling toxic nostalgia. Clear the space for real connection."
          : "미련은 쓰레기통에 버려라. 새 인연을 맞이할 자리를 비워라.";
      } else {
        word = "SPEAK";
        wordKr = activeLang === "en" ? "SAY IT" : "말해라";
        punchline = activeLang === "en"
          ? "Unspoken feelings rot inside you. Speak your truth, even if rejected."
          : "마음속에 묻어두면 썩는다. 거절당해도 진심을 던져라.";
      }
    } else {
      if (q.includes("자야") || q.includes("피곤") || q.includes("새벽") || q.includes("잘까") || q.includes("취침") || q.includes("sleep") || q.includes("bed") || q.includes("tired")) {
        word = "SLEEP";
        wordKr = activeLang === "en" ? "GO TO SLEEP" : "잠이나 자라";
        punchline = activeLang === "en"
          ? "Midnight overthinking is a chemical illusion. Put the phone down and sleep."
          : "새벽의 감상은 전부 허상이다. 침대로 기어들어가라.";
      } else if (q.includes("먹을까") || q.includes("라면") || q.includes("야식") || q.includes("치킨") || q.includes("pizza") || q.includes("eat") || q.includes("food")) {
        word = "PASS";
        wordKr = activeLang === "en" ? "DON'T EAT" : "참아라";
        punchline = activeLang === "en"
          ? "30 minutes of indulgence leads to 12 hours of indigestion and regret."
          : "30분의 쾌락 뒤에 12시간의 소화 불량과 자책이 기다린다.";
      } else if (q.includes("운동") || q.includes("헬스") || q.includes("시작") || q.includes("gym") || q.includes("workout")) {
        word = "START";
        wordKr = activeLang === "en" ? "MOVE NOW" : "움직여라";
        punchline = activeLang === "en"
          ? "Kill the hesitation and move your body. The first 5 minutes change everything."
          : "생각을 멈추고 몸을 던져라. 첫 5분이 모든 것을 바꾼다.";
      }
    }

    const opinions = {
      reason: JUDGES.reason.evaluate(question, category, activeLang),
      instinct: JUDGES.instinct.evaluate(question, category, activeLang),
      realist: JUDGES.realist.evaluate(question, category, activeLang)
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
      lang: activeLang,
      decided_at: new Date().toISOString()
    };
  }
}
