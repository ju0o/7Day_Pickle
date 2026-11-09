/**
 * OneWord: Community Opinion Poll & Voting Simulator
 * 시민 배심원단 여론 투표 및 찬반 통계 시뮬레이션 엔진
 * - 질문 및 판결 기반의 결정론적(Deterministic) 여론 통계 산출
 * - 사용자 투표 상태의 LocalStorage 영구 보존 및 실시간 여론 반영
 */

export class VoteSimulator {
  static getStorageKey() {
    return "oneword_user_votes";
  }

  static getUserVotes() {
    if (typeof localStorage === "undefined") return {};
    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  static saveUserVote(verdictId, voteType) {
    if (typeof localStorage === "undefined") return;
    try {
      const votes = this.getUserVotes();
      votes[verdictId] = voteType;
      localStorage.setItem(this.getStorageKey(), JSON.stringify(votes));
    } catch (e) {}
  }

  // 결정론적 문자열 해시 (안정적인 시드 생성)
  static hashString(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash; // 32bit int 변환
    }
    return Math.abs(hash);
  }

  static getPollData(verdict) {
    if (!verdict) return null;

    const seedStr = `${verdict.question || ""}_${verdict.verdict_word || ""}`;
    const seed = this.hashString(seedStr);

    // 1. 기준 투표자 수 (850 ~ 3,250명)
    const baseTotal = 850 + (seed % 2400);

    // 2. 판결 단어 성향에 따른 기본 찬성률 (58% ~ 88%)
    let baseAgreePercent = 65 + (seed % 24);
    const cautiousWords = ["STOP", "RUN", "BLOCK", "WAIT", "SAVE", "QUIT", "SLEEP", "OFF"];
    if (cautiousWords.includes(verdict.verdict_word)) {
      baseAgreePercent = Math.min(91, baseAgreePercent + 8);
    }

    let agreeCount = Math.round(baseTotal * (baseAgreePercent / 100));
    let disagreeCount = baseTotal - agreeCount;

    // 3. 사용자 투표 반영
    const userVotes = this.getUserVotes();
    const verdictId = verdict.id || seedStr;
    const userVote = userVotes[verdictId] || null;

    if (userVote === "agree") {
      agreeCount += 1;
    } else if (userVote === "disagree") {
      disagreeCount += 1;
    }

    const totalVotes = agreeCount + disagreeCount;
    const agreePercent = Math.round((agreeCount / totalVotes) * 100);
    const disagreePercent = 100 - agreePercent;

    // 4. 여론 총평 문구
    let consensusText = "";
    if (agreePercent >= 80) {
      consensusText = `🔥 배심원 ${agreePercent}%가 "이게 맞다"며 압도적으로 지지했습니다!`;
    } else if (agreePercent >= 60) {
      consensusText = `⚡ 배심원 ${agreePercent}%가 찬성표를 던져 판결에 힘이 실렸습니다.`;
    } else if (agreePercent >= 45) {
      consensusText = `⚖️ 배심원단 찬반이 ${agreePercent}% 대 ${disagreePercent}%로 팽팽하게 대립 중입니다!`;
    } else {
      consensusText = `💥 배심원 ${disagreePercent}%가 판결에 불복하고 탈룰라를 외쳤습니다!`;
    }

    return {
      verdictId,
      totalVotes,
      agreeVotes: agreeCount,
      disagreeVotes: disagreeCount,
      agreePercent,
      disagreePercent,
      userVote,
      consensusText
    };
  }

  static castVote(verdict, voteType) {
    if (!verdict || (voteType !== "agree" && voteType !== "disagree")) {
      return null;
    }
    const verdictId = verdict.id || `${verdict.question}_${verdict.verdict_word}`;
    this.saveUserVote(verdictId, voteType);
    return this.getPollData(verdict);
  }
}
