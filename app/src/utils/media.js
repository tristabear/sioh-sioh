/* eslint-disable */
import { QUADRANTS } from '../data/emotions';

// Resize/compress an image File down to a data URL, keeping localStorage usage small.
export function compressImage(file, maxDim = 720, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Quadrant label/color matching the affect-grid picker (Russell's circumplex).
export function getQuadrantInfo(coord) {
  if (!coord) return { label: '今天的感受', color: '#3A6B7E' };
  const pos = coord.valence >= 0;
  const high = coord.arousal >= 0;
  const q = QUADRANTS.find(q => (q.valence >= 0) === pos && (q.arousal >= 0) === high);
  return { label: q.label, color: q.color };
}

// Draw text wrapped to maxWidth, character by character (works for CJK).
// Truncates with an ellipsis once maxLines is reached.
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const chars = Array.from(text);
  let line = '';
  let cy = y;
  let lineCount = 1;

  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      if (lineCount >= maxLines) {
        let truncated = line;
        while (truncated.length > 0 && ctx.measureText(truncated + '…').width > maxWidth) {
          truncated = truncated.slice(0, -1);
        }
        ctx.fillText(truncated + '…', x, cy);
        return;
      }
      ctx.fillText(line, x, cy);
      line = chars[i];
      cy += lineHeight;
      lineCount++;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, cy);
}

// Face-only version of the ShihuBreathing illustration (hand-drawn, distinct
// from the shihu-head-layer.png used for the app icon), stamped onto share
// cards. Canvas can't draw SVG markup directly, so it's
// loaded through an Image once and cached.
const SHIHU_FACE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 26 268 236">
  <g>
    <path d="M150 110 Q 150 50 169 32 Q 184 45 214 98 Q 186 118 150 110 Z" fill="#d7a263"/>
    <path d="M167 102 Q 170 62 180 50 Q 190 62 201 100 Q 184 110 167 102 Z" fill="#e9b9a8"/>
    <path d="M150 110 Q 150 50 169 32 Q 176 42 182 56 Q 165 78 150 110 Z" fill="#4f3a23" opacity=".55"/>
    <path d="M320 110 Q 320 50 301 32 Q 286 45 256 98 Q 284 118 320 110 Z" fill="#d7a263"/>
    <path d="M303 102 Q 300 62 290 50 Q 280 62 269 100 Q 286 110 303 102 Z" fill="#e9b9a8"/>
    <path d="M320 110 Q 320 50 301 32 Q 294 42 288 56 Q 305 78 320 110 Z" fill="#4f3a23" opacity=".55"/>
    <circle cx="235" cy="172" r="99" fill="#d7a263"/>
    <path d="M235 96 Q 230 122 235 146 Q 240 122 235 96 Z" fill="#5c4329" opacity=".7"/>
    <path d="M212 102 Q 205 126 211 148 Q 219 126 218 104 Z" fill="#5c4329" opacity=".6"/>
    <path d="M258 102 Q 265 126 259 148 Q 251 126 252 104 Z" fill="#5c4329" opacity=".6"/>
    <ellipse cx="210" cy="222" rx="40" ry="34" fill="#f8efdc"/>
    <ellipse cx="260" cy="222" rx="40" ry="34" fill="#f8efdc"/>
    <ellipse cx="160" cy="204" rx="20" ry="12" fill="#ef9f86" opacity=".4"/>
    <ellipse cx="310" cy="204" rx="20" ry="12" fill="#ef9f86" opacity=".4"/>
    <g stroke="#fff7ea" stroke-width="2.4" stroke-linecap="round" opacity=".75" fill="none">
      <path d="M178 208 Q 140 202 110 196"/><path d="M178 216 Q 138 216 106 214"/><path d="M178 224 Q 140 230 112 234"/>
      <path d="M292 208 Q 330 202 360 196"/><path d="M292 216 Q 332 216 364 214"/><path d="M292 224 Q 330 230 358 234"/>
    </g>
    <ellipse cx="193" cy="178" rx="23" ry="27" fill="#4a3526"/>
    <ellipse cx="277" cy="178" rx="23" ry="27" fill="#4a3526"/>
    <circle cx="186" cy="169" r="7.5" fill="#fffaf2"/>
    <circle cx="270" cy="169" r="7.5" fill="#fffaf2"/>
    <circle cx="199" cy="187" r="3.4" fill="#fffaf2" opacity=".8"/>
    <circle cx="283" cy="187" r="3.4" fill="#fffaf2" opacity=".8"/>
    <path d="M224 200 Q 235 195 246 200 Q 241 214 235 217 Q 229 214 224 200 Z" fill="#e6928f"/>
    <path d="M235 217 Q 235 228 222 230" fill="none" stroke="#5c4329" stroke-width="3" stroke-linecap="round"/>
    <path d="M235 217 Q 235 228 248 230" fill="none" stroke="#5c4329" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>`;

let shihuFacePromise = null;
function loadShihuFace() {
  if (!shihuFacePromise) {
    shihuFacePromise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null); // card still renders, just without the mascot
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SHIHU_FACE_SVG);
    });
  }
  return shihuFacePromise;
}

// Render a Garmin-style "activity summary" card for the session and
// return it as a PNG data URL.
export async function generateShareCard(session) {
  const { emotionWord, candidateWords, affectCoord, journalNote } = session || {};
  const { label, color } = getQuadrantInfo(affectCoord);

  const W = 750, H = 1000;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, color);
  bg.addColorStop(1, '#1c2b24');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.beginPath();
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.arc(W * 0.85, H * 0.1, 180, 0, Math.PI * 2);
  ctx.fill();

  // Shihu mascot, bottom-right. Drawn before the text so long journal notes
  // stay readable on top of it.
  const shihu = await loadShihuFace();
  if (shihu) {
    const sw = 240;
    const sh = sw * (236 / 268);
    ctx.drawImage(shihu, W - sw - 40, H - sh - 78, sw, sh);
  }

  ctx.fillStyle = '#faf7f2';
  ctx.font = '700 32px "JF Open Huninn", sans-serif';
  ctx.fillText('惜惜 sioh-sioh', 60, 90);

  const dateStr = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  ctx.font = '300 24px "JF Open Huninn", sans-serif';
  ctx.fillStyle = 'rgba(250,247,242,0.7)';
  ctx.fillText(dateStr, 60, 132);

  ctx.font = '700 22px "JF Open Huninn", sans-serif';
  ctx.fillStyle = 'rgba(250,247,242,0.85)';
  ctx.fillText(label, 60, 200);

  ctx.fillStyle = '#faf7f2';
  const emotionText = emotionWord?.word || '說不出名字的感受';
  const emotionFontSize = emotionText.length > 6 ? 64 : 104;
  ctx.font = `900 ${emotionFontSize}px "JF Open Huninn", serif`;
  wrapText(ctx, emotionText, 60, 350, W - 120, emotionFontSize, 1);

  let nextY = 440;
  if (candidateWords?.length === 2 && emotionWord) {
    ctx.font = '300 26px "JF Open Huninn", sans-serif';
    ctx.fillStyle = 'rgba(250,247,242,0.85)';
    const journeyText = `你感受到了 ${candidateWords[0].word} 和 ${candidateWords[1].word}，你學會更精確地說出它：${emotionWord.word}`;
    wrapText(ctx, journeyText, 60, nextY, W - 120, 40, 3);
    nextY += 130;
  }

  if (journalNote) {
    ctx.font = '300 28px "JF Open Huninn", sans-serif';
    ctx.fillStyle = 'rgba(250,247,242,0.85)';
    wrapText(ctx, journalNote, 60, nextY, W - 120, 44, 6);
  }

  ctx.font = '300 24px "JF Open Huninn", sans-serif';
  ctx.fillStyle = 'rgba(250,247,242,0.6)';
  wrapText(ctx, '今天，我練習停下來，看見並惜惜自己的感受。', 60, H - 90, 400, 36, 2);

  return canvas.toDataURL('image/png');
}

// Share an image via the Web Share API when available, falling back to a download.
export async function shareOrDownloadImage(dataUrl, filename = 'sioh-sioh-share.png') {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], filename, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: '惜惜', text: '今天的情緒記錄' });
      return;
    }
  } catch (e) {
    if (e?.name === 'AbortError') return;
  }
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
