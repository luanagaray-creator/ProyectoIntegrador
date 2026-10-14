import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import star from '../../assets/star.png';
import cloudUp from '../../assets/cloudUp.png';
import cloudDown from '../../assets/cloudDown.png';
import clock from '../../assets/clock.png';
import ViewNavigation from '../ViewNavigation';
import ComposeMessage from './ComposeMessage';
import { useAuth } from '../../auth/AuthContext';
import { useLiveMessages } from '../../auth/useLiveMessages';
import { apiRequest } from '../../auth/api';
import './style.css';

const filters = [['Destacados', star, 'starred'], ['Enviados', cloudUp, 'sent'], ['Recibidos', cloudDown, 'received'], ['General', clock, 'all']];
const emptyMessages = { all: 'Todavía no tenés mensajes. Usá «Redactar» para iniciar una conversación.', sent: 'Todavía no enviaste mensajes.', received: 'Todavía no recibiste mensajes.', starred: 'No tenés conversaciones destacadas. Marcá una con la estrella para verla acá.' };

export default function DefaultPage() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [savingStar, setSavingStar] = useState('');
  const [starError, setStarError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = filters.some(item => item[2] === searchParams.get('filter')) ? searchParams.get('filter') : 'all';
  const { user, refreshSession } = useAuth();
  const { data, loading, error, refresh } = useLiveMessages(`/messages?filter=${filter}`);
  async function markStar(thread) {
    if (savingStar) return;
    setSavingStar(thread.id); setStarError('');
    try {
      await apiRequest(`/messages/${thread.id}/star`, { method: 'POST', body: JSON.stringify({ starred: !thread.isStarred }) });
      refresh();
    } catch (err) { setStarError(err.message); if (err.status === 401) refreshSession(); }
    finally { setSavingStar(''); }
  }
  return <div className="default-page">
    <div className="default-page__content">
      <ViewNavigation />
      <div className="default-page__content-menuOptions">
        <button className="default-page__content-button" onClick={() => { setFeedback(''); setIsComposeOpen(true); }}>+ Redactar</button>
        {filters.map(([label, icon, value]) => <button type="button" key={value} className={`default-page__content-link${filter === value ? ' default-page__content-link--active' : ''}`} aria-pressed={filter === value} onClick={() => { setFeedback(''); setStarError(''); setSearchParams({ filter: value }); }}>
          <img src={icon} alt="" className="default-page__content-icon" />
          <p className="default-page__content-textOptions">{label}</p>
        </button>)}
      </div>
      {isComposeOpen && <ComposeMessage onClose={() => setIsComposeOpen(false)} onSent={() => { setIsComposeOpen(false); setFeedback('Mensaje enviado.'); refresh(); }} />}
      <div className="default-page__content-messages" aria-label="Conversaciones">
        {feedback && <p role="status" className="message-feedback">{feedback}</p>}
        {starError && <p role="alert" className="message-feedback">{starError}</p>}
        {loading && <p role="status" className="message-feedback">Cargando mensajes…</p>}
        {error && <div className="message-feedback" role="alert">{error} <button type="button" onClick={refresh}>Reintentar</button></div>}
        {data?.threads.length === 0 && <p className="message-feedback">{emptyMessages[filter]}</p>}
        {data?.threads.map(thread => {
          const outgoing = thread.latestSenderId === user.idUser;
          const other = thread.senderId === user.idUser ? thread.recipientName : thread.senderName;
          return <div key={thread.id} className="default-page__content-messages-box message-row">
            <button className={`message-star${thread.isStarred ? ' message-star--active' : ''}`} type="button" aria-label={thread.isStarred ? 'Quitar de destacados' : 'Marcar como destacado'} aria-pressed={thread.isStarred} disabled={!!savingStar} onClick={() => markStar(thread)}>
              <span aria-hidden="true">{thread.isStarred ? '★' : '☆'}</span>
            </button>
            <Link className="default-page__contet-messagesboxContent message-row__link" to={`/answer-message/${thread.id}`} state={{ inboxFilter: filter }}>
              <img src={outgoing ? cloudUp : cloudDown} alt={outgoing ? 'Enviado' : 'Recibido'} className="default-page__content-icon" />
              <div className="message-preview">
                <div className="message-preview__heading"><strong>{thread.subject}</strong><time dateTime={thread.sentAt}>{new Date(thread.sentAt).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' })}</time></div>
                <span className="message-preview__participant">Con: {other}</span>
                <p className="default-page__content-text message-preview__text">{thread.content}</p>
              </div>
            </Link>
          </div>;
        })}
      </div>
    </div>
  </div>;
}
