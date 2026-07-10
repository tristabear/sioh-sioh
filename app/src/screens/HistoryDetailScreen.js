/* eslint-disable */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SOMATIC_SYMPTOMS } from '../data/emotions';
import { getQuadrantInfo, generateShareCard, shareOrDownloadImage } from '../utils/media';

const SYMPTOM_LABELS = Object.fromEntries(SOMATIC_SYMPTOMS.map(s => [s.id, s.label]));

const ACTION_LABELS = {
  share: '💬 分享給他人',
  photo: '📷 拍照記錄',
  text: '✏️ 文字記錄',
  stay: '🌿 靜靜陪伴自己',
  rescue: '🌬️ 呼吸練習',
  enough: '🌱 先這樣就足夠',
};

const SRWNE_LABELS = {
  autonomous: '自主選擇',
  controlled: '被迫沉默',
};

export default function HistoryDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { history } = useApp();
  const [shareCardUrl, setShareCardUrl] = useState(null);

  const entry = history.find(e => String(e.id) === id);

  if (!entry) {
    return (
      <div className="screen" style={{ padding: '52px 24px 100px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: 24 }}>
          找不到這筆記錄。
        </p>
        <button className="btn-secondary" onClick={() => navigate('/history')}>
          ‹ 回到記錄
        </button>
      </div>
    );
  }

  const date = new Date(entry.timestamp);
  const { label: quadrantLabel, color: quadrantColor } = getQuadrantInfo(entry.affectCoord);

  return (
    <div className="screen" style={{ padding: '52px 24px 100px' }}>
      <button
        className="btn-secondary"
        style={{ width: 'auto', padding: '8px 16px', marginBottom: 20 }}
        onClick={() => navigate('/history')}
      >
        ‹ 回到記錄
      </button>

      <div style={{ fontSize: 13, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)', marginBottom: 8 }}>
        {date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}{' '}
        {date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
      </div>

      <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--forest)', marginBottom: 12 }}>
        {entry.emotionWord?.word || '無命名'}
      </h1>

      {entry.candidateWords?.length === 2 && entry.emotionWord && (
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 12 }}>
          你感受到了 {entry.candidateWords[0].word} 和 {entry.candidateWords[1].word}，<br />
          你學會更精確地說出它：{entry.emotionWord.word}
        </p>
      )}

      {entry.affectCoord && (
        <span className="chip selected" style={{ background: quadrantColor, borderColor: quadrantColor, marginBottom: 20 }}>
          {quadrantLabel}
        </span>
      )}

      {entry.symptoms?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
            身體感受
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {entry.symptoms.map(s => (
              <span key={s} className="chip unselected">
                {SYMPTOM_LABELS[s] || s}
              </span>
            ))}
          </div>
        </div>
      )}

      {entry.srwneResult && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
            分享意願
          </div>
          <span className="chip unselected">{SRWNE_LABELS[entry.srwneResult]}</span>
        </div>
      )}

      {entry.actionChoice && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
            當下選擇
          </div>
          <span className="chip unselected">{ACTION_LABELS[entry.actionChoice] || entry.actionChoice}</span>
        </div>
      )}

      {entry.journalNote && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
            文字記錄
          </div>
          <div className="card" style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
              {entry.journalNote}
            </p>
          </div>
        </div>
      )}

      {entry.photoDataUrl && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
            照片記錄
          </div>
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <img src={entry.photoDataUrl} alt="" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        {shareCardUrl ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 12, boxShadow: 'var(--shadow-md)' }}>
              <img src={shareCardUrl} alt="" style={{ width: '100%', display: 'block' }} />
            </div>
            <button className="btn-secondary" onClick={() => shareOrDownloadImage(shareCardUrl)}>
              📤 分享圖卡
            </button>
          </div>
        ) : (
          <button className="btn-secondary" onClick={async () => setShareCardUrl(await generateShareCard(entry))}>
            🖼️ 製作分享圖卡
          </button>
        )}
      </div>
    </div>
  );
}
