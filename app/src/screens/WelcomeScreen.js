/* eslint-disable */
// First-run welcome: gentle intro + the two things app review requires us to
// say up front — this is a self-care tool (not medical care), and where to
// find real help. Shown once; dismissal is remembered in localStorage.

export const WELCOME_KEY = 'sioh-sioh-welcomed';

export default function WelcomeScreen({ onDone }) {
  const finish = () => {
    try { localStorage.setItem(WELCOME_KEY, '1'); } catch {}
    onDone();
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, var(--forest) 0%, #16323c 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 28px calc(32px + var(--safe-bottom))',
    }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <img
          src={`${process.env.PUBLIC_URL}/icon.svg`}
          alt="惜惜的石虎"
          style={{ width: 110, height: 110, borderRadius: 28, marginBottom: 24, boxShadow: 'var(--shadow-md)' }}
        />
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#faf7f2', letterSpacing: 4, marginBottom: 10 }}>
          惜惜
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(250,247,242,0.75)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 28 }}>
          惜惜你的心。你值得被好好對待。<br />
          從身體感受出發，陪你認識自己的情緒。
        </p>

        <div style={{
          background: 'rgba(250,247,242,0.08)',
          border: '1px solid rgba(250,247,242,0.15)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          textAlign: 'left',
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(250,247,242,0.9)', fontFamily: 'var(--font-sans)', marginBottom: 8 }}>
            🌿 溫柔的提醒
          </div>
          <p style={{ fontSize: 13, color: 'rgba(250,247,242,0.7)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.8 }}>
            惜惜是自我照顧的練習工具，不是醫療器材，也不提供診斷或治療。
            如果痛苦持續存在，尋求專業協助是勇敢的事——
            安心專線 <a href="tel:1925" style={{ color: '#C8A579', fontWeight: 500 }}>1925</a>（政府24 小時免費心理諮詢服務）隨時有人接聽。
          </p>
        </div>

        <div style={{
          background: 'rgba(250,247,242,0.08)',
          border: '1px solid rgba(250,247,242,0.15)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          textAlign: 'left',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(250,247,242,0.9)', fontFamily: 'var(--font-sans)', marginBottom: 8 }}>
            🔒 你的資料只屬於你
          </div>
          <p style={{ fontSize: 13, color: 'rgba(250,247,242,0.7)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.8 }}>
            所有記錄都只儲存在你的裝置上。沒有帳號、沒有雲端、沒有追蹤。
          </p>
        </div>

        <button className="btn-primary" onClick={finish} style={{ background: '#C8A579', color: '#1c2b24' }}>
          開始 →
        </button>
      </div>
    </div>
  );
}
