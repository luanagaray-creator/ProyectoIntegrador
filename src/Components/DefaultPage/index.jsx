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
const emptyMessages = {
  all: { emoji: '💬', title: '¡Empezá una conversación!', description: 'Aquí aparecerán todos tus mensajes. ¿Te animás a iniciar la primera?' },
  sent: { emoji: '📤', title: 'Todavía no enviaste mensajes', description: 'Cuando envíes tu primer mensaje, vas a encontrarlo acá.' },
  received: { emoji: '📬', title: 'Todavía no recibiste mensajes', description: 'Cuando alguien te escriba, la conversación aparecerá acá.' },
  starred: { emoji: '⭐', title: 'Guardá acá lo importante', description: 'Marcá con la estrella las conversaciones que quieras encontrar rápidamente.' },
};

export default function DefaultPage() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [savingStar, setSavingStar] = useState('');
  const [starError, setStarError] = useState('');
  const [deletingThread, setDeletingThread] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = filters.some(item => item[2] === searchParams.get('filter')) ? searchParams.get('filter') : 'all';
  const emptyState = emptyMessages[filter];
  const { user, refreshSession } = useAuth();
  const { data, loading, error, refresh } = useLiveMessages(`/messages?filter=${filter}`);
  async function markStar(thread) {
    if (savingStar || deletingThread) return;
    setSavingStar(thread.id); setStarError('');
    try {
      await apiRequest(`/messages/${thread.id}/star`, { method: 'POST', body: JSON.stringify({ starred: !thread.isStarred }) });
      refresh();
    } catch (err) { setStarError(err.message); if (err.status === 401) refreshSession(); }
    finally { setSavingStar(''); }
  }
  async function deleteConversation(thread) {
    if (deletingThread || savingStar || !window.confirm(`¿Eliminar la conversación «${thread.subject}»? Se borrarán todos sus mensajes para ambos participantes. Esta acción no se puede deshacer.`)) return;
    setDeletingThread(thread.id); setStarError(''); setFeedback('');
    try {
      await apiRequest(`/messages/${thread.id}`, { method: 'DELETE' });
      setFeedback('Conversación eliminada.');
      refresh();
    } catch (err) {
      setStarError(err.message);
      if (err.status === 401 || err.status === 403) refreshSession();
    } finally { setDeletingThread(''); }
  }
  return <div className="default-page">
    <div className="default-page__content">
      <ViewNavigation />
      <nav className="default-page__content-menuOptions" aria-label="Bandeja de mensajes">
        <button type="button" className="default-page__content-button" onClick={() => { setFeedback(''); setIsComposeOpen(true); }}>
          <span className="inbox-menu__compose-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z" /></svg>
          </span>
          Redactar
        </button>
        <div className="inbox-menu__filters">
          {filters.map(([label, icon, value]) => <button type="button" key={value} className={`default-page__content-link${filter === value ? ' default-page__content-link--active' : ''}`} aria-pressed={filter === value} onClick={() => { setFeedback(''); setStarError(''); setSearchParams({ filter: value }); }}>
            <span className="inbox-menu__filter-icon"><img src={icon} alt="" className="default-page__content-icon" /></span>
            <span className="default-page__content-textOptions">{label}</span>
          </button>)}
        </div>
      </nav>
      {isComposeOpen && <ComposeMessage onClose={() => setIsComposeOpen(false)} onSent={() => { setIsComposeOpen(false); setFeedback('Mensaje enviado.'); refresh(); }} />}
      <div className="default-page__content-messages" aria-label="Conversaciones">
        {feedback && <p role="status" className="message-feedback">{feedback}</p>}
        {starError && <p role="alert" className="message-feedback">{starError}</p>}
        {loading && <p role="status" className="message-feedback">Cargando mensajes…</p>}
        {error && <div className="message-feedback" role="alert">{error} <button type="button" onClick={refresh}>Reintentar</button></div>}
        {data?.threads.length === 0 && <section className="inbox-empty-state" aria-live="polite">
          <span className="inbox-empty-state__emoji" aria-hidden="true">{emptyState.emoji}</span>
          <h2>{emptyState.title}</h2>
          <p>{emptyState.description}</p>
        </section>}
        {data?.threads.map(thread => {
          const outgoing = thread.latestSenderId === user.idUser;
          const other = thread.senderId === user.idUser ? thread.recipientName : thread.senderName;
          const space = user.spaces.find(item => item.institutionId === thread.institutionId);
          return <div key={thread.id} className="default-page__content-messages-box message-row">
            <button className={`message-star${thread.isStarred ? ' message-star--active' : ''}`} type="button" aria-label={thread.isStarred ? 'Quitar de destacados' : 'Marcar como destacado'} aria-pressed={thread.isStarred} disabled={!!savingStar || !!deletingThread} onClick={() => markStar(thread)}>
              <span aria-hidden="true">{thread.isStarred ? '★' : '☆'}</span>
            </button>
            <Link className="default-page__contet-messagesboxContent message-row__link" to={`/answer-message/${thread.id}`} state={{ inboxFilter: filter }}>
              <img src={outgoing ? cloudUp : cloudDown} alt={outgoing ? 'Enviado' : 'Recibido'} className="default-page__content-icon" />
              <div className="message-preview">
                <div className="message-preview__heading"><strong>{thread.subject}</strong><time dateTime={thread.sentAt}>{new Date(thread.sentAt).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' })}</time></div>
            <span className="message-preview__participant">{thread.institutionName || space?.institutionName} · Con: {other}</span>
                <p className="default-page__content-text message-preview__text">{thread.content}</p>
              </div>
            </Link>
            <button className="message-delete" type="button" aria-label={`Eliminar conversación: ${thread.subject}`} title={deletingThread === thread.id ? 'Eliminando…' : 'Eliminar conversación'} aria-busy={deletingThread === thread.id} disabled={!!deletingThread || !!savingStar} onClick={() => deleteConversation(thread)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" /></svg>
            </button>
          </div>;
        })}
      </div>
    </div>
  </div>;
}
