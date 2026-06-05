/* eslint-disable */
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AffectGridScreen() {
  const navigate = useNavigate();
  const { updateSession, session } = useApp();
  const gridRef = useRef(null);
  const [coord, setCoord] = useState(session.affectCoord || null);
  const [dragging, setDragging] = useState(false);

  const SIZE = 300;
  const RADIUS = SIZE / 2;


  const getCoordFromEvent = useCallback((e) => {
    const rect = gridRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.max(0, Math.min(SIZE, clientX - rect.left));
    const y = Math.max(0, Math.min(SIZE, clientY - rect.top));
    // Convert to -1..1 range; x=valence, y=arousal (inverted, top=high)
    return {
      valence: parseFloat(((x / SIZE) * 2 - 1).toFixed(2)),
      arousal: parseFloat((1 - (y / SIZE) * 2).toFixed(2)),
    };
  }, []);

  const handleMove = useCallback((e) => {
    if (!dragging && e.type !== 'click') return;
    e.preventDefault();
    setCoord(getCoordFromEvent(e));
  }, [dragging, getCoordFromEvent]);

  const handleStart = useCallback((e) => {
    setDragging(true);
    setCoord(getCoordFromEvent(e));
  }, [getCoordFromEvent]);

  const handleEnd = useCallback(() => setDragging(false), []);

  const dotX = coord ? ((coord.valence + 1) / 2) * SIZE : null;
  const dotY = coord ? ((1 - coord.arousal) / 2) * SIZE : null;

  const getQuadrantLabel = () => {
    if (!coord) return null;
    const { valence, arousal } = coord;
    // x-axis (coord.valence) = arousal (left=calm, right=activated)
    // y-axis (coord.arousal) = valence (top=pleasant, bottom=unpleasant)
    if (valence < -0.2 && arousal > 0.2) return { text: '平靜 / 滿足', color: '#1c2b24' };
    if (valence > 0.2 && arousal > 0.2) return { text: '興奮 / 活躍', color: '#7aae8e' };
    if (valence < -0.2 && arousal < -0.2) return { text: '消沉 / 疲憊', color: '#8a7a6a' };
    if (valence > 0.2 && arousal < -0.2) return { text: '緊張 / 焦慮', color: '#c97d50' };
    return { text: '中性', color: '#8a7a6a' };
  };

  const label = getQuadrantLabel();
  const needsRescue = coord && coord.arousal < -0.3 && coord.valence > 0.2;

  return (
    <div className="screen" style={{ padding: '0 0 100px 0' }}>
      <div style={{ padding: '52px 24px 20px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`dot ${i === 2 ? 'active' : ''}`} />
          ))}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.3, marginBottom: 10 }}>
          你的感受<br />在哪個位置？
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7 }}>
          點一個點，不需要精確。只是大概的位置就好。
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px 16px' }}>
        <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
          {/* Axis labels */}
          <div style={{ position: 'absolute', top: '50%', left: 4, transform: 'translateY(-50%)', fontSize: 10, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)', writingMode: 'vertical-rl', textAlign: 'center' }}>平靜</div>
          <div style={{ position: 'absolute', top: '50%', right: 4, transform: 'translateY(-50%)', fontSize: 10, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)', writingMode: 'vertical-rl', textAlign: 'center' }}>激動</div>
          <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)' }}>不舒服</div>
          <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)' }}>舒服</div>

          {/* Fog canvas */}
          <svg
            ref={gridRef}
            width={SIZE} height={SIZE}
            style={{ borderRadius: '50%', cursor: 'crosshair', touchAction: 'none', display: 'block' }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onClick={handleMove}
          >
            <defs>
              <radialGradient id="fog" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F4F1EA" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d9c8b8" stopOpacity="0.88" />
              </radialGradient>
              {/* Quadrant fills */}
              <linearGradient id="q-tl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3A6B7E" stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="q-tr" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C86F59" stopOpacity="0.18" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="q-bl" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2d5566" stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="q-br" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#D9A05B" stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* Background circle */}
            <circle cx={RADIUS} cy={RADIUS} r={RADIUS} fill="url(#fog)" />
            {/* Quadrant tints */}
            <path d={`M${RADIUS},${RADIUS} L${RADIUS},0 A${RADIUS},${RADIUS} 0 0,1 ${SIZE},${RADIUS} Z`} fill="url(#q-tl)" />
            <path d={`M${RADIUS},${RADIUS} L0,${RADIUS} A${RADIUS},${RADIUS} 0 0,1 ${RADIUS},0 Z`} fill="url(#q-tr)" />
            <path d={`M${RADIUS},${RADIUS} L${SIZE},${RADIUS} A${RADIUS},${RADIUS} 0 0,1 ${RADIUS},${SIZE} Z`} fill="url(#q-bl)" />
            <path d={`M${RADIUS},${RADIUS} L${RADIUS},${SIZE} A${RADIUS},${RADIUS} 0 0,1 0,${RADIUS} Z`} fill="url(#q-br)" />

            {/* Cross hair */}
            <line x1={RADIUS} y1={10} x2={RADIUS} y2={SIZE-10} stroke="rgba(58,107,126,0.2)" strokeWidth="1" strokeDasharray="4,4" />
            <line x1={10} y1={RADIUS} x2={SIZE-10} y2={RADIUS} stroke="rgba(58,107,126,0.2)" strokeWidth="1" strokeDasharray="4,4" />

            {/* Dot */}
            {dotX !== null && (
              <>
                <circle cx={dotX} cy={dotY} r={22} fill="rgba(28,43,36,0.12)" />
                <circle
                  cx={dotX} cy={dotY} r={14}
                  fill="var(--forest)"
                  stroke="#fff" strokeWidth="3"
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}
                />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Quadrant label */}
      <div style={{ textAlign: 'center', minHeight: 32, marginBottom: 8 }}>
        {label && (
          <span style={{
            display: 'inline-block',
            background: label.color + '18',
            color: label.color,
            border: `1px solid ${label.color}35`,
            borderRadius: 20, padding: '5px 16px',
            fontSize: 13, fontFamily: 'var(--font-sans)', fontWeight: 700,
          }}>
            {label.text}
          </span>
        )}
      </div>

      {/* Rescue hint */}
      {needsRescue && (
        <div style={{ margin: '0 20px 16px', padding: '12px 16px', background: 'rgba(201,125,80,0.1)', borderRadius: 12, border: '1px solid rgba(201,125,80,0.3)' }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-sans)', color: 'var(--clay)', fontWeight: 500, lineHeight: 1.6 }}>
            🌬️ 你現在壓力很大——接下來我們先做一分鐘呼吸，再繼續其他步驟。
          </div>
        </div>
      )}

      <div style={{ padding: '8px 20px 0' }}>
        <button
          className="btn-primary"
          disabled={!coord}
          onClick={() => {
            updateSession({ affectCoord: coord });
            navigate(needsRescue ? '/rescue' : '/check/emotion');
          }}
        >
          {needsRescue ? '先來一分鐘呼吸 →' : '繼續 →'}
        </button>
        {coord && (
          <button className="btn-secondary" style={{ marginTop: 10 }} onClick={() => setCoord(null)}>
            重置
          </button>
        )}
      </div>
    </div>
  );
}
