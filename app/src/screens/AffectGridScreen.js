/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { QUADRANTS } from '../data/emotions';

export default function AffectGridScreen() {
  const navigate = useNavigate();
  const { updateSession, session } = useApp();
  const [selected, setSelected] = useState(() => {
    const c = session.affectCoord;
    if (!c) return null;
    return QUADRANTS.find(q => Math.sign(q.valence) === Math.sign(c.valence) && Math.sign(q.arousal) === Math.sign(c.arousal)) || null;
  });

  const needsRescue = selected?.id === 'HA_NEG';

  return (
    <div className="screen" style={{ padding: '0 0 100px 0' }}>
      <div style={{ padding: '52px 24px 20px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`dot ${i === 2 ? 'active' : ''}`} />
          ))}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.3, marginBottom: 10 }}>
          你的感受<br />比較接近哪一種？
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7 }}>
          選一個最接近的方向，不需要精確。
        </p>
      </div>

      {/* Quadrant picker */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ position: 'relative' }}>
          {/* Axis labels */}
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)', marginBottom: 6 }}>能量高</div>
          <div style={{ position: 'relative', margin: '0 26px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12, aspectRatio: '1 / 1' }}>
            {QUADRANTS.map((q, i) => {
              const isSel = selected?.id === q.id;
              const dimmed = selected && !isSel;
              const [line1, line2] = q.label.split('・');
              return (
                <button
                  key={q.id}
                  onClick={() => setSelected(q)}
                  className="quad-breathe"
                  style={{
                    '--del': `${-i}s`,
                    '--glow': `${q.color}${isSel ? '88' : '59'}`,
                    aspectRatio: '1 / 1',
                    borderRadius: '50%',
                    border: isSel ? '3px solid #fff' : '3px solid transparent',
                    background: q.color,
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1.5,
                    cursor: 'pointer',
                    opacity: dimmed ? 0.5 : 1,
                    transition: 'opacity 0.25s, border-color 0.25s',
                  }}
                >
                  {line1}<br />{line2}
                </button>
              );
            })}
            <div style={{ position: 'absolute', left: -22, top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl', fontSize: 12, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)' }}>感覺不好</div>
            <div style={{ position: 'absolute', right: -22, top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl', fontSize: 12, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)' }}>感覺好</div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)', marginTop: 6 }}>能量低</div>
        </div>
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <button
          className="btn-primary"
          disabled={!selected}
          onClick={() => {
            updateSession({ affectCoord: { valence: selected.valence, arousal: selected.arousal } });
            navigate(needsRescue ? '/rescue' : '/check/emotion');
          }}
        >
          {needsRescue ? '先來一分鐘呼吸 →' : '繼續 →'}
        </button>
        {selected && (
          <button className="btn-secondary" style={{ marginTop: 10 }} onClick={() => setSelected(null)}>
            重置
          </button>
        )}
      </div>
    </div>
  );
}
