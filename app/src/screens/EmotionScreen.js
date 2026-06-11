/* eslint-disable */
import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EMOTION_WORDS } from '../data/emotions';
import { getQuadrantInfo } from '../utils/media';

const CELL_W = 340;
const CELL_H = 210;
const FONT_SIZE = 14;

// Four quadrants of Russell's circumplex, matching AffectGridScreen's
// 2x2 layout: high-arousal row on top, negative valence on the left.
// Each cell aligns its words toward the canvas center so the four
// groups read as one tight cluster instead of four separate corners.
const QUADRANT_DEFS = [
  { id: 'HA_NEG', test: w => w.valence < 0 && w.arousal >= 0, justify: 'flex-end', align: 'flex-end' },
  { id: 'HA_POS', test: w => w.valence >= 0 && w.arousal >= 0, justify: 'flex-start', align: 'flex-end' },
  { id: 'LA_NEG', test: w => w.valence < 0 && w.arousal < 0, justify: 'flex-end', align: 'flex-start' },
  { id: 'LA_POS', test: w => w.valence >= 0 && w.arousal < 0, justify: 'flex-start', align: 'flex-start' },
];

export default function EmotionScreen() {
  const navigate = useNavigate();
  const { session, updateSession } = useApp();
  const coord = session.affectCoord || { valence: 0, arousal: 0 };
  const [selected, setSelected] = useState([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);
  const dragRef = useRef(null);

  // Group words by quadrant (same quadrant = same cluster), sorted so the
  // words closest to affectCoord come first within their quadrant.
  const quadrants = useMemo(() => {
    const withMeta = EMOTION_WORDS.map(w => {
      const dist = Math.hypot(w.valence - coord.valence, w.arousal - coord.arousal);
      return { word: w, dist, color: getQuadrantInfo(w).color };
    });

    return QUADRANT_DEFS.map(q => ({
      ...q,
      words: withMeta.filter(m => q.test(m.word)).sort((a, b) => a.dist - b.dist),
    }));
  }, [coord.valence, coord.arousal]);

  // Center the canvas on the quadrant containing affectCoord.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const activeIndex = QUADRANT_DEFS.findIndex(q => q.test(coord));
    const col = activeIndex % 2;
    const row = Math.floor(activeIndex / 2);
    const cellCenterX = col * CELL_W + CELL_W / 2;
    const cellCenterY = row * CELL_H + CELL_H / 2;
    setOffset({ x: rect.width / 2 - cellCenterX, y: rect.height / 2 - cellCenterY });
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

  return (
    <div className="screen" style={{ padding: '0 0 calc(64px + var(--safe-bottom)) 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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

      {/* Word canvas — drag to pan */}
      <div
        ref={viewportRef}
        style={{ position: 'relative', flex: 1, minHeight: 280, overflow: 'hidden', touchAction: 'none', cursor: 'grab' }}
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
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            display: 'grid',
            gridTemplateColumns: `${CELL_W}px ${CELL_W}px`,
            gridTemplateRows: `${CELL_H}px ${CELL_H}px`,
            width: CELL_W * 2,
            height: CELL_H * 2,
          }}
        >
          {quadrants.map(q => (
            <div
              key={q.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignContent: q.align,
                alignItems: 'flex-start',
                justifyContent: q.justify,
                gap: '3px 6px',
                padding: 10,
              }}
            >
              {q.words.map(({ word: w, color }) => {
                const isSel = selected.some(s => s.id === w.id);
                const disabled = selected.length >= 2 && !isSel;

                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWord(w)}
                    style={{
                      fontSize: FONT_SIZE,
                      lineHeight: 1.3,
                      fontFamily: 'var(--font-sans)',
                      fontWeight: isSel ? 700 : 400,
                      color,
                      whiteSpace: 'nowrap',
                      padding: '3px 8px',
                      borderRadius: 14,
                      background: isSel ? `${color}26` : 'transparent',
                      border: isSel ? `1px solid ${color}` : '1px solid transparent',
                      opacity: disabled ? 0.25 : 1,
                      pointerEvents: disabled ? 'none' : 'auto',
                      transition: 'opacity 0.18s, background 0.18s, border 0.18s',
                    }}
                  >
                    {w.word}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

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
