/* eslint-disable */
import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [session, setSession] = useState({
    symptoms: [],
    affectCoord: null, // { valence: -1..1, arousal: -1..1 }
    emotionWord: null,
    sharingChoice: null, // 'yes' | 'no' | 'unsure'
    whyNotShare: null,   // reason id if sharingChoice === 'no'
    actionChoice: null,  // 'share' | 'photo' | 'text' | 'stay' | 'rescue'
    journalNote: null,   // text written during '文字紀錄'
    photoDataUrl: null,  // photo captured during '拍照紀錄'
    srwneResult: null,
    savoringDone: false,
  });

  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('sioh-sioh-history') ?? localStorage.getItem('xixi-history');
      return JSON.parse(stored || '[]');
    } catch { return []; }
  });

  const updateSession = useCallback((patch) => {
    setSession(prev => ({ ...prev, ...patch }));
  }, []);

  const saveSession = useCallback((patch = {}) => {
    const entry = {
      ...session,
      ...patch,
      timestamp: new Date().toISOString(),
      id: Date.now(),
    };
    const next = [entry, ...history].slice(0, 30); // keep last 30
    setHistory(next);
    try { localStorage.setItem('sioh-sioh-history', JSON.stringify(next)); } catch {}
    setSession({ symptoms: [], affectCoord: null, emotionWord: null, sharingChoice: null, whyNotShare: null, actionChoice: null, journalNote: null, photoDataUrl: null, srwneResult: null, savoringDone: false });
  }, [session, history]);

  const resetSession = useCallback(() => {
    setSession({ symptoms: [], affectCoord: null, emotionWord: null, sharingChoice: null, whyNotShare: null, actionChoice: null, journalNote: null, photoDataUrl: null, srwneResult: null, savoringDone: false });
  }, []);

  // Merge an imported backup (array of entries) into existing history, deduping by id.
  const importHistory = useCallback((data) => {
    if (!Array.isArray(data)) return false;
    setHistory(prev => {
      const seen = new Set();
      const merged = [...data, ...prev].filter(e => {
        if (!e || e.id == null || seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });
      merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const next = merged.slice(0, 30);
      try { localStorage.setItem('sioh-sioh-history', JSON.stringify(next)); } catch {}
      return next;
    });
    return true;
  }, []);

  // Determine if user needs physiological rescue
  const needsRescue = session.affectCoord
    ? session.affectCoord.arousal > 0.3 && session.affectCoord.valence < -0.2
    : false;

  return (
    <AppContext.Provider value={{ session, updateSession, saveSession, resetSession, history, importHistory, needsRescue }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
