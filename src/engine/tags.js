/**
 * OneWord: 딜레마 다중 태그 & 소셜 바이럴 해시태그 생성 엔진 (v0.8.4)
 * - 고민 문맥 키워드 추출 & 카테고리/성향 결합 다중 태그 자동 생성
 * - X(Twitter), Threads 바이럴 최적화 소셜 해시태그(#) 파이프라인
 * - 한/영 다국어 바이럴 태그 데이터셋
 */

export const POPULAR_TAGS = {
  ko: [
    { label: "#야식", prompt: "새벽 2시인데 컵라면 물 올릴까?", category: "daily" },
    { label: "#지름신", prompt: "할부로 에어팟 맥스 지를까 말까?", category: "shopping" },
    { label: "#퇴사각", prompt: "회사 때려치우고 1인 창업 해볼까?", category: "career" },
    { label: "#새벽감성", prompt: "새벽에 전 연인한테 카톡 보내볼까?", category: "love" },
    { label: "#이직준비", prompt: "이직 준비 지금 당장 시작할까?", category: "career" },
    { label: "#금융치료", prompt: "한정판 스니커즈 리셀가로 살까?", category: "shopping" },
    { label: "#갓생살기", prompt: "피곤한데 오늘 헬스장 가서 쇠질할까?", category: "daily" }
  ],
  en: [
    { label: "#LateNightCraving", prompt: "It's 1 AM, should I order a pepperoni pizza?", category: "daily" },
    { label: "#ImpulseBuy", prompt: "Should I spend $550 on AirPods Max right now?", category: "shopping" },
    { label: "#QuitMyJob", prompt: "Should I quit my 9-to-5 job to build a startup?", category: "career" },
    { label: "#MidnightVibes", prompt: "Should I send a midnight 'I miss you' text to my ex?", category: "love" },
    { label: "#CareerShift", prompt: "Update my resume and start job hunting right now?", category: "career" },
    { label: "#RetailTherapy", prompt: "Finance a brand new M3 Max MacBook Pro?", category: "shopping" },
    { label: "#Productivity", prompt: "Skip Netflix and hit the gym right now?", category: "daily" }
  ]
};

export class TagEngine {
  static KEYWORD_TAG_MAP_KO = {
    "라면": ["#야식", "#새벽라면", "#나트륨폭탄"],
    "치킨": ["#치킨각", "#야식유혹", "#칼로리폭탄"],
    "피자": ["#피자", "#도파민충전", "#야식파티"],
    "야식": ["#야식금지", "#다이어트실패", "#새벽식욕"],
    "먹을까": ["#야식고민", "#식욕폭발"],
    "운동": ["#오운완", "#헬스장", "#갓생루틴"],
    "헬스": ["#쇠질", "#근손실방지", "#득근"],
    "잘까": ["#새벽감성", "#불면증", "#수면부족"],
    "새벽": ["#새벽감성", "#잠못드는밤", "#쇼츠그만"],
    "잠": ["#취침시간", "#꿀잠예약", "#피로회복"],
    "살까": ["#내돈내산", "#지름신", "#장바구니"],
    "구매": ["#카드할부", "#쇼핑중독", "#금융치료"],
    "할부": ["#할부인생", "#미래의내가갚는다", "#통장텅텅"],
    "아이폰": ["#아이폰", "#애플감성", "#앱등이"],
    "맥북": ["#맥북프로", "#장비병", "#생산성장비"],
    "신발": ["#스니커즈", "#신발러", "#리셀"],
    "옷": ["#패션스타그램", "#데일리룩", "#지름신"],
    "이직": ["#이직러", "#연봉협상", "#경력기술서"],
    "퇴사": ["#퇴사각", "#사직서", "#자유의몸"],
    "면접": ["#취준생", "#면접준비", "#합격기원"],
    "회사": ["#직장인스타그램", "#출근지옥", "#월급쟁이"],
    "고백": ["#짝사랑", "#고백타이밍", "#그린라이트"],
    "연락": ["#선톡", "#새벽카톡", "#읽씹금지"],
    "차단": ["#손절각", "#인간관계정리", "#멘탈케어"],
    "카톡": ["#자니", "#흑역사생성", "#답장대기"]
  };

  static KEYWORD_TAG_MAP_EN = {
    "pizza": ["#PizzaNight", "#LateNightCraving", "#CheatDay"],
    "eat": ["#MidnightSnack", "#Foodie", "#FoodCravings"],
    "sleep": ["#SleepDeprived", "#Bedtime", "#MidnightThoughts"],
    "workout": ["#GymMotivation", "#FitnessJourney", "#Gains"],
    "gym": ["#GymRat", "#LegDay", "#WorkoutRoutine"],
    "buy": ["#RetailTherapy", "#AddCart", "#TreatYourself"],
    "shopping": ["#ImpulseBuy", "#BrokeLife", "#MustHave"],
    "macbook": ["#TechGeek", "#SetupWars", "#MacBookPro"],
    "iphone": ["#AppleEcosystem", "#NewPhone", "#GadgetLove"],
    "job": ["#CareerGoals", "#CorporateLife", "#JobHunt"],
    "quit": ["#QuitMyJob", "#QuietQuitting", "#EscapeThe9to5"],
    "crush": ["#CrushConfessions", "#DatingAdvice", "#ShootingMyShot"],
    "text": ["#TextMyEx", "#LateNightTexting", "#RegretTomorrow"],
    "date": ["#DatingProblems", "#FirstDate", "#ModernLove"]
  };

  static CATEGORY_TAG_MAP_KO = {
    shopping: ["#지름신", "#소비패턴", "#금융치료"],
    career: ["#커리어고민", "#직장인생존기", "#성장마인드"],
    love: ["#연애의참견", "#관계정리", "#마음의소리"],
    daily: ["#일상고민", "#갓생도전", "#인생고민"]
  };

  static CATEGORY_TAG_MAP_EN = {
    shopping: ["#ShoppingSpree", "#FinancialAdvice", "#MoneyTalks"],
    career: ["#CareerAdvice", "#WorkplaceVibes", "#ProfessionalGrowth"],
    love: ["#DatingLife", "#RelationshipStatus", "#HeartOverMind"],
    daily: ["#DailyDilemma", "#Adulting101", "#LifeDecisions"]
  };

  static generateTags(verdict, lang = "ko") {
    const q = (verdict.question || "").toLowerCase();
    const category = verdict.category || "daily";
    const tags = new Set();

    // 1. 브랜드 & 핵심 태그
    if (lang === "en") {
      tags.add("#OneWord");
      tags.add("#DecisionMaker");
    } else {
      tags.add("#OneWord");
      tags.add("#결정장애");
      tags.add("#AI판결");
    }

    // 2. 키워드 매칭 태그
    const keywordMap = lang === "en" ? TagEngine.KEYWORD_TAG_MAP_EN : TagEngine.KEYWORD_TAG_MAP_KO;
    for (const [kw, kwTags] of Object.entries(keywordMap)) {
      if (q.includes(kw)) {
        kwTags.forEach(t => tags.add(t));
      }
    }

    // 3. 카테고리 태그 보충
    const catMap = lang === "en" ? TagEngine.CATEGORY_TAG_MAP_EN : TagEngine.CATEGORY_TAG_MAP_KO;
    const catTags = catMap[category] || [];
    catTags.forEach(t => tags.add(t));

    // 4. 성향(Bias) 태그 보충
    if (verdict.bias) {
      if (verdict.bias === "vibe") {
        tags.add(lang === "en" ? "#FullVibe" : "#도파민폭발");
      } else if (verdict.bias === "rational") {
        tags.add(lang === "en" ? "#PureLogic" : "#극단적이성");
      } else if (verdict.bias === "realist") {
        tags.add(lang === "en" ? "#RealityCheck" : "#현실자각");
      }
    }

    // 5. 판결 단어 태그 추가
    if (verdict.verdict_word) {
      tags.add(`#${verdict.verdict_word}`);
    }

    // 최대 5~6개로 제한
    return Array.from(tags).slice(0, 6);
  }

  static formatTagString(tags) {
    if (!tags || !tags.length) return "";
    return tags.join(" ");
  }
}
