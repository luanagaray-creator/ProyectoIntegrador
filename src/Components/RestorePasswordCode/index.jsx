import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../auth/api';
import RecoveryLayout from '../../auth/RecoveryLayout';

export default function RestorePasswordCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { requestId, email, message } = location.state || {};
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  async function verify(event) {
    event.preventDefault();
    if (loading) return;
    setLoading('verify'); setError('');
    try {
      const result = await apiRequest('/auth/password-reset/verify', { method: 'POST', body: JSON.stringify({ requestId, code }) });
      navigate('/restore-password-confirm', { replace: true, state: { resetToken: result.resetToken } });
    } catch (err) { setError(err.message); }
    finally { setLoading(''); }
  }
  async function resend() {
    if (loading) return;
    setLoading('resend'); setError('');
    try {
      const result = await apiRequest('/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email }), signal: AbortSignal.timeout(45000) });
      setCode('');
      navigate('/restore-password-code', { replace: true, state: { requestId: result.requestId, email, message: result.message } });
    } catch (err) { setError(err.message); }
    finally { setLoading(''); }
  }
  if (!requestId || !email) return <Navigate to="/restore-password" replace />;
  return <RecoveryLayout title="Ingresá tu código">
    <p>{message}<br />Ingresá los 6 dígitos del correo. El código vence en 15 minutos.</p>
    <form onSubmit={verify}>
      <label htmlFor="recoveryCode">Código de recuperación</label>
      <input id="recoveryCode" className="recovery-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={event => setCode(event.target.value.replace(/[^0-9]/g, ''))} placeholder="000000" />
      {error && <p role="alert">{error}</p>}
      <button disabled={!!loading}>{loading === 'verify' ? 'Verificando…' : 'Verificar código'}</button>
      <button type="button" className="recovery-secondary" disabled={!!loading} onClick={resend}>{loading === 'resend' ? 'Solicitando…' : 'Solicitar otro código'}</button>
      <Link to="/restore-password" state={{ email }}>Cambiar email</Link>
    </form>
  </RecoveryLayout>;
}
