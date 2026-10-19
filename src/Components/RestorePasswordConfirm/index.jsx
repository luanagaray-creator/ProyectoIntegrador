import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../auth/api';
import { useAuth } from '../../auth/AuthContext';
import RecoveryLayout from '../../auth/RecoveryLayout';
import PasswordInput from '../PasswordInput';

export default function RestorePasswordConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const resetToken = location.state?.resetToken;
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    if (password !== confirmation) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true); setError('');
    try {
      await apiRequest('/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ resetToken, password }) });
      await refreshSession();
      try { localStorage.setItem('anima-session-changed', `${Date.now()}-password-reset`); } catch { /* La API ya invalidó las sesiones. */ }
      navigate('/login', { replace: true, state: { passwordReset: true } });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  if (!resetToken) return <Navigate to="/restore-password" replace />;
  return <RecoveryLayout title="Nueva contraseña">
    <p>Elegí una contraseña de entre 6 y 128 caracteres. Después deberás volver a iniciar sesión.</p>
    <form onSubmit={submit}>
      <label htmlFor="newPassword">Nueva contraseña</label>
      <PasswordInput id="newPassword" autoComplete="new-password" required minLength={6} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} />
      <label htmlFor="confirmPassword">Confirmá la contraseña</label>
      <PasswordInput id="confirmPassword" autoComplete="new-password" required minLength={6} maxLength={128} value={confirmation} onChange={event => setConfirmation(event.target.value)} />
      {error && <p role="alert">{error}</p>}
      <button disabled={loading}>{loading ? 'Guardando…' : 'Cambiar contraseña'}</button>
      <Link to="/restore-password">Solicitar un código nuevo</Link>
    </form>
  </RecoveryLayout>;
}
