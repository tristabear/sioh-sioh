/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SAVORING_STRATEGIES } from '../data/emotions';

const SRWNE_FEEDBACK = {
  controlled: {
    title: '你現在承受著很多',
    body: '你選擇了沉默，但那份重量還在身體裡。這不是你的錯——有時候環境讓我們沒有空間說出口。\n\n下一次，試著問自己：「我有沒有辦法用一個小動作，讓自己稍微輕鬆一點點？」',
    color: 'var(--clay)',
    icon: '🫂',
  },
  autonomous: {
    title: '你在用自己的方式照顧關係',
    body: '你選擇不說，是因為你在乎。這是一種成熟的力量，不是軟弱。\n\n惜惜你能做出這個選擇的自己。',
    color: 'var(--sage)',
    icon: '🪷',
  },
  neutral: {
    title: '情緒是複雜的',
    body: '你的感受不需要被完全分析清楚。有時候，能說出「我不確定」就已經是一種誠實。',
    color: 'var(--sand)',
    icon: '☯️',
  },
};

export default function SavoringScreen() {
  const navigate = useNavigate();
  const { session, saveSession } = useApp();
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [done, setDone] = useState(false);

  const srwne = session.srwneResult;
  const feedback = srwne ? SRWNE_FEEDBACK[srwne] : null;
  const isPositive = !srwne || session.affectCoord?.valence > 0.1;

  const handleFinish = () => {
    saveSession();
    setDone(true);
  };

  if (done) {
    return (
      <div className="screen fade-up" style={{ display: 'flex', flexDirection: 'column', minHeight: '80dvh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🌱</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--forest)', marginBottom: 12 }}>練習完成了</h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 32 }}>
            你今天惜惜了自己的心。<br />這一分鐘是值得的。
          </p>
          <button className="btn-primary" style={{ maxWidth: 280 }} onClick={() => navigate('/')}>
            回首頁
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
            <div key={i} className={`dot ${i === 5 ? 'active' : ''}`} />
          ))}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.3, marginBottom: 10 }}>
          最後一步
        </h1>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* SRWNE feedback */}
        {feedback && (
          <div className="card fade-up" style={{ borderLeft: `4px solid ${feedback.color}` }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{feedback.icon}</span>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{feedback.title}</div>
            </div>
            <p style={{ fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, whiteSpace: 'pre-line' }}>
              {feedback.body}
            </p>
          </div>
        )}

        {/* Savoring */}
        <div className="card fade-up stagger-1">
          <div style={{ fontSize: 13, color: isPositive ? 'var(--sage)' : 'var(--sand)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 12 }}>
            {isPositive ? '把這個好感受留住 ✨' : '給自己一個小小的禮物 🎁'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SAVORING_STRATEGIES.map((s, i) => (
              <button
                key={s.id}
                className="fade-up"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedStrategy === s.id ? 'var(--forest)' : '#fff',
                  color: selectedStrategy === s.id ? '#fff' : 'var(--ink)',
                  border: `1.5px solid ${selectedStrategy === s.id ? 'var(--forest)' : 'var(--border)'}`,
                  textAlign: 'left',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  transition: 'all 0.18s',
                }}
                onClick={() => setSelectedStrategy(selectedStrategy === s.id ? null : s.id)}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 300, opacity: 0.75 }}>{s.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary fade-up stagger-2" onClick={handleFinish}>
          完成今天的練習 ✓
        </button>
      </div>
    </div>
  );
}
