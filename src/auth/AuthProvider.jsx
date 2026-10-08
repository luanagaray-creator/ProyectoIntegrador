import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { apiRequest } from './api';
import { useNavigate } from 'react-router-dom';

const SESSION_EVENT = 'anima-session-changed';

function notifyTabs() {
  try { localStorage.setItem(SESSION_EVENT, `${Date.now()}-${Math.random()}`); } catch { /* La cookie sigue funcionando si el almacenamiento está deshabilitado. */ }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const version = useRef(0);
  const hadSession = useRef(false);
  const navigate = useNavigate();

  const expireSession = useCallback(() => {
    ++version.current;
    hadSession.current = false;
    setUser(null);
    setSessionError('');
    setAuthLoading(false);
    notifyTabs();
    navigate('/login', { replace: true, state: { sessionExpired: true } });
  }, [navigate]);

  const refreshSession = useCallback(async () => {
    const current = ++version.current;
    try {
      const data = await apiRequest('/users/profile');
      if (current === version.current) { hadSession.current = true; setUser(data.user); setSessionError(''); }
    } catch (err) {
      if (current === version.current) {
        if (err.status === 401) {
          if (hadSession.current) expireSession();
          else { setUser(null); setSessionError(''); }
        }
        else setSessionError(err.message);
      }
    } finally {
      if (current === version.current) setAuthLoading(false);
    }
  }, [expireSession]);

  useEffect(() => {
    if (!user?.sessionExpiresAt) return;
    const remaining = Date.parse(user.sessionExpiresAt) - Date.now();
    const timer = window.setTimeout(expireSession, Math.max(0, remaining));
    return () => window.clearTimeout(timer);
  }, [user?.sessionExpiresAt, expireSession]);

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
    hadSession.current = true;
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
    hadSession.current = true;
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
    hadSession.current = false;
    setSessionError('');
    setAuthLoading(false);
    notifyTabs();
  }

  async function simulatePayment(values) {
    const current = ++version.current;
    let data;
    try {
      data = await apiRequest('/payments/simulate', { method: 'POST', body: JSON.stringify(values) });
    } catch (err) {
      if (err.status === 401 && current === version.current) expireSession();
      throw err;
    }
    if (current !== version.current) throw new Error('La sesión cambió. Volvé a intentar el pago simulado.');
    ++version.current;
    setUser(data.user);
    setSessionError('');
    notifyTabs();
    return data.user.purchase;
  }

  return <AuthContext.Provider value={{ user, authLoading, sessionError, refreshSession, login, register, logout, simulatePayment }}>{children}</AuthContext.Provider>;
}
