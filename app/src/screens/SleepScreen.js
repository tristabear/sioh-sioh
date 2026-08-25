/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import ShihuSleeping from '../components/ShihuSleeping';

// The four voice tracks. Drop the recordings into app/public/audio/ with these
// filenames (see the README there) and each card unlocks automatically —
// no code change needed.
const TRACKS = [
  { id: 'wind-down', title: '放鬆身體', sub: '一步步放掉今天的緊繃', icon: '🌙' },
  { id: 'visualization', title: '想像漫遊', sub: '跟著聲音走進安靜的風景', icon: '🌌' },
  { id: 'breathing', title: '呼吸入眠', sub: '緩慢的呼吸引導', icon: '🌬️' },
  { id: 'sleep-story', title: '睡前故事', sub: '聽著聽著就睡著了', icon: '📖' },
];

const trackSrc = (id) => `${process.env.PUBLIC_URL}/audio/${id}.m4a`;

const fmt = (s) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

export default function SleepScreen() {
  const audioRef = useRef(null);
  const [available, setAvailable] = useState(null); // null = still probing
  const [activeId, setActiveId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Probe which recordings exist. Static hosts rewrite missing paths to
  // index.html with a 200, so a non-HTML content-type is the real signal.
  useEffect(() => {
    let cancelled = false;
    Promise.all(TRACKS.map(async (t) => {
      try {
        const res = await fetch(trackSrc(t.id), { method: 'HEAD' });
        const type = res.headers.get('content-type') || '';
        return res.ok && !type.includes('text/html') ? t.id : null;
      } catch { return null; }
    })).then(ids => { if (!cancelled) setAvailable(new Set(ids.filter(Boolean))); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const toggleTrack = (track) => {
    if (!available?.has(track.id)) return;
    let audio = audioRef.current;
    if (!audio) audio = audioRef.current = new Audio();

    if (activeId === track.id) {
      if (playing) { audio.pause(); setPlaying(false); }
      else { audio.play(); setPlaying(true); }
      return;
    }

    audio.pause();
    audio.src = trackSrc(track.id);
    audio.ontimeupdate = () => setProgress(audio.currentTime);
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.onended = () => { setPlaying(false); setProgress(0); };
    setActiveId(track.id);
    setProgress(0);
    audio.play().then(() => {
      setPlaying(true);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: '惜惜',
          artwork: [{ src: `${process.env.PUBLIC_URL}/icon-512.png`, sizes: '512x512', type: 'image/png' }],
        });
      }
    }).catch(() => {
      setActiveId(null);
      setAvailable(prev => { const next = new Set(prev); next.delete(track.id); return next; });
    });
  };

  return (
    <div className="screen" style={{
      width: '100vw',
      marginLeft: 'calc(50% - 50vw)',
      background: 'linear-gradient(180deg, #101d26 0%, #1c2b24 100%)',
      minHeight: '100dvh',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '52px 24px 0' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#faf7f2', letterSpacing: 2, lineHeight: 1.3, marginBottom: 10 }}>
          晚安，該休息了
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(250,247,242,0.5)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7 }}>
          讓聲音陪你，慢慢沉進今晚的睡眠。
        </p>

        <div style={{ width: '78%', maxWidth: 330, margin: '28px auto 20px' }}>
          <ShihuSleeping />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
          {TRACKS.map(track => {
            const isActive = activeId === track.id;
            const ready = available === null ? null : available.has(track.id);
            return (
              <button
                key={track.id}
                onClick={() => toggleTrack(track)}
                style={{
                  textAlign: 'left',
                  background: isActive ? 'rgba(200,165,121,0.14)' : 'rgba(250,247,242,0.06)',
                  border: `1px solid ${isActive ? 'rgba(200,165,121,0.5)' : 'rgba(250,247,242,0.12)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 18px',
                  opacity: ready === false ? 0.55 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 26 }}>{track.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#faf7f2', fontFamily: 'var(--font-serif)', lineHeight: 1.4, marginBottom: 4 }}>
                      {track.title}
                      {ready === false && (
                        <span style={{
                          fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-sans)',
                          color: '#C8A579', border: '1px solid rgba(200,165,121,0.5)',
                          borderRadius: 20, padding: '1px 8px', marginLeft: 8, verticalAlign: 'middle',
                        }}>
                          錄音準備中
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.5)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.5 }}>
                      {track.sub}
                    </div>
                  </div>
                  {ready && (
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: isActive && playing ? '#C8A579' : 'rgba(250,247,242,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, color: isActive && playing ? '#1c2b24' : '#faf7f2',
                    }}>
                      {isActive && playing ? '❚❚' : '▶'}
                    </div>
                  )}
                </div>

                {isActive && duration > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ height: 3, borderRadius: 2, background: 'rgba(250,247,242,0.15)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(progress / duration) * 100}%`, background: '#C8A579', transition: 'width 0.3s linear' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: 'rgba(250,247,242,0.45)', fontFamily: 'var(--font-sans)' }}>
                      <span>{fmt(progress)}</span>
                      <span>{fmt(duration)}</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(250,247,242,0.35)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7, marginTop: 4, paddingBottom: 24 }}>
          建議調暗螢幕、放下手機，讓聲音陪著你就好 🌙
        </p>
      </div>
    </div>
  );
}
