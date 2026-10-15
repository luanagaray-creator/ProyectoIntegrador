import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from './api';

export function useLiveMessages(path) {
  const { user, refreshSession } = useAuth();
  const key = `${user?.idUser}:${path}:${user?.spaces?.filter(space => space.isActive).map(space => space.id).join('|') || ''}`;
  const [state, setState] = useState({ key: '', data: null, error: '' });
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    if (!user?.idUser || !path) return;
    let active = true;
    let running = false;
    const controller = new AbortController();
    async function load() {
      if (running || !active) return;
      running = true;
      try {
        const data = await apiRequest(path, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) });
        if (active) setState({ key, data, error: '' });
      } catch (err) {
        if (active) {
          setState(previous => ({ key, data: ![401, 403, 404].includes(err.status) && previous.key === key ? previous.data : null, error: err.message }));
          if (err.status === 401 || err.status === 403) refreshSession();
        }
      } finally { running = false; }
    }
    load();
    const interval = window.setInterval(() => { if (!document.hidden) load(); }, 5000);
    window.addEventListener('focus', load);
    return () => { active = false; controller.abort(); window.clearInterval(interval); window.removeEventListener('focus', load); };
  }, [path, key, user?.idUser, revision, refreshSession]);
  return { data: state.key === key ? state.data : null, error: state.key === key ? state.error : '', loading: state.key !== key, refresh };
}
