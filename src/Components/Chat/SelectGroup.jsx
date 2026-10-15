import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GROUPS } from '../../auth/groups';
import { useAuth } from '../../auth/AuthContext';
import RecoveryLayout from '../../auth/RecoveryLayout';

export default function SelectGroup() {
  const { user, authLoading, joinGroup } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function join(event) {
    event.preventDefault();
    if (pending || !group) return;
    setPending(true); setError('');
    try { await joinGroup(group); navigate('/home', { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setPending(false); }
  }
  if (authLoading) return <p role="status">Cargando sesión…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.groupCode) return <Navigate to="/home" replace />;
  return <RecoveryLayout title="Elegí tu grupo"><p>Podrás ingresar cuando un administrador incluya tu grupo en su plan.</p><form onSubmit={join}>
    <label htmlFor="accessGroup">Tu grupo</label><select id="accessGroup" value={group} onChange={event => setGroup(event.target.value)} required disabled={pending}><option value="" disabled>Seleccioná tu grupo</option>{GROUPS.map(code => <option key={code} value={code}>{code}</option>)}</select>
    {error && <p role="alert">{error}</p>}<button disabled={pending || !group}>{pending ? 'Guardando…' : 'Guardar grupo'}</button>
  </form></RecoveryLayout>;
}
