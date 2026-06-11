/* eslint-disable */
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getQuadrantInfo } from '../utils/media';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { history } = useApp();
  const today = new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '早安' : hour < 18 ? '午安' : '晚安';

  return (
    <div className="screen" style={{ padding: '0 0 100px 0' }}>
      {/* Header — full-bleed breakout */}
      <div style={{
        background: 'var(--forest)',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(200,111,89,0.18)',
        }} />
        <div style={{
          position: 'absolute', right: 40, top: 30,
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(58,107,126,0.15)',
        }} />
        {/* Inner content constrained to 480px */}
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '56px 28px 36px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #C8A579 0%, #BE8374 100%)',
            marginBottom: 20,
            animation: 'pulse 4s ease-in-out infinite',
          }} />
          <div style={{ fontSize: 13, color: 'rgba(250,247,242,0.55)', fontFamily: 'var(--font-sans)', marginBottom: 6 }}>
            {today}
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#faf7f2', letterSpacing: 2, marginBottom: 6 }}>
            {greeting}，惜惜你 🌿
          </div>
          <div style={{ fontSize: 14, color: 'rgba(250,247,242,0.65)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            你現在身體有什麼感覺？
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Main CTA */}
        <div className="card fade-up" style={{ borderTop: '4px solid var(--clay)' }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>開始今天的練習</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>
            從身體感受出發，陪你認識現在的情緒狀態。約 3–5 分鐘。
          </div>
          <button className="btn-primary" onClick={() => navigate('/check/somatic')}>
            開始 →
          </button>
        </div>

        {/* Quick rescue */}
        <div
          className="card fade-up stagger-1"
          onClick={() => navigate('/rescue')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid var(--sage)' }}
        >
          <div style={{ fontSize: 36 }}>🌬️</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>急需呼吸</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
              壓力很大？先來一分鐘的生理嘆息
            </div>
          </div>
        </div>

        {/* Recent mood */}
        {history.length > 0 && (
          <div className="card fade-up stagger-2" style={{ borderLeft: '4px solid var(--sand)' }}>
            <div style={{ fontSize: 12, color: 'var(--sand)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 12 }}>
              上一次練習
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <MoodDot coord={history[0].affectCoord} size={40} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>
                  {history[0].emotionWord?.word || '已完成練習'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)' }}>
                  {new Date(history[0].timestamp).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {history.length >= 3 && (
          <div className="card fade-up stagger-3">
            <div style={{ fontSize: 12, color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 14 }}>
              你的情緒軌跡
            </div>
            <MoodHistory history={history.slice(0, 7)} />
          </div>
        )}
      </div>
    </div>
  );
}

function MoodDot({ coord, size = 32 }) {
  if (!coord) return <div style={{ width: size, height: size, borderRadius: '50%', background: '#eee' }} />;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: getQuadrantInfo(coord).color,
      flexShrink: 0,
    }} />
  );
}

function MoodHistory({ history }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      {history.map((entry, i) => (
        <div key={entry.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <MoodDot coord={entry.affectCoord} size={28} />
          <div style={{ fontSize: 12, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)' }}>
            {new Date(entry.timestamp).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })}
          </div>
        </div>
      ))}
    </div>
  );
}
