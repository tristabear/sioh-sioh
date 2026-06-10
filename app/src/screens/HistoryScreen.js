/* eslint-disable */
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SOMATIC_SYMPTOMS, QUADRANTS } from '../data/emotions';
import { getQuadrantInfo } from '../utils/media';

const SYMPTOM_LABELS = Object.fromEntries(SOMATIC_SYMPTOMS.map(s => [s.id, s.label]));

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
        <BackupSection />
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
            <div style={{ fontSize: 12, color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 14 }}>情緒軌跡</div>
            <MoodChart history={history.slice(0, 14).reverse()} />
            <QuadrantLegend />
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {history.map((entry, i) => (
          <EntryCard key={entry.id} entry={entry} index={i} />
        ))}
      </div>

      <div style={{ padding: '12px 24px 0' }}>
        <BackupSection />
      </div>
    </div>
  );
}

function EntryCard({ entry, index }) {
  const navigate = useNavigate();
  const date = new Date(entry.timestamp);
  const dotColor = getQuadrantInfo(entry.affectCoord).color;

  return (
    <div
      className={`card fade-up`}
      style={{ animationDelay: `${index * 0.04}s`, opacity: 0, display: 'flex', gap: 16, alignItems: 'flex-start', cursor: 'pointer' }}
      onClick={() => navigate(`/history/${entry.id}`)}
    >
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: dotColor, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            {entry.emotionWords?.map(w => w.word).join('、') || '無命名'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)', textAlign: 'right' }}>
            {date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}<br />
            {date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {entry.symptoms?.slice(0,3).map(s => (
            <span key={s} style={{ fontSize: 12, fontFamily: 'var(--font-sans)', color: 'var(--muted)', background: 'var(--cream)', padding: '3px 8px', borderRadius: 20, border: '1px solid var(--border)' }}>
              {SYMPTOM_LABELS[s] || s}
            </span>
          ))}
          {entry.srwneResult && (
            <span style={{ fontSize: 12, fontFamily: 'var(--font-sans)', color: entry.srwneResult === 'autonomous' ? 'var(--sage)' : 'var(--clay)', background: entry.srwneResult === 'autonomous' ? 'rgba(58,107,126,0.12)' : 'rgba(190,131,116,0.12)', padding: '3px 8px', borderRadius: 20 }}>
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
  const valenceToY = v => H - ((v + 1) / 2) * H;

  // Each point reflects the average of the emotion words picked that session
  // (falling back to the affect grid coordinate if no words were picked),
  // plus the valence range across those words to show how mixed the moment was.
  const points = history.map(e => {
    const words = e.emotionWords || [];
    if (words.length > 0) {
      const valences = words.map(w => w.valence);
      const arousals = words.map(w => w.arousal);
      const avg = arr => arr.reduce((s, v) => s + v, 0) / arr.length;
      return {
        coord: { valence: avg(valences), arousal: avg(arousals) },
        spread: words.length > 1 ? [Math.min(...valences), Math.max(...valences)] : null,
      };
    }
    return { coord: e.affectCoord || { valence: 0, arousal: 0 }, spread: null };
  });

  const pts = points.map((p, i) => ({
    x: (i / Math.max(points.length - 1, 1)) * W,
    y: valenceToY(p.coord.valence),
  }));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {pts.length > 1 && (
        <polyline
          points={pts.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="var(--sage)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {pts.map((pt, i) => {
        const { coord, spread } = points[i];
        const color = getQuadrantInfo(coord).color;
        return (
          <g key={i}>
            {spread && (
              <line
                x1={pt.x} x2={pt.x}
                y1={valenceToY(spread[1])} y2={valenceToY(spread[0])}
                stroke={color}
                strokeWidth="3"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />
            )}
            <circle cx={pt.x} cy={pt.y} r={4} fill={color} />
          </g>
        );
      })}
    </svg>
  );
}

function BackupSection() {
  const { history, importHistory } = useApp();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sioh-sioh-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data)) throw new Error('invalid');
      importHistory(data);
      setMessage(`已匯入 ${data.length} 筆紀錄`);
    } catch {
      setMessage('匯入失敗，請確認檔案格式');
    }
  };

  return (
    <div className="card">
      <div style={{ fontSize: 12, color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 12 }}>
        備份與還原
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>
        溫馨提醒：如果清除瀏覽器快取，或使用無痕模式，記錄將會消失喔。
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-secondary" onClick={handleExport} disabled={history.length === 0}>
          📤 匯出紀錄
        </button>
        <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
          📥 匯入紀錄
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImportFile} />
      </div>
      {message && (
        <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, marginTop: 10 }}>
          {message}
        </p>
      )}
    </div>
  );
}

function QuadrantLegend() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 14 }}>
      {QUADRANTS.map(q => (
        <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: q.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>{q.label}</span>
        </div>
      ))}
    </div>
  );
}
