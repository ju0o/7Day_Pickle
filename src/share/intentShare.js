/**
 * OneWord: Viral Social Share Intent & Clipboard Engine (v0.7.0)
 * X(Twitter), Threads, Web Share API, 클립보드 원클릭 공유 지원
 */

import { StorageManager } from "../storage/history.js";
import { VoteSimulator } from "../engine/voting.js";
import { TagEngine } from "../engine/tags.js";

export class IntentShare {
  static getShareUrl(verdict) {
    if (typeof window === "undefined") return "https://ju0o.github.io/7Day_Pickle/";
    const hash = StorageManager.encodeState(verdict);
    return `${window.location.origin}${window.location.pathname}#${hash}`;
  }

  static buildFormattedSnippet(verdict, lang = "ko") {
    const poll = VoteSimulator.getPollData(verdict);
    const url = this.getShareUrl(verdict);
    const tags = verdict.tags && verdict.tags.length ? verdict.tags : TagEngine.generateTags(verdict, lang);
    const tagString = TagEngine.formatTagString(tags);

    if (lang === "en") {
      const juryLine = poll ? `👥 Citizen Jury: ${poll.agreePercent}% Agreed\n` : "";
      const biasLine = verdict.bias_badge ? `⚖️ Bias Mode: ${verdict.bias_badge}\n` : "";
      return `⚖️ OneWord AI Verdict\n` +
             `Q. ${verdict.question}\n\n` +
             `👉 VERDICT: ${verdict.verdict_word} (${verdict.verdict_kr})\n` +
             `"${verdict.punchline}"\n\n` +
             biasLine +
             juryLine +
             `🔗 Get your verdict: ${url}\n\n` +
             tagString;
    }

    const juryLine = poll ? `👥 시민 배심원단: ${poll.agreePercent}% 인정\n` : "";
    const biasLine = verdict.bias_badge ? `⚖️ 심판 성향: ${verdict.bias_badge}\n` : "";
    return `⚖️ OneWord 3초 AI 심판소\n` +
           `Q. ${verdict.question}\n\n` +
           `👉 최종 선고: ${verdict.verdict_word} (${verdict.verdict_kr})\n` +
           `"${verdict.punchline}"\n\n` +
           biasLine +
           juryLine +
           `🔗 내 고민도 3초 만에 판결받기: ${url}\n\n` +
           tagString;
  }

  static shareToX(verdict, lang = "ko") {
    const text = this.buildFormattedSnippet(verdict, lang);
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(intentUrl, "_blank", "noopener,noreferrer");
    }
    return intentUrl;
  }

  static shareToThreads(verdict, lang = "ko") {
    const text = this.buildFormattedSnippet(verdict, lang);
    const intentUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(intentUrl, "_blank", "noopener,noreferrer");
    }
    return intentUrl;
  }

  static canNativeShare() {
    return typeof navigator !== "undefined" && typeof navigator.share === "function";
  }

  static async triggerNativeShare(verdict, lang = "ko") {
    if (!this.canNativeShare()) return false;
    const url = this.getShareUrl(verdict);
    const text = this.buildFormattedSnippet(verdict, lang);

    try {
      await navigator.share({
        title: lang === "en" ? `OneWord Verdict: ${verdict.verdict_word}` : `OneWord AI 판결: ${verdict.verdict_word}`,
        text: text,
        url: url
      });
      return true;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.warn("Native share failed:", err);
      }
      return false;
    }
  }

  static async copyFormattedText(verdict, lang = "ko") {
    const text = this.buildFormattedSnippet(verdict, lang);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  }
}
