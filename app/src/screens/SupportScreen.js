/* eslint-disable */
import { useNavigate } from 'react-router-dom';

// Taiwan crisis / support resources. Kept as data so the sleep section or
// rescue flow can surface a subset of the same lines later.
const LINES = [
  { tel: '1925', name: '安心專線', desc: '24 小時免費心理支持，衛福部設置', badge: '24 小時' },
  { tel: '1995', name: '生命線', desc: '24 小時自殺防治與情緒支持', badge: '24 小時' },
  { tel: '1980', name: '張老師專線', desc: '週一至週六，青少年與成人心理輔導', badge: '免費' },
  { tel: '119', name: '緊急救護', desc: '有立即危險時，請直接撥打', badge: '緊急' },
];

export default function SupportScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen" style={{ padding: '0 0 100px 0' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '56px 24px 0' }}>
        <button onClick={() => navigate(-1)} style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', marginBottom: 20, padding: 0 }}>
          ← 返回
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', marginBottom: 10 }}>安心資源</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 24 }}>
          有時候，一個 App 能陪你的有限。<br />
          需要真人接住你的時候，這些電話隨時都在。
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {LINES.map(line => (
            <a
              key={line.tel}
              href={`tel:${line.tel}`}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', color: 'var(--ink)', padding: '18px 20px' }}
            >
              <div style={{
                fontSize: 22, fontWeight: 900, color: 'var(--forest)',
                fontFamily: 'var(--font-sans)', letterSpacing: 1, minWidth: 74,
              }}>
                {line.tel}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>
                  {line.name}
                  <span style={{
                    fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-sans)',
                    color: 'var(--clay)', border: '1px solid var(--clay)',
                    borderRadius: 20, padding: '1px 8px', marginLeft: 8, verticalAlign: 'middle',
                  }}>
                    {line.badge}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.5 }}>
                  {line.desc}
                </div>
              </div>
              <div style={{ fontSize: 18, color: 'var(--light-muted)' }}>📞</div>
            </a>
          ))}
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--sand)', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', marginBottom: 8 }}>關於惜惜</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.8 }}>
            惜惜是自我照顧與情緒調節的練習工具，以神經科學研究為基礎設計，
            但不是醫療器材，不提供診斷、治療或醫療建議。
            如果情緒困擾持續影響生活，請諮詢身心科醫師或心理師。
          </p>
        </div>

        <button
          onClick={() => navigate('/privacy')}
          style={{ fontSize: 13, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)', textDecoration: 'underline', padding: '8px 0' }}
        >
          隱私權政策
        </button>
      </div>
    </div>
  );
}
