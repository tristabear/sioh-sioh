/* eslint-disable */
import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EMOTION_WORDS } from '../data/emotions';

const SCALE = 260; // px per valence/arousal unit

function getWordColor(word) {
  if (word.valence < -0.3 && word.arousal > 0.3) return 'var(--clay)';
  if (word.valence > 0.3 && word.arousal > 0.3) return 'var(--sage)';
  if (word.valence < -0.3 && word.arousal < -0.3) return 'var(--light-muted)';
  return 'var(--forest)';
}

export default function EmotionScreen() {
  const navigate = useNavigate();
  const { session, updateSession } = useApp();
  const coord = session.affectCoord || { valence: 0, arousal: 0 };
  const [selected, setSelected] = useState([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const dragRef = useRef(null);

  const maxDist = useMemo(() => {
    return EMOTION_WORDS.reduce((max, w) => {
      const d = Math.hypot(w.valence - coord.valence, w.arousal - coord.arousal);
      return d > max ? d : max;
    }, 0) || 1;
  }, [coord.valence, coord.arousal]);

  const toggleWord = (w) => {
    setSelected(prev => {
      const isSel = prev.some(s => s.id === w.id);
      if (isSel) return prev.filter(s => s.id !== w.id);
      if (prev.length >= 2) return prev;
      return [...prev, w];
    });
  };

  const confirm = (word, otherWord) => {
    updateSession({ emotionWords: otherWord ? [word, otherWord] : [word] });
    navigate('/check/srwne');
  };

  const handlePointerDown = (e) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y };
    canvasRef.current?.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset({ x: dragRef.current.originX + dx, y: dragRef.current.originY + dy });
  };
  const handlePointerUp = () => { dragRef.current = null; };

  const translateX = offset.x - coord.valence * SCALE;
  const translateY = offset.y + coord.arousal * SCALE;

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
              updateSession({ emotionWords: [] });
              navigate('/check/srwne');
            }}
          >
            跳過
          </button>
        </div>
      </div>

      {/* Bubble canvas */}
      <div
        ref={canvasRef}
        style={{ position: 'relative', flex: 1, minHeight: 280, overflow: 'hidden', touchAction: 'none', cursor: 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(${translateX}px, ${translateY}px)` }}>
          {EMOTION_WORDS.map((w, i) => {
            const dist = Math.hypot(w.valence - coord.valence, w.arousal - coord.arousal);
            const t = Math.min(1, dist / maxDist);
            const fontSize = 16 - t * 6; // 16 → 10
            const opacity = 1 - t * 0.6; // 1 → 0.4
            const size = Math.round(fontSize * 3);
            const color = getWordColor(w);
            const isSel = selected.some(s => s.id === w.id);
            const disabled = selected.length >= 2 && !isSel;
            const x = w.valence * SCALE;
            const y = -w.arousal * SCALE;

            return (
              <button
                key={w.id}
                onClick={() => toggleWord(w)}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: `translate(-50%, -50%) scale(${isSel ? 1.15 : 1})`,
                  zIndex: isSel ? 2 : 1,
                  minWidth: size,
                  minHeight: size,
                  padding: '4px 8px',
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  fontSize,
                  fontFamily: 'var(--font-sans)',
                  fontWeight: isSel ? 700 : 400,
                  color: isSel ? '#fff' : 'var(--ink)',
                  background: isSel ? color : '#fff',
                  border: `1.5px solid ${color}`,
                  opacity: disabled ? 0.25 : opacity,
                  pointerEvents: disabled ? 'none' : 'auto',
                  boxShadow: isSel ? `0 4px 14px ${color}44` : 'none',
                  transition: 'opacity 0.18s, transform 0.18s, background 0.18s, color 0.18s',
                }}
              >
                {w.word}
              </button>
            );
          })}
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
              <button className="btn-primary" onClick={() => confirm(selected[0])}>
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
                {selected.map((w, i) => (
                  <button
                    key={w.id}
                    className="btn-primary"
                    style={{ flex: 1, background: getWordColor(w) }}
                    onClick={() => confirm(w, selected[1 - i])}
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
