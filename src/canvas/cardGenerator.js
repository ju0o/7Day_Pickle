/**
 * OneWord: HTML5 Canvas 기반 고해상도 SNS 판결 카드 이미지 렌더러
 * 인스타그램, 스레드, X 규격의 1080px 고화질 PNG 이미지를 클라이언트에서 1초 만에 생성
 * v0.6.3: 4대 커스텀 비주얼 테마 스타일러 지원
 * 1) Cyber (사이버 네온)
 * 2) Minimal (미니멀 블랙 & 화이트)
 * 3) Parchment (고전 법정 양피지 & 붉은 인장)
 * 4) Retro8Bit (아케이드 픽셀 & CRT 스캔라인)
 */

import { VoteSimulator } from "../engine/voting.js";

export const CARD_STYLES = {
  cyber: { id: "cyber", label: "⚡ 사이버 네온", icon: "⚡" },
  minimal: { id: "minimal", label: "🖤 미니멀 블랙", icon: "🖤" },
  parchment: { id: "parchment", label: "📜 고전 법정", icon: "📜" },
  retro8bit: { id: "retro8bit", label: "👾 8비트 아케이드", icon: "👾" }
};

const THEME_COLORS = {
  shopping: { primary: "#ffb703", secondary: "#fb8500", glow: "rgba(255, 183, 3, 0.6)" },
  career: { primary: "#00e5ff", secondary: "#0077b6", glow: "rgba(0, 229, 255, 0.6)" },
  love: { primary: "#ff007f", secondary: "#7209b7", glow: "rgba(255, 0, 127, 0.6)" },
  daily: { primary: "#a855f7", secondary: "#6366f1", glow: "rgba(168, 85, 247, 0.6)" }
};

export class CardGenerator {
  static renderCanvas(verdict, format = "square", cardStyle = "cyber") {
    const isStory = format === "story";
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const poll = verdict.poll || VoteSimulator.getPollData(verdict);

    switch (cardStyle) {
      case "minimal":
        this._renderMinimal(ctx, verdict, width, height, isStory, poll);
        break;
      case "parchment":
        this._renderParchment(ctx, verdict, width, height, isStory, poll);
        break;
      case "retro8bit":
        this._renderRetro8Bit(ctx, verdict, width, height, isStory, poll);
        break;
      case "cyber":
      default:
        this._renderCyber(ctx, verdict, width, height, isStory, poll);
        break;
    }

    return canvas;
  }

  // [1] 기본 테마: 사이버 네온 (Cyber)
  static _renderCyber(ctx, verdict, width, height, isStory, poll) {
    const theme = THEME_COLORS[verdict.category] || THEME_COLORS.daily;

    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#080a12");
    bgGrad.addColorStop(0.5, "#0b0f19");
    bgGrad.addColorStop(1, "#05070a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const margin = isStory ? 80 : 50;
    const frameW = width - margin * 2;
    const frameH = height - margin * 2;

    ctx.save();
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 4;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 25;
    this.roundRect(ctx, margin, margin, frameW, frameH, 32);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = theme.primary;
    const cs = 16;
    ctx.fillRect(margin - 2, margin - 2, cs, cs);
    ctx.fillRect(margin + frameW - cs + 2, margin - 2, cs, cs);
    ctx.fillRect(margin - 2, margin + frameH - cs + 2, cs, cs);
    ctx.fillRect(margin + frameW - cs + 2, margin + frameH - cs + 2, cs, cs);

    const startY = isStory ? 240 : 130;
    ctx.textAlign = "center";
    ctx.fillStyle = "#8892b0";
    ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("ONE WORD LAB  |  THE FINAL VERDICT", width / 2, startY);

    const catBadgeY = startY + 45;
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2;
    const badgeW = 200;
    const badgeH = 40;
    this.roundRect(ctx, width / 2 - badgeW / 2, catBadgeY, badgeW, badgeH, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = theme.primary;
    ctx.font = "bold 18px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText(`CATEGORY: ${verdict.category.toUpperCase()}`, width / 2, catBadgeY + 26);
    ctx.restore();

    const questionY = startY + (isStory ? 180 : 120);
    ctx.fillStyle = "#ccd6f6";
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.letterSpacing = "0px";
    const wrappedQ = this.wrapText(ctx, `Q. ${verdict.question}`, frameW - 80);
    wrappedQ.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, width / 2, questionY + i * 44);
    });

    const wordCenterY = isStory ? 840 : 510;
    ctx.save();
    ctx.font = "black 140px -apple-system, BlinkMacSystemFont, 'Impact', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 40;
    ctx.fillStyle = theme.primary;
    ctx.fillText(verdict.verdict_word, width / 2, wordCenterY);
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.fillText(verdict.verdict_kr, width / 2, wordCenterY + 70);

    const punchY = isStory ? 1160 : 670;
    const punchW = frameW - 100;
    const punchH = isStory ? 180 : 130;

    ctx.save();
    ctx.fillStyle = "rgba(10, 14, 24, 0.85)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, width / 2 - punchW / 2, punchY, punchW, punchH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "italic 28px -apple-system, BlinkMacSystemFont, 'Pretendard', serif";
    const wrappedPunch = this.wrapText(ctx, `"${verdict.punchline}"`, punchW - 60);
    const textStart = punchY + (punchH / 2) - ((wrappedPunch.length - 1) * 20);
    wrappedPunch.slice(0, 3).forEach((line, i) => {
      ctx.fillText(line, width / 2, textStart + i * 40);
    });
    ctx.restore();

    if (poll) {
      const pollBadgeY = isStory ? 1390 : 830;
      const pollBadgeW = 440;
      const pollBadgeH = 50;

      ctx.save();
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = poll.agreePercent >= 60 ? "#10b981" : "#f43f5e";
      ctx.lineWidth = 2;
      this.roundRect(ctx, width / 2 - pollBadgeW / 2, pollBadgeY, pollBadgeW, pollBadgeH, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = poll.agreePercent >= 60 ? "#34d399" : "#fb7185";
      ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
      ctx.fillText(`👥 시민 배심원 ${poll.agreePercent}% 인정 (${poll.totalVotes.toLocaleString()}명 투표)`, width / 2, pollBadgeY + 32);
      ctx.restore();
    }

    if (isStory && verdict.opinions) {
      const opinionsY = 1520;
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 20px monospace";
      ctx.letterSpacing = "2px";
      ctx.fillText("--- 3 JUDGES VERDICT DEBATE ---", width / 2, opinionsY);

      ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
      ctx.textAlign = "left";
      const startX = margin + 60;
      const ops = [
        { label: "🧠 이성", text: verdict.opinions.reason },
        { label: "⚡ 행동", text: verdict.opinions.instinct },
        { label: "💀 현실", text: verdict.opinions.realist }
      ];
      ops.forEach((op, idx) => {
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`${op.label}: ${op.text.slice(0, 28)}...`, startX, opinionsY + 45 + idx * 36);
      });
      ctx.textAlign = "center";
    }

    const footerY = isStory ? 1800 : 990;
    ctx.fillStyle = "#64748b";
    ctx.font = "18px monospace";
    ctx.letterSpacing = "2px";
    const dateStr = new Date(verdict.decided_at || Date.now()).toLocaleDateString("ko-KR");
    ctx.fillText(`DECIDED ON: ${dateStr}  |  CONFIDENCE: ${verdict.confidence || 98}%`, width / 2, footerY);

    ctx.fillStyle = theme.primary;
    ctx.font = "bold 18px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("ONE WORD LAB · PICKLE 7-DAY EXPERIMENT", width / 2, footerY + 30);
  }

  // [2] 미니멀 테마: 순수 블랙 & 화이트 (Minimal Monochrome)
  static _renderMinimal(ctx, verdict, width, height, isStory, poll) {
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    const margin = isStory ? 70 : 45;
    const frameW = width - margin * 2;
    const frameH = height - margin * 2;

    ctx.strokeStyle = "#262626";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(margin, margin, frameW, frameH);

    ctx.textAlign = "center";
    const startY = isStory ? 220 : 130;
    ctx.fillStyle = "#737373";
    ctx.font = "600 20px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.letterSpacing = "8px";
    ctx.fillText("ONE WORD VERDICT", width / 2, startY);

    const questionY = startY + (isStory ? 180 : 130);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = "500 28px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    const wrappedQ = this.wrapText(ctx, `Q. ${verdict.question}`, frameW - 100);
    wrappedQ.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, width / 2, questionY + i * 44);
    });

    const wordCenterY = isStory ? 840 : 510;
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 150px -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText(verdict.verdict_word, width / 2, wordCenterY);

    ctx.fillStyle = "#a3a3a3";
    ctx.font = "500 36px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.fillText(`— ${verdict.verdict_kr} —`, width / 2, wordCenterY + 70);

    const punchY = isStory ? 1160 : 690;
    ctx.fillStyle = "#e5e5e5";
    ctx.font = "400 28px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    const wrappedPunch = this.wrapText(ctx, `"${verdict.punchline}"`, frameW - 120);
    wrappedPunch.slice(0, 3).forEach((line, i) => {
      ctx.fillText(line, width / 2, punchY + i * 42);
    });

    if (poll) {
      const pollY = isStory ? 1390 : 830;
      ctx.strokeStyle = "#404040";
      ctx.lineWidth = 1;
      this.roundRect(ctx, width / 2 - 200, pollY, 400, 44, 22);
      ctx.stroke();

      ctx.fillStyle = "#d4d4d4";
      ctx.font = "600 18px monospace";
      ctx.fillText(`PUBLIC VOTE: ${poll.agreePercent}% AGREE`, width / 2, pollY + 28);
    }

    if (isStory && verdict.opinions) {
      const opinionsY = 1540;
      ctx.fillStyle = "#525252";
      ctx.font = "600 18px monospace";
      ctx.fillText("--- PERSPECTIVES ---", width / 2, opinionsY);

      ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
      ctx.textAlign = "left";
      const startX = margin + 80;
      ctx.fillStyle = "#737373";
      ctx.fillText(`Logic: ${verdict.opinions.reason.slice(0, 30)}...`, startX, opinionsY + 45);
      ctx.fillText(`Action: ${verdict.opinions.instinct.slice(0, 30)}...`, startX, opinionsY + 85);
      ctx.fillText(`Fact: ${verdict.opinions.realist.slice(0, 30)}...`, startX, opinionsY + 125);
      ctx.textAlign = "center";
    }

    const footerY = isStory ? 1800 : 990;
    ctx.fillStyle = "#525252";
    ctx.font = "500 16px monospace";
    ctx.letterSpacing = "2px";
    ctx.fillText("ONEWORD.LAB", width / 2, footerY);
  }

  // [3] 고전 법정 테마: 양피지 & 붉은 인장 도장 (Parchment & Seal)
  static _renderParchment(ctx, verdict, width, height, isStory, poll) {
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#f8f3e8");
    bgGrad.addColorStop(0.5, "#efe5cf");
    bgGrad.addColorStop(1, "#e6d7b8");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const margin = isStory ? 70 : 45;
    const frameW = width - margin * 2;
    const frameH = height - margin * 2;

    ctx.strokeStyle = "#8b5a2b";
    ctx.lineWidth = 4;
    ctx.strokeRect(margin, margin, frameW, frameH);

    ctx.strokeStyle = "#a07855";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(margin + 8, margin + 8, frameW - 16, frameH - 16);

    ctx.textAlign = "center";
    const startY = isStory ? 230 : 130;
    ctx.fillStyle = "#4a2e18";
    ctx.font = "bold 28px serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("大 法 院   最 終   判 決 書", width / 2, startY);

    ctx.fillStyle = "#7a5230";
    ctx.font = "italic 20px serif";
    ctx.letterSpacing = "3px";
    ctx.fillText("THE SUPREME COURT OF ONE WORD", width / 2, startY + 36);

    const questionY = startY + (isStory ? 170 : 120);
    ctx.fillStyle = "#3d2314";
    ctx.font = "bold 30px serif";
    const wrappedQ = this.wrapText(ctx, `사건 요지: ${verdict.question}`, frameW - 120);
    wrappedQ.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, width / 2, questionY + i * 44);
    });

    const wordCenterY = isStory ? 820 : 500;
    ctx.fillStyle = "#1c0d02";
    ctx.font = "900 145px serif";
    ctx.letterSpacing = "6px";
    ctx.fillText(verdict.verdict_word, width / 2, wordCenterY);

    ctx.fillStyle = "#7a2214";
    ctx.font = "bold 46px serif";
    ctx.fillText(`【 ${verdict.verdict_kr} 】`, width / 2, wordCenterY + 70);

    const punchY = isStory ? 1140 : 660;
    const punchW = frameW - 100;
    const punchH = isStory ? 180 : 130;

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.strokeStyle = "#b38867";
    ctx.lineWidth = 1;
    this.roundRect(ctx, width / 2 - punchW / 2, punchY, punchW, punchH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#2e1b0c";
    ctx.font = "bold 26px serif";
    const wrappedPunch = this.wrapText(ctx, `판결 이유: "${verdict.punchline}"`, punchW - 60);
    wrappedPunch.slice(0, 3).forEach((line, i) => {
      ctx.fillText(line, width / 2, punchY + 45 + i * 38);
    });

    // 붉은 인장 도장 (Red Wax Seal Stamp)
    const sealX = width / 2 + (isStory ? 280 : 340);
    const sealY = wordCenterY + 20;
    ctx.save();
    ctx.translate(sealX, sealY);
    ctx.rotate(-0.15);
    ctx.strokeStyle = "#b91c1c";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#b91c1c";
    ctx.font = "bold 18px serif";
    ctx.fillText("宣告完畢", 0, -8);
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("VERDICT", 0, 14);
    ctx.restore();

    if (poll) {
      const pollY = isStory ? 1380 : 830;
      ctx.fillStyle = "#5c3d2e";
      ctx.font = "bold 22px serif";
      ctx.fillText(`배심원 결의: ${poll.agreePercent}% 찬성 (${poll.totalVotes.toLocaleString()}인 참여)`, width / 2, pollY);
    }

    if (isStory && verdict.opinions) {
      const opinionsY = 1520;
      ctx.fillStyle = "#7a5230";
      ctx.font = "bold 20px serif";
      ctx.fillText("--- 3人 裁判官 意見書 ---", width / 2, opinionsY);

      ctx.font = "20px serif";
      ctx.textAlign = "left";
      const startX = margin + 80;
      ctx.fillStyle = "#4a2e18";
      ctx.fillText(`이성 판사: ${verdict.opinions.reason.slice(0, 30)}...`, startX, opinionsY + 45);
      ctx.fillText(`행동 판사: ${verdict.opinions.instinct.slice(0, 30)}...`, startX, opinionsY + 85);
      ctx.fillText(`현실 판사: ${verdict.opinions.realist.slice(0, 30)}...`, startX, opinionsY + 125);
      ctx.textAlign = "center";
    }

    const footerY = isStory ? 1800 : 990;
    ctx.fillStyle = "#8b5a2b";
    ctx.font = "bold 18px serif";
    ctx.fillText("서기 2026년 ONE WORD LAB 謹呈", width / 2, footerY);
  }

  // [4] 레트로 8비트 아케이드 테마 (Retro 8-Bit CRT)
  static _renderRetro8Bit(ctx, verdict, width, height, isStory, poll) {
    ctx.fillStyle = "#0c150c";
    ctx.fillRect(0, 0, width, height);

    // CRT 스캔라인
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }

    const margin = isStory ? 70 : 45;
    const frameW = width - margin * 2;
    const frameH = height - margin * 2;

    ctx.strokeStyle = "#39ff14";
    ctx.lineWidth = 6;
    ctx.strokeRect(margin, margin, frameW, frameH);

    ctx.textAlign = "center";
    const startY = isStory ? 220 : 130;
    ctx.fillStyle = "#39ff14";
    ctx.font = "bold 24px monospace";
    ctx.fillText("★ ARCADE JUDGMENT SYSTEM ★", width / 2, startY);

    const questionY = startY + (isStory ? 180 : 120);
    ctx.fillStyle = "#a3e635";
    ctx.font = "bold 28px monospace";
    const wrappedQ = this.wrapText(ctx, `[MISSION] ${verdict.question}`, frameW - 100);
    wrappedQ.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, width / 2, questionY + i * 42);
    });

    const wordCenterY = isStory ? 830 : 510;
    ctx.fillStyle = "#facc15";
    ctx.font = "black 140px monospace";
    ctx.letterSpacing = "6px";
    ctx.fillText(verdict.verdict_word, width / 2, wordCenterY);

    ctx.fillStyle = "#39ff14";
    ctx.font = "bold 40px monospace";
    ctx.fillText(`<< ${verdict.verdict_kr} >>`, width / 2, wordCenterY + 70);

    const punchY = isStory ? 1160 : 680;
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px monospace";
    const wrappedPunch = this.wrapText(ctx, `> ${verdict.punchline}`, frameW - 120);
    wrappedPunch.slice(0, 3).forEach((line, i) => {
      ctx.fillText(line, width / 2, punchY + i * 40);
    });

    if (poll) {
      const pollY = isStory ? 1390 : 830;
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 22px monospace";
      ctx.fillText(`[VOTES: ${poll.totalVotes}] AGREE RATE: ${poll.agreePercent}%`, width / 2, pollY);
    }

    if (isStory && verdict.opinions) {
      const opinionsY = 1540;
      ctx.fillStyle = "#facc15";
      ctx.font = "bold 20px monospace";
      ctx.fillText("== NPC ADVISORS ==", width / 2, opinionsY);

      ctx.font = "19px monospace";
      ctx.textAlign = "left";
      const startX = margin + 80;
      ctx.fillStyle = "#39ff14";
      ctx.fillText(`P1 LOGIC: ${verdict.opinions.reason.slice(0, 28)}...`, startX, opinionsY + 45);
      ctx.fillText(`P2 VIBE: ${verdict.opinions.instinct.slice(0, 28)}...`, startX, opinionsY + 85);
      ctx.fillText(`P3 REAL: ${verdict.opinions.realist.slice(0, 28)}...`, startX, opinionsY + 125);
      ctx.textAlign = "center";
    }

    const footerY = isStory ? 1800 : 990;
    ctx.fillStyle = "#39ff14";
    ctx.font = "bold 18px monospace";
    ctx.fillText("INSERT COIN TO CONTINUE · ONE WORD LAB", width / 2, footerY);
  }

  static roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  static wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  static downloadImage(verdict, format = "square", cardStyle = "cyber") {
    try {
      const canvas = this.renderCanvas(verdict, format, cardStyle);
      const link = document.createElement("a");
      const safeWord = (verdict.verdict_word || "VERDICT").toLowerCase();
      link.download = `OneWord_${safeWord}_${cardStyle}_${format}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      return true;
    } catch (e) {
      console.error("Canvas export failed", e);
      return false;
    }
  }
}
