import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './index.css';

import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import SomaticScreen from './screens/SomaticScreen';
import AffectGridScreen from './screens/AffectGridScreen';
import RescueScreen from './screens/RescueScreen';
import EmotionScreen from './screens/EmotionScreen';
import SRWNEScreen from './screens/SRWNEScreen';
import SavoringScreen from './screens/SavoringScreen';
import HistoryScreen from './screens/HistoryScreen';

export default function App() {
  return (
    <AppProvider>
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
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
