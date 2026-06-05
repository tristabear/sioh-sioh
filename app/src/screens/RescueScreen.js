/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const PHASES = [
  { label: '用鼻子吸氣', sublabel: '第一次吸氣', duration: 2000, scale: 1.3, color: '#5a8fa3' },
  { label: '再吸一口氣', sublabel: '把肺吸滿', duration: 1000, scale: 1.5, color: '#5a8fa3' },
  { label: '慢慢從嘴巴吐氣', sublabel: '盡量吐長一點', duration: 5000, scale: 0.85, color: '#2d5566' },
  { label: '自然停頓', sublabel: '', duration: 1500, scale: 0.85, color: '#2d5566' },
];

const ROUNDS = 5;

export default function RescueScreen() {
  const navigate = useNavigate();
  const { session } = useApp();
  const [started, setStarted] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);
  const fromCheck = session.affectCoord !== null;

  useEffect(() => {
    if (!started || done) return;
    const phase = PHASES[phaseIdx];
    timerRef.current = setTimeout(() => {
      const nextPhase = (phaseIdx + 1) % PHASES.length;
      if (nextPhase === 0) {
        const nextRound = round + 1;
        if (nextRound >= ROUNDS) { setDone(true); return; }
        setRound(nextRound);
      }
      setPhaseIdx(nextPhase);
    }, phase.duration);
    return () => clearTimeout(timerRef.current);
  }, [started, phaseIdx, round, done]);

  const phase = PHASES[phaseIdx];

  if (!started) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', minHeight: '80dvh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🌬️</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--forest)', marginBottom: 12 }}>生理嘆息</h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 8 }}>
            雙次吸氣＋長吐氣，直接刺激迷走神經，<br />是目前科學上最快速的自律神經穩定方法。
          </p>
          <p style={{ fontSize: 13, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: 32 }}>
            5 個循環，約 50 秒
          </p>
          <button className="btn-primary" onClick={() => setStarted(true)} style={{ maxWidth: 280 }}>
            開始呼吸
          </button>
          <button className="btn-secondary" style={{ marginTop: 12, maxWidth: 280 }} onClick={() => navigate(-1)}>
            先不用了
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="screen fade-up" style={{ display: 'flex', flexDirection: 'column', minHeight: '80dvh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🌿</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--forest)', marginBottom: 12 }}>
            {session.affectCoord?.valence < 0 ? '你照顧了自己' : '做得很好'}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 32 }}>
            你的迷走神經剛剛被啟動了。<br />身體正在慢慢回到平靜。
          </p>
          {fromCheck ? (
            <button className="btn-primary" style={{ maxWidth: 280 }} onClick={() => navigate('/check/emotion')}>
              繼續練習 →
            </button>
          ) : (
            <button className="btn-primary" style={{ maxWidth: 280 }} onClick={() => navigate('/')}>
              回首頁
            </button>
          )}
          <button className="btn-secondary" style={{ marginTop: 12, maxWidth: 280 }} onClick={() => { setStarted(false); setPhaseIdx(0); setRound(0); setDone(false); }}>
            再來一次
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, var(--forest) 0%, #0d2530 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 52, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <div key={i} style={{ width: i < round ? 20 : 6, height: 4, borderRadius: 2, background: i < round ? '#7aae8e' : i === round ? 'rgba(122,174,142,0.4)' : 'rgba(255,255,255,0.15)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      <div style={{
        width: 180, height: 180, borderRadius: '50%',
        background: `radial-gradient(circle, ${phase.color}88 0%, ${phase.color}22 70%)`,
        border: `2px solid ${phase.color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 48,
        transform: `scale(${phase.scale})`,
        transition: `transform ${phase.duration}ms ease-in-out`,
        boxShadow: `0 0 60px ${phase.color}33`,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: `radial-gradient(circle, ${phase.color} 0%, ${phase.color}88 100%)`,
        }} />
      </div>

      <div style={{ textAlign: 'center', color: '#faf7f2' }}>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>
          {phase.label}
        </div>
        {phase.sublabel && (
          <div style={{ fontSize: 14, color: 'rgba(250,247,242,0.55)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            {phase.sublabel}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(-1)}
        style={{ position: 'absolute', bottom: 40, color: 'rgba(250,247,242,0.35)', fontSize: 13, fontFamily: 'var(--font-sans)' }}
      >
        停止
      </button>
    </div>
  );
}
