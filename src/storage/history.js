/**
 * OneWord: 로컬 스토리지 및 URL 해시 공유 상태 매니저
 */

const STORAGE_KEY = "oneword_verdict_history_v1";

export class StorageManager {
  static saveVerdict(verdict) {
    try {
      const history = this.getHistory();
      // 중복 방지 및 최신순 추가
      const filtered = history.filter(item => item.id !== verdict.id);
      filtered.unshift(verdict);
      // 최대 30개 보관
      const trimmed = filtered.slice(0, 30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      return true;
    } catch (e) {
      console.error("Failed to save verdict to localStorage", e);
      return false;
    }
  }

  static getHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  }

  static clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  static encodeState(verdict) {
    try {
      const jsonStr = JSON.stringify({
        q: verdict.question,
        w: verdict.verdict_word,
        k: verdict.verdict_kr,
        p: verdict.punchline,
        c: verdict.category
      });
      return btoa(encodeURIComponent(jsonStr));
    } catch (e) {
      return "";
    }
  }

  static decodeState(base64Str) {
    try {
      const jsonStr = decodeURIComponent(atob(base64Str));
      const parsed = JSON.parse(jsonStr);
      return {
        question: parsed.q,
        verdict_word: parsed.w,
        verdict_kr: parsed.k,
        punchline: parsed.p,
        category: parsed.c
      };
    } catch (e) {
      return null;
    }
  }
}
