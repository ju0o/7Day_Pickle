/**
 * OneWord: 3대 가상 AI 심판관 페르소나 정의 (v0.6.4 - Bilingual 지원)
 */

export const JUDGES = {
  reason: {
    id: "reason",
    name: "닥터 로직 (이성)",
    nameEn: "Dr. Logic (Reason)",
    icon: "🧠",
    role: "확률과 효율의 분석가",
    color: "#00e5ff",
    evaluate: (question, category, lang = "ko") => {
      if (lang === "en") {
        switch (category) {
          case "shopping":
            return "Have you calculated the true utility-to-cost ratio? Dopamine spikes fade within 48 hours.";
          case "career":
            return "Compare the growth ceiling of your current role against the opportunity cost with hard data.";
          case "love":
            return "Analyze behavioral patterns objectively. Wishful thinking is a waste of cognitive energy.";
          case "daily":
          default:
            return "Quantify how this short-term impulse damages tomorrow's total productivity.";
        }
      }

      switch (category) {
        case "shopping":
          return "비용 대비 효용 가치를 계산해 보았는가? 감정적 도파민 충동은 48시간 내에 소멸한다.";
        case "career":
          return "현 직장의 성장 한계점과 이직 시의 기회비용을 데이터로 비교 분석했는지 점검하라.";
        case "love":
          return "상대방의 행동 패턴과 과거 반응을 객관적으로 복기하라. 착각은 에너지 낭비다.";
        case "daily":
        default:
          return "단기적 쾌락이 내일 하루 전체의 생산성에 미칠 영향을 수치화해 보아라.";
      }
    }
  },
  instinct: {
    id: "instinct",
    name: "캡틴 바이브 (행동)",
    nameEn: "Captain Vibe (Instinct)",
    icon: "⚡",
    role: "직관과 돌파의 행동가",
    color: "#ff007f",
    evaluate: (question, category, lang = "ko") => {
      if (lang === "en") {
        switch (category) {
          case "shopping":
            return "Hesitation means sold out! Regretting a purchase beats obsessing over what you missed.";
          case "career":
            return "Do you want to die inside a comfortable cage? Follow your adrenaline and disrupt the board.";
          case "love":
            return "Go straight ahead! Even if you get rejected, getting closure is how you move forward.";
          case "daily":
          default:
            return "You only live once. What's the point of suppressing your desires right now?";
        }
      }

      switch (category) {
        case "shopping":
          return "망설이는 순간 품절이다. 사서 후회하는 게 안 사고 평생 생각나는 것보다 낫다.";
        case "career":
          return "안전한 감옥에 갇혀 늙을 텐가? 심장이 뛰는 쪽으로 판을 엎어라.";
        case "love":
          return "마음이 시키면 직진이다. 차이더라도 끝을 봐야 다음 장으로 넘어갈 수 있다.";
        case "daily":
        default:
          return "인생 한 번뿐이다. 지금 이 순간 하고 싶은 걸 참아서 뭐 하겠는가?";
      }
    }
  },
  realist: {
    id: "realist",
    name: "미스터 팩트 (현실)",
    nameEn: "Mr. Fact (Realist)",
    icon: "💀",
    role: "냉혹한 현실 폭격기",
    color: "#ffb703",
    evaluate: (question, category, lang = "ko") => {
      if (lang === "en") {
        switch (category) {
          case "shopping":
            return "Did you even check your bank balance before asking? Next month's statement is your reality.";
          case "career":
            return "Quitting without an offer isn't freedom—it's survival hell. Hold the signed contract first.";
          case "love":
            return "If they truly cared, they wouldn't leave you overthinking alone at 2 AM.";
          case "daily":
          default:
            return "Eat that junk now and you'll wake up bloated, nauseous, and full of self-loathing.";
        }
      }

      switch (category) {
        case "shopping":
          return "통장 잔고를 보고도 그 소리가 나오는가? 다음 달 카드 명세서가 네 현실이다.";
        case "career":
          return "대책 없는 퇴사는 자유가 아니라 생존의 지옥이다. 이력서 합격증 쥐고 말해라.";
        case "love":
          return "그 사람은 네게 관심이 없다. 관심이 있었다면 고민하게 만들지도 않았다.";
        case "daily":
        default:
          return "그거 먹고 자면 내일 얼굴 붓고 속 쓰려서 후회로 아침을 시작할 것이다.";
      }
    }
  }
};
