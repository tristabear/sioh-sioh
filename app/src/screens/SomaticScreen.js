/* eslint-disable */
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SOMATIC_SYMPTOMS } from '../data/emotions';

export default function SomaticScreen() {
  const navigate = useNavigate();
  const { session, updateSession } = useApp();
  const selected = session.symptoms || [];

  const toggle = (id) => {
    if (id === 'none') {
      updateSession({ symptoms: selected.includes('none') ? [] : ['none'] });
      return;
    }
    const without = selected.filter(s => s !== 'none');
    if (without.includes(id)) {
      updateSession({ symptoms: without.filter(s => s !== id) });
    } else {
      updateSession({ symptoms: [...without, id] });
    }
  };

  const canContinue = selected.length > 0;

  return (
    <div className="screen" style={{ padding: '0 0 100px 0' }}>
      {/* Header */}
      <div style={{ padding: '52px 24px 24px', background: 'var(--cream)' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`dot ${i === 1 ? 'active' : ''}`} />
          ))}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.3, marginBottom: 10 }}>
          你現在身體<br />有什麼感覺？
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.8 }}>
          從身體開始。選一個或多個你現在感受到的狀態。
        </p>
      </div>

      {/* Symptom grid */}
      <div style={{ padding: '8px 20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {SOMATIC_SYMPTOMS.map((s, i) => (
          <button
            key={s.id}
            className={`chip fade-up ${selected.includes(s.id) ? 'selected' : 'unselected'}`}
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animationDelay: `${i * 0.04}s`,
              opacity: 0,
              width: '100%',
              justifyContent: 'flex-start',
              ...(selected.includes(s.id) && s.id !== 'none' ? {
                background: 'var(--forest)',
                borderColor: 'var(--forest)',
              } : {}),
              ...(selected.includes(s.id) && s.id === 'none' ? {
                background: 'var(--sage)',
                borderColor: 'var(--sage)',
              } : {}),
            }}
            onClick={() => toggle(s.id)}
          >
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <span style={{ fontSize: 13, fontWeight: selected.includes(s.id) ? 700 : 400 }}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Continue */}
      <div style={{ padding: '0 20px' }}>
        <button
          className="btn-primary"
          disabled={!canContinue}
          onClick={() => navigate('/check/affect')}
        >
          繼續 →
        </button>
      </div>
    </div>
  );
}
