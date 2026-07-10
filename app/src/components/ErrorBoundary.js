/* eslint-disable */
import { Component } from 'react';

// Top-level crash guard: without this, any render error leaves a permanent
// white screen. History in localStorage is untouched, so a reload is safe.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 28px',
        textAlign: 'center',
        background: 'var(--cream, #F5F3F0)',
      }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🐾</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--forest, #3A6B7E)', marginBottom: 10 }}>
          惜惜打了個盹
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted, #4a5a60)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.9, marginBottom: 28 }}>
          剛剛出了一點小狀況。<br />你的記錄都安全地存在裝置上，重新整理就好。
        </p>
        <button
          className="btn-primary"
          style={{ maxWidth: 260 }}
          onClick={() => { window.location.href = '/'; }}
        >
          重新開始
        </button>
      </div>
    );
  }
}
