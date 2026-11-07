/**
 * OneWord: 로컬 스토리지 및 URL 해시 공유 상태 매니저 (v0.4)
 */

const STORAGE_KEY = "oneword_verdict_history_v1";

export class StorageManager {
  static saveVerdict(verdict) {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== verdict.id);
      filtered.unshift(verdict);
      const trimmed = filtered.slice(0, 50); // 최대 50개 보관
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      return true;
    } catch (e) {
      console.error("Failed to save verdict to localStorage", e);
      return false;
    }
  }

  static getHistory(category = "all") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const items = raw ? JSON.parse(raw) : [];
      if (category && category !== "all") {
        return items.filter(item => item.category === category);
      }
      return items;
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  }

  static deleteVerdict(id) {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      return false;
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
        c: verdict.category,
        d: verdict.decided_at || new Date().toISOString()
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
        id: "shared_" + Date.now().toString(36),
        question: parsed.q,
        verdict_word: parsed.w,
        verdict_kr: parsed.k,
        punchline: parsed.p,
        category: parsed.c,
        decided_at: parsed.d || new Date().toISOString()
      };
    } catch (e) {
      return null;
    }
  }
}
