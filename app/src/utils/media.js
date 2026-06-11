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

// Render a Garmin-style "activity summary" card for the session and
// return it as a PNG data URL.
export function generateShareCard(session) {
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

  ctx.fillStyle = '#faf7f2';
  ctx.font = '700 32px "Noto Sans TC", sans-serif';
  ctx.fillText('惜惜 sioh-sioh', 60, 90);

  const dateStr = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  ctx.font = '300 24px "Noto Sans TC", sans-serif';
  ctx.fillStyle = 'rgba(250,247,242,0.7)';
  ctx.fillText(dateStr, 60, 132);

  ctx.font = '700 22px "Noto Sans TC", sans-serif';
  ctx.fillStyle = 'rgba(250,247,242,0.85)';
  ctx.fillText(label, 60, 200);

  ctx.fillStyle = '#faf7f2';
  const emotionText = emotionWord?.word || '說不出名字的感受';
  const emotionFontSize = emotionText.length > 6 ? 64 : 104;
  ctx.font = `900 ${emotionFontSize}px "Noto Serif TC", serif`;
  wrapText(ctx, emotionText, 60, 350, W - 120, emotionFontSize, 1);

  let nextY = 440;
  if (candidateWords?.length === 2 && emotionWord) {
    ctx.font = '300 26px "Noto Sans TC", sans-serif';
    ctx.fillStyle = 'rgba(250,247,242,0.85)';
    const journeyText = `你感受到了 ${candidateWords[0].word} 和 ${candidateWords[1].word}，你學會更精確地說出它：${emotionWord.word}`;
    wrapText(ctx, journeyText, 60, nextY, W - 120, 40, 3);
    nextY += 130;
  }

  if (journalNote) {
    ctx.font = '300 28px "Noto Sans TC", sans-serif';
    ctx.fillStyle = 'rgba(250,247,242,0.85)';
    wrapText(ctx, journalNote, 60, nextY, W - 120, 44, 6);
  }

  ctx.font = '300 24px "Noto Sans TC", sans-serif';
  ctx.fillStyle = 'rgba(250,247,242,0.6)';
  wrapText(ctx, '今天，我練習停下來，看見並惜惜自己的感受。', 60, H - 70, W - 120, 36, 2);

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
