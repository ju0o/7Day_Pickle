/**
 * OneWord: Decision DNA & Analytics Engine (v0.8.2)
 * - Category frequency & percentage breakdown
 * - Top verdict word frequency tracker
 * - Decision Persona (Decision DNA) heuristic classifier
 * - Zero external chart library dependency (Pure CSS Tailwind bars)
 */

export class StatsAnalyzer {
  static analyze(history = [], lang = "ko") {
    const isEn = lang === "en";
    const total = history.length;

    if (total === 0) {
      return {
        total: 0,
        topCategory: null,
        topCategoryLabel: isEn ? "None" : "없음",
        topCategoryPercent: 0,
        topVerdictWord: isEn ? "None" : "없음",
        topVerdictCount: 0,
        categoryCounts: { shopping: 0, career: 0, love: 0, daily: 0 },
        categoryPercents: { shopping: 0, career: 0, love: 0, daily: 0 },
        persona: {
          title: isEn ? "🌱 Curious Explorer" : "🌱 결정 탐색가",
          desc: isEn 
            ? "You haven't made any verdicts yet. Submit your first dilemma to unlock your Decision DNA!" 
            : "아직 내린 판결이 없습니다. 첫 고민을 판결받고 나의 결정 DNA를 확인해보세요!"
        }
      };
    }

    // 1. Category counts
    const categoryCounts = { shopping: 0, career: 0, love: 0, daily: 0 };
    history.forEach((item) => {
      if (categoryCounts[item.category] !== undefined) {
        categoryCounts[item.category] += 1;
      } else {
        categoryCounts.daily += 1;
      }
    });

    const categoryPercents = {
      shopping: Math.round((categoryCounts.shopping / total) * 100) || 0,
      career: Math.round((categoryCounts.career / total) * 100) || 0,
      love: Math.round((categoryCounts.love / total) * 100) || 0,
      daily: Math.round((categoryCounts.daily / total) * 100) || 0
    };

    // Find top category
    let topCat = "shopping";
    let maxCatCount = -1;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCatCount) {
        maxCatCount = count;
        topCat = cat;
      }
    });

    const catLabels = {
      shopping: isEn ? "🛍️ Shopping" : "🛍️ 지름신",
      career: isEn ? "💼 Career" : "💼 커리어",
      love: isEn ? "💌 Love" : "💌 연애",
      daily: isEn ? "🍜 Daily" : "🍜 일상"
    };

    // 2. Verdict word frequencies
    const wordCounts = {};
    history.forEach((item) => {
      const w = (item.verdict_word || "").toUpperCase().trim();
      if (!w) return;
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });

    let topWord = "NONE";
    let maxWordCount = 0;
    Object.entries(wordCounts).forEach(([w, c]) => {
      if (c > maxWordCount) {
        maxWordCount = c;
        topWord = w;
      }
    });

    // 3. Decision Persona Heuristic Classification
    let persona = {
      title: isEn ? "⚖️ Balanced Strategist" : "⚖️ 냉철한 올라운드 전략가",
      desc: isEn 
        ? "You tackle dilemmas across shopping, career, and relationships with balanced discernment."
        : "지름신, 커리어, 인간관계를 고루 고민하며 이성과 현실 감각의 균형을 유지하는 올라운더 빌더입니다."
    };

    if (topCat === "shopping") {
      if (topWord === "STOP" || topWord === "BLOCK" || topWord === "WAIT") {
        persona = {
          title: isEn ? "🛡️ Iron-Wall Saver" : "🛡️ 철벽 방어 자산가",
          desc: isEn 
            ? "Your impulse wallet defenses are impenetrable. STOP verdicts keep your finances rock solid." 
            : "충동구매의 유혹 앞에서도 뚝심 있게 STOP 판결을 수용하며 통장을 철벽 방어하는 자산 수호자입니다."
        };
      } else {
        persona = {
          title: isEn ? "⚡ Joyful Action Seeker" : "⚡ 도파민 액션 빌더",
          desc: isEn 
            ? "You value instant gratification and life happiness. When in doubt, you believe in seizing the moment!" 
            : "인생은 타이밍과 순간의 행복이라 믿으며, 고민을 즉각적인 결단으로 전환하는 행동파입니다."
        };
      }
    } else if (topCat === "career") {
      if (topWord === "RUN" || topWord === "START" || topWord === "GO" || topWord === "BUILD") {
        persona = {
          title: isEn ? "🚀 Aggressive Pioneer" : "🚀 돌격형 야망가",
          desc: isEn 
            ? "You don't hesitate at career crossroads. You embrace risks and push for exponential growth!" 
            : "커리어 갈림길에서 머뭇거리지 않고 도전을 선택하는 성장 지향적 야망가입니다."
        };
      } else {
        persona = {
          title: isEn ? "📐 Prudent Career Planner" : "📐 신중한 커리어 설계자",
          desc: isEn 
            ? "You calculate every risk before making career moves. Deliberation precedes execution." 
            : "섣부른 이직이나 퇴사 대신 현상 유지와 철저한 대비를 우선하는 전략적 플래너입니다."
        };
      }
    } else if (topCat === "love") {
      persona = {
        title: isEn ? "💌 Sincere Emotion Detective" : "💌 진심 과몰입 탐정",
        desc: isEn 
          ? "Human relationships occupy your deepest thoughts. You prioritize authenticity and emotional clarity." 
          : "인간관계와 감정의 온도에 예민하게 반응하며, 진심 어린 결정을 내리고자 깊이 고뇌하는 감성파입니다."
      };
    } else if (topCat === "daily") {
      persona = {
        title: isEn ? "🍜 Pragmatic Realist" : "🍜 실속파 일상 마스터",
        desc: isEn 
          ? "You focus on daily wellness, sleep, and practical routine optimization without overthinking." 
          : "사소한 야식, 수면, 일상 습관에서 오는 결정 피로를 빠르게 정리하고 일상을 최적화하는 현실주의자입니다."
      };
    }

    return {
      total,
      topCategory: topCat,
      topCategoryLabel: catLabels[topCat] || topCat,
      topCategoryPercent: categoryPercents[topCat] || 0,
      topVerdictWord: topWord,
      topVerdictCount: maxWordCount,
      categoryCounts,
      categoryPercents,
      persona
    };
  }
}
