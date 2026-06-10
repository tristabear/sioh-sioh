/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EMOTION_WORDS } from '../data/emotions';

export default function EmotionScreen() {
  const navigate = useNavigate();
  const { session, updateSession } = useApp();
  const [selected, setSelected] = useState(session.emotionWord || null);

  // Show only words from the same quadrant as the user's affect choice
  const coord = session.affectCoord || { valence: 0, arousal: 0 };
  const displayWords = EMOTION_WORDS
    .filter(w => (w.valence >= 0) === (coord.valence >= 0) && (w.arousal >= 0) === (coord.arousal >= 0))
    .sort((a, b) => {
      const distA = Math.hypot(a.valence - coord.valence, a.arousal - coord.arousal);
      const distB = Math.hypot(b.valence - coord.valence, b.arousal - coord.arousal);
      return distA - distB;
    });

  const getWordColor = (word) => {
    if (word.valence < -0.3 && word.arousal > 0.3) return 'var(--clay)';
    if (word.valence > 0.3 && word.arousal > 0.3) return 'var(--sage)';
    if (word.valence < -0.3 && word.arousal < -0.3) return 'var(--light-muted)';
    return 'var(--forest)';
  };

  return (
    <div className="screen" style={{ padding: '0 0 100px 0' }}>
      <div style={{ padding: '52px 24px 20px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`dot ${i === 3 ? 'active' : ''}`} />
          ))}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.3, marginBottom: 10 }}>
          這個感受<br />有名字嗎？
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7 }}>
          選一個最接近的詞。光是命名這個動作，就能讓大腦慢慢穩定下來。
        </p>
      </div>

      {/* Words matching the chosen quadrant */}
      <div style={{ padding: '4px 20px 16px' }}>
        <div style={{ fontSize: 12, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 12 }}>
          符合這個感受的詞
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {displayWords.map((w, i) => {
            const color = getWordColor(w);
            const isSel = selected?.id === w.id;
            return (
              <button
                key={w.id}
                className="fade-up"
                style={{
                  animationDelay: `${i * 0.035}s`,
                  padding: '10px 18px',
                  borderRadius: 40,
                  fontSize: 15,
                  fontFamily: 'var(--font-sans)',
                  fontWeight: isSel ? 700 : 400,
                  background: isSel ? color : '#fff',
                  color: isSel ? '#fff' : 'var(--ink)',
                  border: `1.5px solid ${isSel ? color : 'var(--border)'}`,
                  transition: 'all 0.18s',
                  boxShadow: isSel ? `0 4px 14px ${color}44` : 'none',
                }}
                onClick={() => setSelected(isSel ? null : w)}
              >
                {w.word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected display */}
      {selected && (
        <div className="fade-up" style={{ margin: '0 20px 20px', padding: '16px 20px', background: 'var(--forest)', borderRadius: 'var(--radius-sm)', color: '#faf7f2' }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>{selected.word}</div>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-sans)', opacity: 0.65, fontWeight: 300 }}>
            光是說出這個字，你的大腦就已經在幫你調節了。
          </div>
        </div>
      )}

      <div style={{ padding: '0 20px' }}>
        <button
          className="btn-primary"
          disabled={!selected}
          onClick={() => {
            updateSession({ emotionWord: selected });
            navigate('/check/srwne');
          }}
        >
          繼續 →
        </button>
        <button
          className="btn-secondary"
          style={{ marginTop: 10 }}
          onClick={() => {
            updateSession({ emotionWord: null });
            navigate('/check/srwne');
          }}
        >
          跳過，繼續下一步
        </button>
      </div>
    </div>
  );
}
