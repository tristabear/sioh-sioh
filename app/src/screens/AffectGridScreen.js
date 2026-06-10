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
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)', marginBottom: 6 }}>強烈</div>
          <div style={{ position: 'relative', margin: '0 26px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12, aspectRatio: '1 / 1' }}>
            {QUADRANTS.map(q => {
              const isSel = selected?.id === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setSelected(q)}
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${isSel ? q.color : 'var(--border)'}`,
                    background: isSel ? q.color : '#fff',
                    color: isSel ? '#fff' : 'var(--ink)',
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                    boxShadow: isSel ? `0 4px 14px ${q.color}44` : 'none',
                  }}
                >
                  {q.label}
                </button>
              );
            })}
            <div style={{ position: 'absolute', left: -22, top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl', fontSize: 12, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)' }}>負面</div>
            <div style={{ position: 'absolute', right: -22, top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl', fontSize: 12, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)' }}>正面</div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(90,82,72,0.5)', fontFamily: 'var(--font-sans)', marginTop: 6 }}>平靜</div>
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
