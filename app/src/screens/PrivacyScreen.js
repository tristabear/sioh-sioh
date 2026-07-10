/* eslint-disable */
import { useNavigate } from 'react-router-dom';

// In-app privacy policy. The hosted copy for store listings lives at
// /privacy.html in the repo root (served via GitHub Pages) — keep the two in sync.
const SECTIONS = [
  {
    title: '所有資料都留在你的裝置上',
    body: '你的情緒記錄、文字筆記與照片，全部只儲存在這台裝置的本機儲存空間。惜惜沒有伺服器、沒有帳號系統，不會上傳、同步或備份任何內容到雲端。',
  },
  {
    title: '我們不收集任何個人資料',
    body: '惜惜不收集姓名、電子郵件、位置或任何識別資訊，不使用分析工具、追蹤器、廣告或第三方 SDK。App 運作不需要網路連線。',
  },
  {
    title: '分享由你決定',
    body: '只有當你主動點擊分享時，惜惜才會產生一張圖卡並交給系統的分享面板。要傳給誰、傳到哪裡，完全由你決定；惜惜不會知道也不會記錄。',
  },
  {
    title: '刪除資料',
    body: '在「記錄」頁可以刪除單筆記錄。移除 App（或清除瀏覽器資料）即會刪除所有記錄，且無法復原——因為資料從未離開你的裝置，我們也沒有任何副本。',
  },
  {
    title: '權限使用',
    body: '相機／相簿權限只在你選擇「拍照記錄」時使用，照片經壓縮後存於本機。惜惜不會在背景存取相機或相簿。',
  },
];

export default function PrivacyScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen" style={{ padding: '0 0 100px 0' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '56px 24px 0' }}>
        <button onClick={() => navigate(-1)} style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', marginBottom: 20, padding: 0 }}>
          ← 返回
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--forest)', marginBottom: 6 }}>隱私權政策</h1>
        <p style={{ fontSize: 12, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)', marginBottom: 24 }}>
          更新日期：2026 年 7 月 10 日
        </p>

        <p style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 24 }}>
          惜惜的核心設計原則是：<strong style={{ fontWeight: 700, color: 'var(--ink)' }}>你的情緒屬於你，你的資料也是。</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SECTIONS.map(s => (
            <div key={s.title} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)', marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.8 }}>{s.body}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: 'var(--light-muted)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.8, marginTop: 24 }}>
          若本政策有任何變更，會在 App 內明顯處告知。對隱私有任何疑問，歡迎透過 App 商店頁面的聯絡方式與我們聯繫。
        </p>
      </div>
    </div>
  );
}
