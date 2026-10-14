import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../../auth/api';
import RecoveryLayout from '../../auth/RecoveryLayout';

export default function RestorePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true); setError('');
    try {
      const result = await apiRequest('/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email }), signal: AbortSignal.timeout(45000) });
      navigate('/restore-password-code', { state: { requestId: result.requestId, email: email.trim(), message: result.message } });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  return <RecoveryLayout title="Recuperá tu contraseña">
    <p>Ingresá el email de tu cuenta y te enviaremos un código para cambiar tu contraseña.</p>
    <form onSubmit={submit}>
      <label htmlFor="recoveryEmail">Email de tu cuenta</label>
      <input id="recoveryEmail" type="email" autoComplete="email" required maxLength={30} value={email} onChange={event => setEmail(event.target.value)} placeholder="Tu email" />
      {error && <p role="alert">{error}</p>}
      <button disabled={loading}>{loading ? 'Enviando solicitud…' : 'Enviar código'}</button>
      <Link to="/login">Volver a iniciar sesión</Link>
    </form>
  </RecoveryLayout>;
}
