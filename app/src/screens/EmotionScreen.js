/* eslint-disable */
import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EMOTION_WORDS } from '../data/emotions';
import { getQuadrantInfo } from '../utils/media';

const CANVAS_SIZE = 750;
const VIEWPORT_HEIGHT = 520;

// Convert a #rrggbb color into an rgba() string with the given alpha.
function withAlpha(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Map a -1..1 valence/arousal coordinate onto the 750x750 fog canvas.
// Right = positive valence ("感覺好"), top = positive arousal ("能量高").
function toCanvasPos({ valence, arousal }) {
  return {
    x: ((valence + 1) / 2) * CANVAS_SIZE,
    y: ((1 - arousal) / 2) * CANVAS_SIZE,
  };
}

function wordSize(word) {
  const len = Array.from(word).length;
  if (len <= 2) return 60;
  if (len === 3) return 68;
  return 80;
}

// Fog thickens with distance from the viewport's center point — words
// drifting further from view fade toward the mist.
function fogOpacity(dist) {
  if (dist < 80) return 1.0;
  if (dist < 160) return 0.8 - ((dist - 80) / 80) * 0.3;
  if (dist < 260) return 0.45 - ((dist - 160) / 100) * 0.3;
  return 0.08;
}

const EDGE_LABEL_STYLE = {
  position: 'absolute',
  opacity: 0.28,
  fontSize: 11,
  fontFamily: 'var(--font-sans)',
  color: 'var(--ink)',
  pointerEvents: 'none',
};

export default function EmotionScreen() {
  const navigate = useNavigate();
  const { session, updateSession } = useApp();
  const coord = session.affectCoord || { valence: 0, arousal: 0 };
  const [selected, setSelected] = useState([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);

  // Place every word on the canvas once, by its own valence/arousal.
  const words = useMemo(() => EMOTION_WORDS.map(w => ({
    word: w,
    color: getQuadrantInfo(w).color,
    size: wordSize(w.word),
    ...toCanvasPos(w),
  })), []);

  const centerPos = useMemo(() => toCanvasPos(coord), [coord.valence, coord.arousal]);
  const centerColor = getQuadrantInfo(coord).color;

  // Center the canvas on the user's affect coordinate.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setViewportWidth(rect.width);
    setOffset({ x: rect.width / 2 - centerPos.x, y: VIEWPORT_HEIGHT / 2 - centerPos.y });
  }, []);

  const toggleWord = (w) => {
    setSelected(prev => {
      const isSel = prev.some(s => s.id === w.id);
      if (isSel) return prev.filter(s => s.id !== w.id);
      if (prev.length >= 2) return prev;
      return [...prev, w];
    });
  };

  const confirm = (word, candidates) => {
    updateSession({ candidateWords: candidates, emotionWord: word });
    navigate('/check/srwne');
  };

  // Pan handling: only start panning once the pointer has moved past a
  // small threshold, so a plain tap on a word still fires its click.
  const handlePointerDown = (e) => {
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
      dragging: false,
    };
  };
  const handlePointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.dragging && Math.hypot(dx, dy) > 6) {
      drag.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (drag.dragging) {
      setOffset({ x: drag.originX + dx, y: drag.originY + dy });
    }
  };
  const handlePointerUp = (e) => {
    const drag = dragRef.current;
    if (drag?.dragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
  };

  // The canvas point currently sitting at the viewport's center — every
  // word's fog opacity is measured against this point, recomputed on drag.
  const focus = { x: viewportWidth / 2 - offset.x, y: VIEWPORT_HEIGHT / 2 - offset.y };

  return (
    <div className="screen" style={{ padding: '0 0 calc(64px + var(--safe-bottom)) 0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 24px 16px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`dot ${i === 3 ? 'active' : ''}`} />
          ))}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.3, marginBottom: 10 }}>
          這個感受<br />有名字嗎？
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7 }}>
            你現在有幾個感受嗎？最多挑兩個。
          </p>
          <button
            style={{ flexShrink: 0, fontSize: 12, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)', fontWeight: 500, textDecoration: 'underline' }}
            onClick={() => {
              updateSession({ candidateWords: [], emotionWord: null });
              navigate('/check/srwne');
            }}
          >
            跳過
          </button>
        </div>
      </div>

      {/* Fog canvas — drag to pan */}
      <div
        ref={viewportRef}
        style={{ position: 'relative', height: VIEWPORT_HEIGHT, flexShrink: 0, overflow: 'hidden', touchAction: 'none', cursor: 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          {/* User's affect-coordinate marker, with a faint halo */}
          <div
            style={{
              position: 'absolute',
              left: centerPos.x,
              top: centerPos.y,
              width: 140,
              height: 140,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${withAlpha(centerColor, 0.16)} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: centerPos.x,
              top: centerPos.y,
              width: 10,
              height: 10,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              background: centerColor,
              pointerEvents: 'none',
            }}
          />

          {words.map(({ word: w, color, size, x, y }) => {
            const isSel = selected.some(s => s.id === w.id);
            const disabled = selected.length >= 2 && !isSel;
            const dist = Math.hypot(x - focus.x, y - focus.y);
            const opacity = disabled ? 0.06 : fogOpacity(dist);
            const centerAlpha = isSel ? 0.40 : 0.25;

            return (
              <div
                key={w.id}
                onClick={() => !disabled && toggleWord(w)}
                style={{
                  position: 'absolute',
                  left: x - size / 2,
                  top: y - size / 2,
                  width: size,
                  height: size,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${withAlpha(color, centerAlpha)} 0%, ${withAlpha(color, 0.08)} 55%, transparent 100%)`,
                  color,
                  fontSize: isSel ? 17 : 15,
                  fontWeight: isSel ? 700 : 400,
                  fontFamily: 'var(--font-serif)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  border: 'none',
                  outline: 'none',
                  opacity,
                  pointerEvents: disabled ? 'none' : 'auto',
                  cursor: disabled ? 'default' : 'pointer',
                  userSelect: 'none',
                  transition: 'opacity 0.25s, font-size 0.15s, background 0.2s',
                }}
              >
                {w.word}
              </div>
            );
          })}
        </div>

        {/* Edge labels — fixed to the viewport, not the panning canvas */}
        <div style={{ ...EDGE_LABEL_STYLE, top: 10, left: 0, right: 0, textAlign: 'center' }}>能量高</div>
        <div style={{ ...EDGE_LABEL_STYLE, bottom: 10, left: 0, right: 0, textAlign: 'center' }}>能量低</div>
        <div style={{ ...EDGE_LABEL_STYLE, left: 10, top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl' }}>感覺不好</div>
        <div style={{ ...EDGE_LABEL_STYLE, right: 10, top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl' }}>感覺好</div>
      </div>

      <p style={{ opacity: 0.32, fontSize: 11, textAlign: 'center', fontFamily: 'var(--font-sans)', color: 'var(--ink)', margin: '10px 0 0' }}>
        拖曳畫布，撥開情緒的霧
      </p>

      {/* Definition card */}
      {selected.length > 0 && (
        <div
          className="fade-up"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 'calc(64px + var(--safe-bottom))',
            maxWidth: 480,
            margin: '0 auto',
            background: '#fff',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
            borderBottom: 'none',
            padding: '20px 20px calc(20px + var(--safe-bottom))',
            zIndex: 60,
          }}
        >
          {selected.length === 1 ? (
            <>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--forest)', marginBottom: 6 }}>
                {selected[0].word}
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7, marginBottom: 16 }}>
                {selected[0].def}
              </p>
              <button className="btn-primary" onClick={() => confirm(selected[0], selected)}>
                選這個 →
              </button>
            </>
          ) : (
            <>
              {selected.map(w => (
                <div key={w.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--forest)', marginBottom: 4 }}>
                    {w.word}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7 }}>
                    {w.def}
                  </p>
                </div>
              ))}
              <p style={{ fontSize: 13, color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontWeight: 700, margin: '8px 0 12px' }}>
                這兩個感受，哪一個現在更強？
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {selected.map(w => (
                  <button
                    key={w.id}
                    className="btn-primary"
                    style={{ flex: 1, background: getQuadrantInfo(w).color }}
                    onClick={() => confirm(w, selected)}
                  >
                    {w.word}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
