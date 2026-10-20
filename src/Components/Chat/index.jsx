import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import Profile from '../Profile';
import ViewNavigation from '../ViewNavigation';
import { useAuth } from '../../auth/AuthContext';
import { useLiveMessages } from '../../auth/useLiveMessages';
import { apiRequest } from '../../auth/api';
import EmojiPicker from '../EmojiPicker';
import { useMessageEditor } from '../../auth/useMessageEditor';
import './style.css';

function Conversation({ space, options, changeSpace }) {
  const { user, refreshSession } = useAuth();
  const { data, loading, error, refresh } = useLiveMessages(`/group-chat?spaceId=${space.id}`);
  const [content, setContent] = useState('');
  const { inputRef, insertEmoji } = useMessageEditor(content, setContent);
  const [pending, setPending] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState('');
  const [actionError, setActionError] = useState('');
  const bodyRef = useRef(null);
  const stayAtBottom = useRef(true);
  const lastId = data?.messages.at(-1)?.id;
  useEffect(() => { const body = bodyRef.current; if (body && stayAtBottom.current) body.scrollTop = body.scrollHeight; }, [lastId]);
  async function send(event) {
    event?.preventDefault();
    if (pending || !content.trim() || !data) return;
    setPending(true); setActionError('');
    try { await apiRequest('/group-chat/messages', { method: 'POST', body: JSON.stringify({ content, spaceId: space.id }) }); setContent(''); stayAtBottom.current = true; refresh(); }
    catch (err) { setActionError(err.message); if (err.status === 401 || err.status === 403) refreshSession(); }
    finally { setPending(false); }
  }
  async function deleteMessage(messageId) {
    if (deletingMessageId || !window.confirm('¿Eliminar este mensaje? Esta acción no se puede deshacer.')) return;
    setDeletingMessageId(String(messageId)); setActionError('');
    try {
      await apiRequest(`/group-chat/messages/${messageId}?spaceId=${encodeURIComponent(space.id)}`, { method: 'DELETE' });
      refresh();
    } catch (err) { setActionError(err.message); if (err.status === 401 || err.status === 403) refreshSession(); }
    finally { setDeletingMessageId(''); }
  }
  return <div className="chat__content-box">
    <div className="chat__content-boxHeader"><div>
      <span className="chat__institution">{space.institutionName}</span>
      {options.length > 1 ? <select className="chat__space-select" aria-label="Espacio autorizado" value={space.id} onChange={event => changeSpace(event.target.value)} disabled={pending}>{options.map(option => <option key={option.id} value={option.id}>{option.institutionName} · {option.name}</option>)}</select> : <h1 className="chat__content-boxTitle">{space.name}</h1>}
    </div><Profile name={user.name} typeUser={user.typeUser === 'admin' ? 'Administrador' : 'Usuario'} /></div>
    <hr className="divider" />
    {(error || actionError) && <div className="chat__feedback" role="alert">{actionError || error} <button type="button" onClick={() => { setActionError(''); refresh(); }}>Reintentar</button></div>}
    <div ref={bodyRef} className="chat__content-boxBody" role="region" tabIndex={0} aria-label={`Chat de ${space.institutionName}, ${space.name}`} onScroll={event => { const element = event.currentTarget; stayAtBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 60; }}>
      {loading && <p role="status">Cargando chat…</p>}{data?.messages.length === 0 && <p className="chat__feedback">Todavía no hay mensajes en este espacio.</p>}
      {data?.messages.map(message => <div key={message.id} className={`chat__content-boxMessage chat__content-boxMessage--${message.senderId === user.idUser ? 'outgoing' : 'incoming'}`}>
        <p>{message.content}</p>
        <div className="chat__message-meta">
          <strong>{message.senderName}</strong>
          <time dateTime={message.sentAt}>{new Date(message.sentAt).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' })}</time>
          {message.senderId === user.idUser && <button type="button" className="chat__delete-message" disabled={!!deletingMessageId} onClick={() => deleteMessage(message.id)}>{deletingMessageId === String(message.id) ? 'Eliminando…' : 'Eliminar'}</button>}
        </div>
      </div>)}
    </div>
    <form className="chat__content-boxComposer" onSubmit={send}><textarea ref={inputRef} className="chat__content-boxTextarea" aria-label="Mensaje para el espacio" placeholder="Escribir…" required maxLength={5000} disabled={pending || !data} value={content} onChange={event => setContent(event.target.value)} rows={1} onKeyDown={event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) send(event); }} /><EmojiPicker onSelect={insertEmoji} disabled={pending || !data} /><button className="chat__content-boxSend" aria-label={pending ? 'Enviando mensaje' : 'Enviar mensaje'} disabled={pending || !data || !content.trim()}><span>→</span></button></form>
  </div>;
}
export default function Chat() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  if (user?.typeUser === 'superadmin') return <Navigate to="/default-page" replace />;
  const options = (user?.spaces || []).filter(space => space.isActive);
  const space = options.find(option => option.id === params.get('spaceId')) || options[0];
  return <div className="chat"><div className="chat__content"><ViewNavigation />{space ? <Conversation key={space.id} space={space} options={options} changeSpace={id => setParams({ spaceId: id })} /> : <p className="chat__feedback">No tenés espacios habilitados. <Link to="/spaces">Ver mis espacios</Link></p>}</div></div>;
}
