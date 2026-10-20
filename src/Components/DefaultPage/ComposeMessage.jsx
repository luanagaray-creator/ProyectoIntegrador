import { useEffect, useRef, useState } from 'react';
import { apiRequest } from '../../auth/api';
import { useAuth } from '../../auth/AuthContext';
import { useLiveMessages } from '../../auth/useLiveMessages';
import EmojiPicker from '../EmojiPicker';
import { useMessageEditor } from '../../auth/useMessageEditor';

export default function ComposeMessage({ onClose, onSent }) {
  const dialogRef = useRef(null);
  const { user, refreshSession } = useAuth();
  const isSuperadmin = user?.typeUser === 'superadmin';
  const { data: platformData } = useLiveMessages(isSuperadmin ? '/platform/institutions' : null);
  const institutions = platformData?.institutions || [];
  const spaces = (user?.spaces || []).filter((space, index, all) => space.isActive && all.findIndex(item => item.isActive && item.institutionId === space.institutionId) === index);
  const [spaceId, setSpaceId] = useState(spaces[0]?.id || '');
  const [institutionId, setInstitutionId] = useState('');
  const selectedInstitutionId = institutions.some(institution => institution.id === institutionId) ? institutionId : institutions[0]?.id || '';
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const { inputRef, insertEmoji } = useMessageEditor(content, setContent);
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
      const body = isSuperadmin ? { recipient, subject, content, institutionId: selectedInstitutionId } : { recipient, subject, content, spaceId };
      const result = await apiRequest('/messages', { method: 'POST', body: JSON.stringify(body) });
      onSent(result);
    } catch (err) {
      setError(err.message);
      if (err.status === 401) refreshSession();
    } finally { setSending(false); }
  }
  return <dialog ref={dialogRef} className="compose-dialog" aria-labelledby="composeTitle" onCancel={event => { if (sending) event.preventDefault(); }} onClose={onClose}>
    <form className="compose-modal" onSubmit={send}>
      <div className="compose-modal__heading"><h2 id="composeTitle">Redactar mensaje</h2><button type="button" disabled={sending} className="compose-modal-overlay__button" onClick={onClose}>Cerrar</button></div>
      {isSuperadmin ? <>
        <label>Institución<select className="compose-modal__input" value={selectedInstitutionId} onChange={event => setInstitutionId(event.target.value)} required disabled={sending || institutions.length === 0}><option value="" disabled>Seleccioná una institución</option>{institutions.map(institution => <option key={institution.id} value={institution.id}>{institution.name}</option>)}</select></label>
        <p className="message-feedback">Podés escribir a una cuenta administradora autorizada en la institución seleccionada.</p>
      </> : spaces.length > 1 ? <label>Institución<select className="compose-modal__input" value={spaceId} onChange={event => setSpaceId(event.target.value)} required disabled={sending}>{spaces.map(space => <option key={space.id} value={space.id}>{space.institutionName}</option>)}</select></label> : <p className="message-feedback">Podés escribir a usuarios de {spaces[0]?.institutionName || 'tu institución'}, aunque estén en otro curso.</p>}
      <div className="compose-modal__top">
        <label>{isSuperadmin ? 'Email del administrador' : 'Destinatario'}<input className="compose-modal__input" placeholder={isSuperadmin ? 'admin@institucion.edu' : 'Usuario o email'} required disabled={sending} maxLength={isSuperadmin ? 254 : 30} value={recipient} onChange={event => setRecipient(event.target.value)} /></label>
        <label>Asunto<input className="compose-modal__input" placeholder="Asunto del mensaje" required disabled={sending} maxLength={120} value={subject} onChange={event => setSubject(event.target.value)} /></label>
      </div>
      <label className="compose-modal__body-label">Mensaje<textarea ref={inputRef} className="compose-modal__textArea" placeholder="Escribí tu mensaje…" required disabled={sending} maxLength={5000} value={content} onChange={event => setContent(event.target.value)} /></label>
      {error && <p role="alert" className="message-feedback">{error}</p>}
      <div className="compose-modal__actions">
        <div className="compose-modal__tools">
          <EmojiPicker onSelect={insertEmoji} disabled={sending} />
          <a className="message-tool" href="https://meet.google.com/" target="_blank" rel="noopener noreferrer" aria-label="Abrir Google Meet" title="Abrir Google Meet">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="6" width="12" height="12" rx="3" /><path d="m15 10 6-3v10l-6-3Z" /></svg>
          </a>
        </div>
        <button disabled={sending || !content.trim() || (isSuperadmin ? !selectedInstitutionId : !spaces.some(space => space.id === spaceId))} className={`compose-modal-overlay__button compose-modal__send-button${sending ? ' is-sending' : ''}`}>{sending ? 'Enviando…' : 'Enviar'}</button>
      </div>
    </form>
  </dialog>;
}
