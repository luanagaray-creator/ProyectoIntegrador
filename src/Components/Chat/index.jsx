import { useEffect, useRef, useState } from 'react';
import Profile from '../Profile';
import ViewNavigation from '../ViewNavigation';
import { useAuth } from '../../auth/AuthContext';
import { GROUPS } from '../../auth/groups';
import { useLiveMessages } from '../../auth/useLiveMessages';
import { apiRequest } from '../../auth/api';
import './style.css';

export default function Chat() {
  const { user, joinGroup, refreshSession } = useAuth();
  const hasGroup = GROUPS.includes(user?.groupCode);
  const { data, loading, error, refresh } = useLiveMessages(hasGroup ? '/group-chat' : null);
  const [chosenGroup, setChosenGroup] = useState('');
  const [content, setContent] = useState('');
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState('');
  const bodyRef = useRef(null);
  const stayAtBottom = useRef(true);
  const lastId = data?.messages.at(-1)?.id;
  useEffect(() => {
    const body = bodyRef.current;
    if (body && stayAtBottom.current) body.scrollTop = body.scrollHeight;
  }, [lastId]);
  async function join(event) {
    event.preventDefault();
    if (pending || !chosenGroup) return;
    setPending(true); setActionError('');
    try { await joinGroup(chosenGroup); }
    catch (err) { setActionError(err.message); }
    finally { setPending(false); }
  }
  async function send(event) {
    event?.preventDefault();
    if (pending || !content.trim() || !data) return;
    setPending(true); setActionError('');
    try {
      await apiRequest('/group-chat/messages', { method: 'POST', body: JSON.stringify({ content }) });
      setContent(''); stayAtBottom.current = true; refresh();
    } catch (err) {
      setActionError(err.message);
      if (err.status === 401) refreshSession();
    } finally { setPending(false); }
  }
  return <div className="chat">
    <div className="chat__content">
      <ViewNavigation />
      <div className="chat__content-box">
        <div className="chat__content-boxHeader">
          <h1 className="chat__content-boxTitle">{hasGroup ? user.groupCode : 'Unite a tu grupo'}</h1>
          {user && <Profile name={user.name} typeUser={user.groupCode || user.typeUser} />}
        </div>
        <hr className="divider" />
        {!hasGroup ? <form className="chat__join" onSubmit={join}>
          <p>Elegí tu curso para entrar al chat. Tu cuenta quedará vinculada al grupo que selecciones.</p>
          <label htmlFor="chatGroup">Tu grupo</label>
          <select id="chatGroup" required disabled={pending} value={chosenGroup} onChange={event => setChosenGroup(event.target.value)}>
            <option value="" disabled>Seleccioná tu grupo</option>
            {GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
          </select>
          {actionError && <p role="alert">{actionError}</p>}
          <button disabled={pending || !chosenGroup}>{pending ? 'Uniéndote…' : 'Unirme al grupo'}</button>
        </form> : <>
          {(error || actionError) && <div className="chat__feedback" role="alert">{actionError || error} <button type="button" onClick={refresh}>Reintentar</button></div>}
          <div ref={bodyRef} className="chat__content-boxBody" aria-label={`Mensajes de ${user.groupCode}`} onScroll={event => { const element = event.currentTarget; stayAtBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 60; }}>
            {loading && <p role="status">Cargando chat…</p>}
            {data?.messages.length === 0 && <p className="chat__feedback">Todavía no hay mensajes en tu grupo. ¡Sé el primero en escribir!</p>}
            {data?.messages.map(message => <div key={message.id} className={`chat__content-boxMessage chat__content-boxMessage--${message.senderId === user.idUser ? 'outgoing' : 'incoming'}`}>
              <div className="chat__message-meta"><strong>{message.senderName}</strong><time dateTime={message.sentAt}>{new Date(message.sentAt).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' })}</time></div>
              <p>{message.content}</p>
            </div>)}
          </div>
          <form className="chat__content-boxComposer" onSubmit={send}>
            <textarea className="chat__content-boxTextarea" aria-label="Mensaje para tu grupo" placeholder="Escribir…" required maxLength={5000} disabled={pending || !data} value={content} onChange={event => setContent(event.target.value)} rows={1} onKeyDown={event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) send(event); }} />
            <button type="submit" className="chat__content-boxSend" aria-label={pending ? 'Enviando mensaje' : 'Enviar mensaje'} disabled={pending || !data || !content.trim()}><span>→</span></button>
          </form>
        </>}
      </div>
    </div>
  </div>;
}
