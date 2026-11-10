/**
 * OneWord: 3초 의사결정 판결 알고리즘 & 카테고리 프리셋 (v0.8.3 - AI 심판관 성향 튜너 연동)
 */

import { JUDGES } from "./personas.js";
import { GLOBAL_PRESETS } from "../i18n/translations.js";
import { BIAS_MODES } from "./bias.js";

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

  evaluate(question, lang = "ko", biasMode = "balanced") {
    const category = this.detectCategory(question);
    const q = question.toLowerCase();
    const activeBias = BIAS_MODES[biasMode] ? biasMode : "balanced";

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

    // [성향 모드 1: 극단적 이성파 (Dr. Logic 80% - 브레이크 & 절제)]
    if (activeBias === "rational") {
      if (category === "shopping") {
        word = "DROP";
        wordKr = activeLang === "en" ? "WALK AWAY" : "포기해라";
        punchline = activeLang === "en"
          ? "Calculated ROI is zero. Suppress dopamine and protect your capital."
          : "투자 대비 효용은 0에 수렴한다. 도파민을 누르고 자산을 지켜라.";
      } else if (category === "career") {
        word = "HOLD";
        wordKr = activeLang === "en" ? "PREPARE FIRST" : "준비하고 버텨라";
        punchline = activeLang === "en"
          ? "Emotion is the enemy of leverage. Secure a signed offer before moving."
          : "감정은 협상력의 적이다. 다음 이직 오퍼를 확정한 뒤에 움직여라.";
      } else if (category === "love") {
        word = "WAIT";
        wordKr = activeLang === "en" ? "OBSERVE" : "관망하라";
        punchline = activeLang === "en"
          ? "Pause emotional projection. Analyze behavioral data with a clear head."
          : "감정적 착각을 멈추고 냉정하게 상대의 행동 데이터를 먼저 분석하라.";
      } else {
        if (q.includes("자야") || q.includes("피곤") || q.includes("새벽") || q.includes("잘까") || q.includes("sleep")) {
          word = "SLEEP";
          wordKr = activeLang === "en" ? "SLEEP NOW" : "즉시 취침하라";
          punchline = activeLang === "en"
            ? "Sleep deprivation ruins cognitive performance by 40%. Bed immediately."
            : "수면 부족은 내일의 인지 능력을 40% 파괴한다. 즉시 자라.";
        } else if (q.includes("먹을까") || q.includes("라면") || q.includes("야식") || q.includes("eat")) {
          word = "PASS";
          wordKr = activeLang === "en" ? "DON'T EAT" : "참아라";
          punchline = activeLang === "en"
            ? "Midnight insulin spike ruins deep sleep. Drink water and stop."
            : "야간 인슐린 스파이크는 깊은 수면을 방해한다. 물 한 잔 마시고 멈춰라.";
        } else {
          word = "FOCUS";
          wordKr = activeLang === "en" ? "STICK TO PLAN" : "루틴을 지켜라";
          punchline = activeLang === "en"
            ? "Discipline equals freedom. Suppress short-term impulse and stick to the routine."
            : "규율이 곧 자유다. 단기적 충동을 배제하고 정해둔 루틴을 지켜라.";
        }
      }
    }
    // [성향 모드 2: 도파민 풀악셀 (Captain Vibe 80% - 직진 & YOLO)]
    else if (activeBias === "vibe") {
      if (category === "shopping") {
        word = "BUY";
        wordKr = activeLang === "en" ? "GET IT" : "질러라";
        punchline = activeLang === "en"
          ? "You only live once! Regretting what you bought beats crying over missing out."
          : "인생은 한 번뿐이다! 질러서 후회하는 게 품절되고 우는 것보다 낫다.";
      } else if (category === "career") {
        word = "RUN";
        wordKr = activeLang === "en" ? "ESCAPE" : "탈출해라";
        punchline = activeLang === "en"
          ? "Follow your adrenaline! Staying in a soul-sucking room kills your fire."
          : "심장이 뛰는 쪽으로 판을 엎어라! 죽은 방에 갇혀있으면 불꽃이 꺼진다.";
      } else if (category === "love") {
        word = "GO";
        wordKr = activeLang === "en" ? "CONFESS NOW" : "직진해라";
        punchline = activeLang === "en"
          ? "Send that text! Even if rejected, fireworks beat dying of curiosity."
          : "카톡 보내라! 차이더라도 불꽃을 쏴봐야 궁금해서 잠 못 자는 걸 끝낸다.";
      } else {
        if (q.includes("자야") || q.includes("피곤") || q.includes("새벽") || q.includes("잘까") || q.includes("sleep")) {
          word = "REST";
          wordKr = activeLang === "en" ? "DEEP REST" : "푹 쉬어라";
          punchline = activeLang === "en"
            ? "Your body is screaming for recharge. Shut down and recover completely."
            : "몸이 충전을 원하고 있다. 아무 생각 말고 푹 쉬어라.";
        } else if (q.includes("먹을까") || q.includes("라면") || q.includes("야식") || q.includes("eat")) {
          word = "EAT";
          wordKr = activeLang === "en" ? "ENJOY IT" : "맛있게 먹어라";
          punchline = activeLang === "en"
            ? "Dopamine tonight, diet tomorrow. Life is too short to starve cravings."
            : "오늘 밤의 행복은 지금뿐이다! 먹고 내일 운동으로 태워라.";
        } else {
          word = "START";
          wordKr = activeLang === "en" ? "DO IT NOW" : "지금 저질러라";
          punchline = activeLang === "en"
            ? "Thinking is procrastination in disguise. Jump in with both feet!"
            : "생각은 위장된 게으름일 뿐이다. 지금 당장 저질러라!";
        }
      }
    }
    // [성향 모드 3: 현실 팩폭러 (Mr. Fact 80% - 냉혹한 팩트 폭격)]
    else if (activeBias === "realist") {
      if (category === "shopping") {
        word = "CHECK";
        wordKr = activeLang === "en" ? "CHECK BALANCE" : "잔고 확인하라";
        punchline = activeLang === "en"
          ? "Open your mobile banking app right now. Does that balance look rich to you?"
          : "지금 당장 뱅킹 앱 켜고 통장 잔고를 봐라. 그게 결제할 숫자로 보이는가?";
      } else if (category === "career") {
        word = "ENDURE";
        wordKr = activeLang === "en" ? "GRIT TEETH" : "버텨라";
        punchline = activeLang === "en"
          ? "Bills don't pay themselves. Quit only when money stops being your anxiety."
          : "월급이 사라지는 순간 현실 지옥이 열린다. 이 꽉 깨물고 버텨라.";
      } else if (category === "love") {
        word = "BLOCK";
        wordKr = activeLang === "en" ? "CUT TIES" : "차단해라";
        punchline = activeLang === "en"
          ? "If they liked you, you wouldn't be asking an AI tool at midnight."
          : "너를 좋아했으면 애초에 새벽에 AI한테 물어보게 만들지도 않았다.";
      } else {
        if (q.includes("자야") || q.includes("피곤") || q.includes("새벽") || q.includes("잘까") || q.includes("sleep")) {
          word = "SLEEP";
          wordKr = activeLang === "en" ? "PUT PHONE DOWN" : "폰 끄고 자라";
          punchline = activeLang === "en"
            ? "Scrolling until 3 AM solves zero life problems. Turn the screen off."
            : "새벽 3시까지 쇼츠 본다고 인생 안 바뀐다. 폰 끄고 불 꺼라.";
        } else if (q.includes("먹을까") || q.includes("라면") || q.includes("야식") || q.includes("eat")) {
          word = "PASS";
          wordKr = activeLang === "en" ? "DON'T BINGE" : "먹지 마라";
          punchline = activeLang === "en"
            ? "Tomorrow morning you will stare at the bloated mirror in pure disgust."
            : "내일 아침 퉁퉁 부은 얼굴로 거울 보며 땅을 치고 후회할 게 뻔하다.";
        } else {
          word = "WAKE";
          wordKr = activeLang === "en" ? "FACE REALITY" : "현실을 봐라";
          punchline = activeLang === "en"
            ? "Stop escaping into daydreaming. Face the cold hard facts in front of you."
            : "망상으로 도피하지 마라. 지금 네 앞에 놓인 현실부터 똑바로 처리해라.";
        }
      }
    }
    // [성향 모드 4: 밸런스 모드 (기본 - 33% 균등 토론)]
    else {
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
    }

    const opinions = {
      reason: JUDGES.reason.evaluate(question, category, activeLang),
      instinct: JUDGES.instinct.evaluate(question, category, activeLang),
      realist: JUDGES.realist.evaluate(question, category, activeLang)
    };

    const hashId = "v_" + Date.now().toString(36);
    const biasInfo = BIAS_MODES[activeBias] || BIAS_MODES.balanced;

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
      bias: biasInfo.id,
      bias_badge: activeLang === "en" ? biasInfo.badgeEn : biasInfo.badgeKo,
      decided_at: new Date().toISOString()
    };
  }
}
