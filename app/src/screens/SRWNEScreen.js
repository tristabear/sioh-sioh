/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { compressImage, generateShareCard, shareOrDownloadImage } from '../utils/media';

const WHY_NOT_OPTIONS = [
  {
    id: 'burden',
    label: '怕麻煩別人',
    reframe: '把情緒告訴在乎的人，往往讓對方感受到信任，而不是負擔。你願意讓人靠近，本身就是一份禮物。',
  },
  {
    id: 'misunderstood',
    label: '擔心被誤解',
    reframe: '你不需要被完全理解。說出口的那一刻，你已經替自己做了一件很重要的事。',
  },
  {
    id: 'not_ready',
    label: '還沒準備好',
    reframe: '情緒需要時間，你不用急。等你覺得對的時候，你會知道的。',
  },
  {
    id: 'no_one',
    label: '沒有合適的人',
    reframe: '這種孤獨感，本身也值得被好好照顧。現在，先讓我們陪著你。',
  },
  {
    id: 'self_process',
    label: '想先自己消化',
    reframe: '能先理清自己的感受，是很重要的自我覺察。這也是一種照顧自己的方式。',
  },
];

const DONE_MESSAGES = {
  share:   { emoji: '💬', title: '去找那個人說說吧',  body: '你不需要解釋太多。\n說「我最近感覺到___，想跟你說說」就夠了。' },
  photo:   { emoji: '📷', title: '照片留住了這一刻',  body: '影像是很有力量的記憶方式。\n今天你照顧了自己。' },
  text:    { emoji: '✏️', title: '文字讓感受更清晰',  body: '把它寫下來，你就給了它一個容身之處。' },
  stay:    { emoji: '🌿', title: '你陪伴了自己',      body: '靜靜地待著，也是一種很深的照顧。' },
  enough:  { emoji: '🌱', title: '這樣就足夠了',      body: '不用做更多，你已經停下來陪了自己一下。' },
  default: { emoji: '🌱', title: '練習完成了',        body: '你今天惜惜了自己的心。這一分鐘是值得的。' },
};

const STEP_DOTS = [1, 2, 3, 4, 5];

export default function SRWNEScreen() {
  const navigate = useNavigate();
  const { session, updateSession, saveSession } = useApp();

  const [phase, setPhase] = useState('ask');
  const [whyNotId, setWhyNotId] = useState(null);
  const [actionDone, setActionDone] = useState(null);
  const [timerLeft, setTimerLeft] = useState(60);
  const [returnPhase, setReturnPhase] = useState('ask');
  const [journalText, setJournalText] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [shareCardUrl, setShareCardUrl] = useState(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  const isNegative = (session.affectCoord?.valence ?? 0) < -0.1;
  const isCalmPositive = (session.affectCoord?.valence ?? 0) > 0 && (session.affectCoord?.arousal ?? 0) < 0;
  const emotionLabel = session.emotionWord?.word || '';

  useEffect(() => {
    if (phase !== 'timer') return;
    timerRef.current = setInterval(() => {
      setTimerLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleDone('stay');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleDone = (action, extra = {}) => {
    setActionDone(action);
    saveSession({ actionChoice: action, ...extra });
    setPhase('done');
  };

  const handleRescue = () => {
    saveSession({ actionChoice: 'rescue' });
    navigate('/rescue');
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await compressImage(file, 720, 0.7);
    setPhotoPreview(dataUrl);
    setPhase('photo_record');
  };

  const photoInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      capture="environment"
      style={{ display: 'none' }}
      onChange={handlePhotoChange}
    />
  );

  const renderActionButtons = (includeSocial, fromPhase) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {photoInput}
      {includeSocial && (
        <button
          className="btn-primary"
          onClick={() => setPhase('yes_share')}
        >
          💬 分享給他人
        </button>
      )}
      <button
        className="btn-secondary"
        onClick={() => {
          setReturnPhase(fromPhase);
          setPhotoPreview(null);
          fileInputRef.current?.click();
        }}
      >
        📷 拍照紀錄
      </button>
      <button
        className="btn-secondary"
        onClick={() => {
          setReturnPhase(fromPhase);
          setJournalText(session.journalNote || '');
          setPhase('text_record');
        }}
      >
        ✏️ 文字紀錄
      </button>
      <button className="btn-secondary" onClick={() => { setTimerLeft(60); setPhase('timer'); }}>
        🕐 就在這邊（計時）
      </button>
      {isNegative && (
        <button className="btn-secondary" onClick={handleRescue}>
          🌬️ 呼吸練習
        </button>
      )}
      <button className="btn-secondary" onClick={() => handleDone('enough')}>
        先這樣就足夠
      </button>
    </div>
  );

  // ── DONE ──────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const msg = DONE_MESSAGES[actionDone] || DONE_MESSAGES.default;
    return (
      <div className="screen fade-up" style={{ display: 'flex', flexDirection: 'column', minHeight: '80dvh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>{msg.emoji}</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', marginBottom: 12 }}>{msg.title}</h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 32, whiteSpace: 'pre-line' }}>
            {msg.body}
          </p>
          {actionDone === 'text' && journalText && (
            <div className="card" style={{ width: '100%', marginBottom: 32, textAlign: 'left' }}>
              <p style={{ fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                {journalText}
              </p>
            </div>
          )}
          {actionDone === 'photo' && photoPreview && (
            <div style={{ width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 32, boxShadow: 'var(--shadow-sm)' }}>
              <img src={photoPreview} alt="" style={{ width: '100%', display: 'block' }} />
            </div>
          )}
          <button className="btn-primary" style={{ maxWidth: 280 }} onClick={() => navigate('/')}>
            回首頁
          </button>
        </div>
      </div>
    );
  }

  // ── TIMER ─────────────────────────────────────────────────────────────
  if (phase === 'timer') {
    const mins = Math.floor(timerLeft / 60);
    const secs = timerLeft % 60;
    return (
      <div className="screen fade-up" style={{ display: 'flex', flexDirection: 'column', minHeight: '80dvh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: 'var(--forest)', marginBottom: 24, fontVariantNumeric: 'tabular-nums', letterSpacing: 4 }}>
            {mins}:{secs.toString().padStart(2, '0')}
          </div>
          <p style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 40 }}>
            就在這裡。<br />什麼都不用做。
          </p>
          <button className="btn-secondary" style={{ maxWidth: 280 }} onClick={() => handleDone('stay')}>
            好了
          </button>
        </div>
      </div>
    );
  }

  // ── TEXT RECORD ───────────────────────────────────────────────────────
  if (phase === 'text_record') {
    return (
      <div className="screen fade-up" style={{ padding: '52px 24px 100px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEP_DOTS.map(i => <div key={i} className={`dot ${i === 4 ? 'active' : ''}`} />)}
        </div>
        <div style={{ fontSize: 48, marginBottom: 20 }}>✏️</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.4, marginBottom: 10 }}>
          寫下此刻的<br />感受
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>
          想到什麼就寫什麼，不需要完整或正確。
        </p>
        <textarea
          className="textarea"
          style={{ marginBottom: 24 }}
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="今天，我..."
          autoFocus
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn-primary"
            disabled={!journalText.trim()}
            onClick={() => handleDone('text', { journalNote: journalText.trim() })}
          >
            完成 ✓
          </button>
          <button className="btn-secondary" onClick={() => setPhase(returnPhase)}>
            返回
          </button>
        </div>
      </div>
    );
  }

  // ── PHOTO RECORD ──────────────────────────────────────────────────────
  if (phase === 'photo_record') {
    return (
      <div className="screen fade-up" style={{ padding: '52px 24px 100px' }}>
        {photoInput}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEP_DOTS.map(i => <div key={i} className={`dot ${i === 4 ? 'active' : ''}`} />)}
        </div>
        <div style={{ fontSize: 48, marginBottom: 20 }}>📷</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.4, marginBottom: 16 }}>
          拍下這一刻
        </h1>
        {photoPreview ? (
          <>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
              <img src={photoPreview} alt="" style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn-primary"
                onClick={() => handleDone('photo', { photoDataUrl: photoPreview })}
              >
                完成 ✓
              </button>
              <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                重新拍攝
              </button>
              <button className="btn-secondary" onClick={() => setPhase(returnPhase)}>
                返回
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 28 }}>
              拍一張照片，留住此刻的畫面。
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
                開啟相機
              </button>
              <button className="btn-secondary" onClick={() => setPhase(returnPhase)}>
                返回
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── YES_SHARE ─────────────────────────────────────────────────────────
  if (phase === 'yes_share') {
    return (
      <div className="screen fade-up" style={{ padding: '52px 24px 100px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEP_DOTS.map(i => <div key={i} className={`dot ${i === 4 ? 'active' : ''}`} />)}
        </div>
        <div style={{ fontSize: 48, marginBottom: 20 }}>💬</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.3, marginBottom: 16 }}>
          你願意說出口，<br />需要很大的勇氣
        </h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 24 }}>
          研究發現，把情緒告訴一個信任的人，往往能讓它減輕一半。你不需要解釋很多，光是說出來就夠了。
        </p>
        <div className="card" style={{ marginBottom: 28, borderLeft: '4px solid var(--sage)' }}>
          <div style={{ fontSize: 12, color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.2, marginBottom: 8 }}>
            可以這樣開口
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9 }}>
            「我今天感覺到了{emotionLabel || '一些情緒'}，想跟你說說。」
          </p>
        </div>

        {shareCardUrl ? (
          <div style={{ marginBottom: 24 }}>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 16, boxShadow: 'var(--shadow-md)' }}>
              <img src={shareCardUrl} alt="" style={{ width: '100%', display: 'block' }} />
            </div>
            <button
              className="btn-secondary"
              style={{ marginBottom: 10 }}
              onClick={() => shareOrDownloadImage(shareCardUrl)}
            >
              📤 分享圖卡
            </button>
          </div>
        ) : (
          <button
            className="btn-secondary"
            style={{ marginBottom: 24 }}
            onClick={() => setShareCardUrl(generateShareCard(session))}
          >
            🖼️ 製作分享圖卡
          </button>
        )}

        <button className="btn-primary" onClick={() => handleDone('share')}>
          完成今天的練習 ✓
        </button>
      </div>
    );
  }

  // ── REFRAMED (after why_not) ──────────────────────────────────────────
  if (phase === 'reframed') {
    const reframe = WHY_NOT_OPTIONS.find(o => o.id === whyNotId)?.reframe || '';
    return (
      <div className="screen fade-up" style={{ padding: '52px 24px 100px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEP_DOTS.map(i => <div key={i} className={`dot ${i === 4 ? 'active' : ''}`} />)}
        </div>
        <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid var(--sage)' }}>
          <p style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9 }}>
            {reframe}
          </p>
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--forest)', fontFamily: 'var(--font-sans)', marginBottom: 24 }}>
          不過沒關係，這依然是你的決定。
        </p>
        <p style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>
          你想怎麼陪陪自己？
        </p>
        {renderActionButtons(true, 'reframed')}
      </div>
    );
  }

  // ── WHY NOT ───────────────────────────────────────────────────────────
  if (phase === 'why_not') {
    return (
      <div className="screen" style={{ padding: '52px 24px 100px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEP_DOTS.map(i => <div key={i} className={`dot ${i === 4 ? 'active' : ''}`} />)}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.4, marginBottom: 10 }}>
          是什麼讓你<br />不想說呢？
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7, marginBottom: 24 }}>
          沒有對錯，只是更了解自己。
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {WHY_NOT_OPTIONS.map((opt, i) => (
            <button
              key={opt.id}
              className="fade-up"
              style={{
                animationDelay: `${i * 0.06}s`,
                padding: '16px 20px',
                borderRadius: 'var(--radius-sm)',
                background: whyNotId === opt.id ? 'var(--forest)' : '#fff',
                color: whyNotId === opt.id ? '#fff' : 'var(--ink)',
                border: `1.5px solid ${whyNotId === opt.id ? 'var(--forest)' : 'var(--border)'}`,
                textAlign: 'left',
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
                fontWeight: whyNotId === opt.id ? 700 : 300,
                lineHeight: 1.6,
                transition: 'all 0.18s',
              }}
              onClick={() => {
                setWhyNotId(opt.id);
                updateSession({ whyNotShare: opt.id });
                setTimeout(() => setPhase('reframed'), 280);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── NO (calm positive) → skip the "why not" question ───────────────────
  if (phase === 'no_share_skip') {
    return (
      <div className="screen fade-up" style={{ padding: '52px 24px 100px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEP_DOTS.map(i => <div key={i} className={`dot ${i === 4 ? 'active' : ''}`} />)}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.4, marginBottom: 12 }}>
          好的，<br />這份感受留給自己也很好
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 28 }}>
          不是每個好心情都需要說出口，你想怎麼陪陪自己呢？
        </p>
        {renderActionButtons(false, 'no_share_skip')}
      </div>
    );
  }

  // ── UNSURE → limited actions ──────────────────────────────────────────
  if (phase === 'unsure_actions') {
    return (
      <div className="screen fade-up" style={{ padding: '52px 24px 100px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEP_DOTS.map(i => <div key={i} className={`dot ${i === 4 ? 'active' : ''}`} />)}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.3, marginBottom: 12 }}>
          沒關係，<br />先待在這吧
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 28 }}>
          不需要馬上決定任何事。<br />用最舒服的方式陪陪自己就好。
        </p>
        {renderActionButtons(false, 'unsure_actions')}
      </div>
    );
  }

  // ── ASK (default / initial phase) ────────────────────────────────────
  return (
    <div className="screen" style={{ padding: '52px 24px 100px' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {STEP_DOTS.map(i => <div key={i} className={`dot ${i === 4 ? 'active' : ''}`} />)}
      </div>

      {emotionLabel ? (
        <div className="card fade-up" style={{ marginBottom: 24, background: 'var(--forest)', color: '#faf7f2', border: 'none' }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 2, marginBottom: 8 }}>{emotionLabel}</div>
          <p style={{ fontSize: 13, fontFamily: 'var(--font-sans)', fontWeight: 300, opacity: 0.8, lineHeight: 1.8 }}>
            情緒是你內心狀態的訊號。<br />能夠說出它的名字，你已經在照顧自己了。
          </p>
        </div>
      ) : (
        <div className="card fade-up" style={{ marginBottom: 24, borderLeft: '4px solid var(--sage)' }}>
          <p style={{ fontSize: 14, fontFamily: 'var(--font-sans)', fontWeight: 300, color: 'var(--muted)', lineHeight: 1.9 }}>
            每一種感受都值得被看見。<br />能夠停下來注意自己的狀態，這本身就很重要。
          </p>
        </div>
      )}

      <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--forest)', lineHeight: 1.4, marginBottom: 10 }}>
        此刻，你想把<br />這個感受告訴<br />某個人嗎？
      </h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.7, marginBottom: 28 }}>
        分享情緒，是連結自己與他人的橋樑。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="btn-primary"
          onClick={() => {
            updateSession({ sharingChoice: 'yes' });
            setPhase('yes_share');
          }}
        >
          想
        </button>
        <button
          className="btn-secondary"
          onClick={() => {
            updateSession({ sharingChoice: 'no' });
            setPhase(isCalmPositive ? 'no_share_skip' : 'why_not');
          }}
        >
          不想
        </button>
        <button
          className="btn-secondary"
          onClick={() => {
            updateSession({ sharingChoice: 'unsure' });
            setPhase('unsure_actions');
          }}
        >
          還不確定
        </button>
      </div>
    </div>
  );
}
