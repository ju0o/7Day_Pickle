/**
 * OneWord: HTML5 Canvas 기반 고해상도 SNS 판결 카드 이미지 렌더러
 * 인스타그램, 스레드, X 규격의 1080px 고화질 PNG 이미지를 클라이언트에서 1초 만에 생성
 * v0.6: 시민 배심원단 여론 지지율 스탬프 각인 지원
 */

import { VoteSimulator } from "../engine/voting.js";

const THEME_COLORS = {
  shopping: { primary: "#ffb703", secondary: "#fb8500", glow: "rgba(255, 183, 3, 0.6)" },
  career: { primary: "#00e5ff", secondary: "#0077b6", glow: "rgba(0, 229, 255, 0.6)" },
  love: { primary: "#ff007f", secondary: "#7209b7", glow: "rgba(255, 0, 127, 0.6)" },
  daily: { primary: "#a855f7", secondary: "#6366f1", glow: "rgba(168, 85, 247, 0.6)" }
};

export class CardGenerator {
  static renderCanvas(verdict, format = "square") {
    const isStory = format === "story";
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const theme = THEME_COLORS[verdict.category] || THEME_COLORS.daily;
    const poll = verdict.poll || VoteSimulator.getPollData(verdict);

    // 1. 딥 다크 배경 그라데이션
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#080a12");
    bgGrad.addColorStop(0.5, "#0b0f19");
    bgGrad.addColorStop(1, "#05070a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. 미세한 사이버 그리드 패턴
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. 네온 테두리 프레임
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

    // 코너 장식
    ctx.fillStyle = theme.primary;
    const cornerSize = 16;
    ctx.fillRect(margin - 2, margin - 2, cornerSize, cornerSize);
    ctx.fillRect(margin + frameW - cornerSize + 2, margin - 2, cornerSize, cornerSize);
    ctx.fillRect(margin - 2, margin + frameH - cornerSize + 2, cornerSize, cornerSize);
    ctx.fillRect(margin + frameW - cornerSize + 2, margin + frameH - cornerSize + 2, cornerSize, cornerSize);

    // 4. 헤더: ONE WORD LAB · THE FINAL VERDICT
    const startY = isStory ? 240 : 130;
    ctx.textAlign = "center";
    ctx.fillStyle = "#8892b0";
    ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("ONE WORD LAB  |  THE FINAL VERDICT", width / 2, startY);

    // 카테고리 뱃지
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

    // 5. 질문 텍스트 (줄바꿈 처리)
    const questionY = startY + (isStory ? 180 : 120);
    ctx.fillStyle = "#ccd6f6";
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.letterSpacing = "0px";
    const wrappedQ = this.wrapText(ctx, `Q. ${verdict.question}`, frameW - 80);
    wrappedQ.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, width / 2, questionY + i * 44);
    });

    // 6. 거대한 ONE WORD 판결문 (중앙 하이라이트)
    const wordCenterY = isStory ? 840 : 510;

    // 네온 글로우 텍스트
    ctx.save();
    ctx.font = "black 140px -apple-system, BlinkMacSystemFont, 'Impact', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 40;
    ctx.fillStyle = theme.primary;
    ctx.fillText(verdict.verdict_word, width / 2, wordCenterY);
    ctx.restore();

    // 한글 번역 서브타이틀
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.fillText(verdict.verdict_kr, width / 2, wordCenterY + 70);

    // 7. 촌철살인 펀치라인 박스
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

    // 8. 시민 배심원 여론 지지율 스탬프 뱃지 (신규)
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

    // 9. 심판관 한 줄 총평 요약 (스토리 모드 전용)
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

    // 10. 푸터 워터마크 및 판결 일시
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

    return canvas;
  }

  static roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y + width, x + width, y + radius);
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

  static downloadImage(verdict, format = "square") {
    try {
      const canvas = this.renderCanvas(verdict, format);
      const link = document.createElement("a");
      const safeWord = (verdict.verdict_word || "VERDICT").toLowerCase();
      link.download = `OneWord_${safeWord}_${format}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      return true;
    } catch (e) {
      console.error("Canvas export failed", e);
      return false;
    }
  }
}
