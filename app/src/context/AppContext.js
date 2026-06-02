/* eslint-disable */
import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [session, setSession] = useState({
    symptoms: [],
    affectCoord: null, // { valence: -1..1, arousal: -1..1 }
    emotionWord: null,
    srwneResult: null, // 'controlled' | 'autonomous' | 'neutral'
    savoringDone: false,
  });

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('xixi-history') || '[]');
    } catch { return []; }
  });

  const updateSession = useCallback((patch) => {
    setSession(prev => ({ ...prev, ...patch }));
  }, []);

  const saveSession = useCallback(() => {
    const entry = {
      ...session,
      timestamp: new Date().toISOString(),
      id: Date.now(),
    };
    const next = [entry, ...history].slice(0, 30); // keep last 30
    setHistory(next);
    try { localStorage.setItem('xixi-history', JSON.stringify(next)); } catch {}
    setSession({ symptoms: [], affectCoord: null, emotionWord: null, srwneResult: null, savoringDone: false });
  }, [session, history]);

  const resetSession = useCallback(() => {
    setSession({ symptoms: [], affectCoord: null, emotionWord: null, srwneResult: null, savoringDone: false });
  }, []);

  // Determine if user needs physiological rescue
  const needsRescue = session.affectCoord
    ? session.affectCoord.arousal > 0.3 && session.affectCoord.valence < -0.2
    : false;

  return (
    <AppContext.Provider value={{ session, updateSession, saveSession, resetSession, history, needsRescue }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
