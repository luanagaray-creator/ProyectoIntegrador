import { useEffect, useRef, useState } from 'react';
import { apiRequest } from '../../auth/api';
import { useAuth } from '../../auth/AuthContext';

export default function ComposeMessage({ onClose, onSent }) {
  const dialogRef = useRef(null);
  const { user, refreshSession } = useAuth();
  const spaces = (user?.spaces || []).filter(space => space.isActive);
  const [spaceId, setSpaceId] = useState(spaces[0]?.id || '');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);
  async function send(event) {
    event.preventDefault();
    if (sending) return;
    setSending(true); setError('');
    try {
      const result = await apiRequest('/messages', { method: 'POST', body: JSON.stringify({ recipient, subject, content, spaceId }) });
      onSent(result);
    } catch (err) {
      setError(err.message);
      if (err.status === 401) refreshSession();
    } finally { setSending(false); }
  }
  return <dialog ref={dialogRef} className="compose-dialog" aria-labelledby="composeTitle" onCancel={event => { if (sending) event.preventDefault(); }} onClose={onClose}>
    <form className="compose-modal" onSubmit={send}>
      <div className="compose-modal__heading"><h2 id="composeTitle">Redactar mensaje</h2><button type="button" disabled={sending} className="compose-modal-overlay__button" onClick={onClose}>Cerrar</button></div>
      <label>Espacio<select className="compose-modal__input" value={spaceId} onChange={event => setSpaceId(event.target.value)} required disabled={sending}>{spaces.map(space => <option key={space.id} value={space.id}>{space.institutionName} · {space.name}</option>)}</select></label>
      <div className="compose-modal__top">
        <label>Destinatario<input className="compose-modal__input" placeholder="Usuario o email" required disabled={sending} maxLength={30} value={recipient} onChange={event => setRecipient(event.target.value)} /></label>
        <label>Asunto<input className="compose-modal__input" placeholder="Asunto del mensaje" required disabled={sending} maxLength={120} value={subject} onChange={event => setSubject(event.target.value)} /></label>
      </div>
      <label className="compose-modal__body-label">Mensaje<textarea className="compose-modal__textArea" placeholder="Escribí tu mensaje…" required disabled={sending} maxLength={5000} value={content} onChange={event => setContent(event.target.value)} /></label>
      {error && <p role="alert" className="message-feedback">{error}</p>}
      <button disabled={sending || !content.trim() || !spaces.some(space => space.id === spaceId)} className="compose-modal-overlay__button">{sending ? 'Enviando…' : 'Enviar'}</button>
    </form>
  </dialog>;
}
