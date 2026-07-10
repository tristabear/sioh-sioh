/* eslint-disable */
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './index.css';

import ErrorBoundary from './components/ErrorBoundary';
import BottomNav from './components/BottomNav';
import WelcomeScreen, { WELCOME_KEY } from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import SomaticScreen from './screens/SomaticScreen';
import AffectGridScreen from './screens/AffectGridScreen';
import RescueScreen from './screens/RescueScreen';
import EmotionScreen from './screens/EmotionScreen';
import SRWNEScreen from './screens/SRWNEScreen';
import SavoringScreen from './screens/SavoringScreen';
import HistoryScreen from './screens/HistoryScreen';
import HistoryDetailScreen from './screens/HistoryDetailScreen';
import SupportScreen from './screens/SupportScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import SleepScreen from './screens/SleepScreen';

// Dev-only preview helpers (available under `npm start`, stripped from the
// production build): /welcome re-shows the first-run screen, /crash throws so
// the ErrorBoundary fallback can be previewed.
const isDev = process.env.NODE_ENV === 'development';
function CrashPreview() {
  throw new Error('Preview crash — this route exists only in development.');
}

export default function App() {
  const [welcomed, setWelcomed] = useState(() => {
    try { return !!localStorage.getItem(WELCOME_KEY); } catch { return true; }
  });

  return (
    <ErrorBoundary>
      <AppProvider>
        {!welcomed ? (
          <WelcomeScreen onDone={() => setWelcomed(true)} />
        ) : (
          <BrowserRouter>
            <div className="app-shell">
              <Routes>
                <Route path="/" element={<><HomeScreen /><BottomNav /></>} />
                <Route path="/check/somatic" element={<><SomaticScreen /><BottomNav /></>} />
                <Route path="/check/affect" element={<><AffectGridScreen /><BottomNav /></>} />
                <Route path="/check/emotion" element={<><EmotionScreen /><BottomNav /></>} />
                <Route path="/check/srwne" element={<><SRWNEScreen /><BottomNav /></>} />
                <Route path="/check/savoring" element={<><SavoringScreen /><BottomNav /></>} />
                <Route path="/rescue" element={<RescueScreen />} />
                <Route path="/history" element={<><HistoryScreen /><BottomNav /></>} />
                <Route path="/history/:id" element={<><HistoryDetailScreen /><BottomNav /></>} />
                <Route path="/sleep" element={<><SleepScreen /><BottomNav /></>} />
                <Route path="/support" element={<><SupportScreen /><BottomNav /></>} />
                <Route path="/privacy" element={<><PrivacyScreen /><BottomNav /></>} />
                {isDev && <Route path="/welcome" element={<WelcomeScreen onDone={() => window.location.assign('/')} />} />}
                {isDev && <Route path="/crash" element={<CrashPreview />} />}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        )}
      </AppProvider>
    </ErrorBoundary>
  );
}
