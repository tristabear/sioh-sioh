/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SRWNE_PROMPTS } from '../data/emotions';

export default function SRWNEScreen() {
  const navigate = useNavigate();
  const { session, updateSession } = useApp();
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  // Only show SRWNE if negative valence
  const isNegative = session.affectCoord?.valence < -0.1;

  const prompt = SRWNE_PROMPTS[step];

  const handleAnswer = (optionId, type) => {
    const next = { ...answers, [prompt.id]: { optionId, type } };
    setAnswers(next);

    if (step < SRWNE_PROMPTS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      // Calculate result
      const types = Object.values(next).map(a => a.type);
      const controlled = types.filter(t => t === 'controlled').length;
      const autonomous = types.filter(t => t === 'autonomous').length;
      let result = 'neutral';
      if (controlled > autonomous) result = 'controlled';
      else if (autonomous > controlled) result = 'autonomous';
      updateSession({ srwneResult: result });
      navigate('/check/savoring');
    }
  };

  if (!isNegative) {
    // Skip SRWNE for positive/neutral states — go straight to savoring
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', minHeight: '70dvh', padding: '52px 24px 100px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20, textAlign: 'center' }}>🌿</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.3, marginBottom: 12, textAlign: 'center' }}>
            看起來你現在<br />還不錯
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, textAlign: 'center', marginBottom: 32 }}>
            這種感覺值得好好留住。<br />讓我們把它記下來。
          </p>
          <button className="btn-primary" onClick={() => { updateSession({ srwneResult: null }); navigate('/check/savoring'); }}>
            繼續 →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ padding: '0 0 100px 0' }}>
      <div style={{ padding: '52px 24px 20px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`dot ${i === 4 ? 'active' : ''}`} />
          ))}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.4, marginBottom: 10 }}>
          多了解一下<br />這個感受
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7 }}>
          沒有對錯，只是幫你更認識自己。
        </p>
      </div>

      {/* Progress */}
      <div style={{ padding: '0 24px 20px', display: 'flex', gap: 6 }}>
        {SRWNE_PROMPTS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? 'var(--clay)' : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* Question */}
      <div key={step} className="fade-up" style={{ padding: '0 24px' }}>
        <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid var(--clay)' }}>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.6 }}>
            {prompt.question}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {prompt.options.map((opt, i) => (
            <button
              key={opt.id}
              className="fade-up"
              style={{
                animationDelay: `${i * 0.06}s`,
                opacity: 0,
                padding: '16px 20px',
                borderRadius: 'var(--radius-sm)',
                background: answers[prompt.id]?.optionId === opt.id ? 'var(--forest)' : '#fff',
                color: answers[prompt.id]?.optionId === opt.id ? '#fff' : 'var(--ink)',
                border: `1.5px solid ${answers[prompt.id]?.optionId === opt.id ? 'var(--forest)' : 'var(--border)'}`,
                textAlign: 'left',
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
                fontWeight: answers[prompt.id]?.optionId === opt.id ? 700 : 300,
                lineHeight: 1.6,
                transition: 'all 0.18s',
              }}
              onClick={() => handleAnswer(opt.id, opt.type)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
