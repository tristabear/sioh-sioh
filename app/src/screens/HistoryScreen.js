/* eslint-disable */
import { useApp } from '../context/AppContext';

export default function HistoryScreen() {
  const { history } = useApp();

  if (history.length === 0) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', minHeight: '70dvh', padding: '52px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--forest)', marginBottom: 12 }}>練習記錄</h1>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 56 }}>🌱</div>
          <p style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.8 }}>
            還沒有記錄。<br />完成第一次練習之後，<br />你的情緒軌跡會出現在這裡。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ padding: '52px 0 100px' }}>
      <div style={{ padding: '0 24px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--forest)', marginBottom: 4 }}>練習記錄</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>共 {history.length} 次練習</p>
      </div>

      {/* Mini mood chart */}
      {history.length >= 3 && (
        <div style={{ padding: '0 24px 24px' }}>
          <div className="card">
            <div style={{ fontSize: 11, color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 14 }}>情緒軌跡</div>
            <MoodChart history={history.slice(0, 14).reverse()} />
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {history.map((entry, i) => (
          <EntryCard key={entry.id} entry={entry} index={i} />
        ))}
      </div>
    </div>
  );
}

function EntryCard({ entry, index }) {
  const date = new Date(entry.timestamp);
  const coord = entry.affectCoord;
  const hue = coord ? Math.round((coord.valence + 1) * 60 + 160) : 200;
  const light = coord ? Math.round(45 + coord.arousal * 15) : 55;
  const dotColor = `hsl(${hue}, 55%, ${light}%)`;

  return (
    <div className={`card fade-up`} style={{ animationDelay: `${index * 0.04}s`, opacity: 0, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: dotColor, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            {entry.emotionWord?.word || '無命名'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)', textAlign: 'right' }}>
            {date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}<br />
            {date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {entry.symptoms?.slice(0,3).map(s => (
            <span key={s} style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'var(--muted)', background: 'var(--cream)', padding: '3px 8px', borderRadius: 20, border: '1px solid var(--border)' }}>
              {s}
            </span>
          ))}
          {entry.srwneResult && (
            <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: entry.srwneResult === 'autonomous' ? 'var(--sage)' : 'var(--clay)', background: entry.srwneResult === 'autonomous' ? 'rgba(58,107,126,0.12)' : 'rgba(200,111,89,0.12)', padding: '3px 8px', borderRadius: 20 }}>
              {entry.srwneResult === 'autonomous' ? '自主選擇' : entry.srwneResult === 'controlled' ? '被迫沉默' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MoodChart({ history }) {
  const W = 280, H = 80;
  const pts = history.map((e, i) => {
    const x = (i / Math.max(history.length - 1, 1)) * W;
    const y = e.affectCoord ? H - ((e.affectCoord.valence + 1) / 2) * H : H / 2;
    return `${x},${y}`;
  });

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {pts.length > 1 && (
        <polyline
          points={pts.join(' ')}
          fill="none"
          stroke="var(--sage)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {pts.map((pt, i) => {
        const [x, y] = pt.split(',').map(Number);
        return <circle key={i} cx={x} cy={y} r={4} fill="var(--sage)" />;
      })}
    </svg>
  );
}
