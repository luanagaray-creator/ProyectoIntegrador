import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { apiRequest } from './api';

const SESSION_EVENT = 'anima-session-changed';

function notifyTabs() {
  try { localStorage.setItem(SESSION_EVENT, `${Date.now()}-${Math.random()}`); } catch { /* La cookie sigue funcionando si el almacenamiento está deshabilitado. */ }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const version = useRef(0);

  const refreshSession = useCallback(async () => {
    const current = ++version.current;
    try {
      const data = await apiRequest('/users/profile');
      if (current === version.current) { setUser(data.user); setSessionError(''); }
    } catch (err) {
      if (current === version.current) {
        if (err.status === 401) { setUser(null); setSessionError(''); }
        else setSessionError(err.message);
      }
    } finally {
      if (current === version.current) setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    const revision = version;
    const initialRefresh = window.setTimeout(refreshSession, 0);
    const sync = event => { if (event.key === SESSION_EVENT) refreshSession(); };
    window.addEventListener('storage', sync);
    window.addEventListener('focus', refreshSession);
    return () => {
      window.clearTimeout(initialRefresh);
      revision.current++;
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', refreshSession);
    };
  }, [refreshSession]);

  async function login(credentials) {
    ++version.current;
    const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    ++version.current;
    setUser(data.user);
    setSessionError('');
    setAuthLoading(false);
    notifyTabs();
    return data.user;
  }

  async function register(values) {
    ++version.current;
    const data = await apiRequest('/users/register', { method: 'POST', body: JSON.stringify(values) });
    ++version.current;
    setUser(data.user);
    setSessionError('');
    setAuthLoading(false);
    notifyTabs();
    return data.user;
  }

  async function logout() {
    ++version.current;
    await apiRequest('/auth/logout', { method: 'POST' });
    ++version.current;
    setUser(null);
    setSessionError('');
    setAuthLoading(false);
    notifyTabs();
  }

  return <AuthContext.Provider value={{ user, authLoading, sessionError, refreshSession, login, register, logout }}>{children}</AuthContext.Provider>;
}
