import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { apiRequest } from '../../auth/api';
import { useLiveMessages } from '../../auth/useLiveMessages';
import './style.css';

export default function AnswerMessage() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const inboxFilter = ['all', 'sent', 'received', 'starred'].includes(location.state?.inboxFilter) ? location.state.inboxFilter : 'all';
  const { user, refreshSession } = useAuth();
  const { data, loading, error, refresh } = useLiveMessages(`/messages/${threadId}`);
  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const bodyRef = useRef(null);
  const stayAtBottom = useRef(true);
  const lastId = data?.messages.at(-1)?.idMesage;
  useEffect(() => {
    const body = bodyRef.current;
    if (body && stayAtBottom.current) body.scrollTop = body.scrollHeight;
  }, [lastId]);
  async function sendResponse(event) {
    event?.preventDefault();
    if (sending || !responseText.trim() || !data) return;
    setSending(true); setSendError('');
    try {
      await apiRequest(`/messages/${threadId}/replies`, { method: 'POST', body: JSON.stringify({ content: responseText }) });
      setResponseText('');
      stayAtBottom.current = true;
      refresh();
    } catch (err) {
      setSendError(err.message);
      if (err.status === 401) refreshSession();
    } finally { setSending(false); }
  }
  const other = data?.thread.senderId === user.idUser ? data?.thread.recipientName : data?.thread.senderName;
  return <div className="answer-message">
    <div className="answer-message__content">
      <div className="answer-message__content-box">
        <div className="answer-message__content-header">
          <button className="answer-message__content-backButton" onClick={() => navigate(`/default-page?filter=${inboxFilter}`)}>Volver</button>
          {data && <div className="answer-message__conversation-heading"><h1>{data.thread.subject}</h1><span>Con: {other}</span></div>}
        </div>
        <hr className="divider" />
        {(error || sendError) && <div role="alert" className="answer-message__feedback">{sendError || error} <button type="button" onClick={refresh}>Reintentar</button></div>}
        <div ref={bodyRef} className="answer-message__content-body" onScroll={event => { const element = event.currentTarget; stayAtBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 60; }} aria-label="Mensajes de la conversación">
          {loading && <p role="status">Cargando conversación…</p>}
          {data?.messages.map(message => <div key={message.idMesage} className={`answer-message__content-message answer-message__content-message--${message.senderId === user.idUser ? 'outgoing' : 'incoming'}`}>
            <div className="answer-message__message-meta"><strong>{message.senderName}</strong><time dateTime={message.sentAt}>{new Date(message.sentAt).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' })}</time></div>
            <p>{message.content}</p>
          </div>)}
        </div>
        <form className="answer-message__content-composer" onSubmit={sendResponse}>
          <textarea className="answer-message__content-textarea" aria-label="Tu respuesta" placeholder="Escribir tu respuesta…" value={responseText} onChange={event => setResponseText(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) sendResponse(event); }} required maxLength={5000} disabled={sending || !data} rows={1} />
          <button type="submit" className="answer-message__content-send" disabled={sending || !data || !responseText.trim()} aria-label={sending ? 'Enviando respuesta' : 'Enviar respuesta'}><span>→</span></button>
        </form>
      </div>
    </div>
  </div>;
}
