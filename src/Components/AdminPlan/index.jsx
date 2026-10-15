import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useLiveMessages } from '../../auth/useLiveMessages';
import { apiRequest } from '../../auth/api';
import GroupChoices from './GroupChoices';
import './style.css';

function EditSpaces({ purchase, options, onSaved }) {
  const { updatePlanGroups } = useAuth();
  const [ids, setIds] = useState(purchase.spaceIds);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function save(event) {
    event.preventDefault();
    if (pending || !ids.length) return;
    setPending(true); setError('');
    try { await updatePlanGroups(ids); onSaved('Espacios del plan actualizados.'); }
    catch (err) { setError(err.message); }
    finally { setPending(false); }
  }
  return <form onSubmit={save}><GroupChoices value={ids} onChange={setIds} options={options} disabled={pending} />
    {error && <p role="alert">{error}</p>}<button className="admin-plan__primary" disabled={pending || !ids.length}>{pending ? 'Guardando…' : 'Guardar espacios'}</button>
  </form>;
}

export default function AdminPlan() {
  const { user, authLoading, refreshSession } = useAuth();
  const [selectedId, setSelectedId] = useState('');
  const [target, setTarget] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const managed = user?.managedSpaces || [];
  const selected = managed.some(space => space.id === selectedId) ? selectedId : managed[0]?.id;
  const { data, error: loadError, refresh } = useLiveMessages(user?.canPurchase && selected ? `/admin/spaces/${selected}/members` : null);
  const options = managed.map(space => ({ id: space.id, label: `${space.institutionName} · ${space.name}` }));
  async function run(task, message) {
    if (pending) return;
    setPending(true); setError(''); setFeedback('');
    try { await task(); setFeedback(message); setTarget(''); refresh(); }
    catch (err) { setError(err.message); if (err.status === 403) refreshSession(); }
    finally { setPending(false); }
  }
  if (authLoading) return <p role="status">Cargando sesión…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.typeUser === 'superadmin') return <Navigate to="/platform" replace />;
  if (!user.canPurchase) return <Navigate to="/spaces" replace />;
  return <div className="admin-plan institution-platform"><h1>Administración de mi institución</h1>
    {feedback && <p role="status">{feedback}</p>}{(error || loadError) && <p role="alert">{error || loadError}</p>}
    <div className="institution-platform__grid">
      <section className="admin-plan__card"><h2>Mi plan</h2>
        {user.purchase ? <><p><strong>{user.purchase.plan}</strong> · Importe simulado: {user.purchase.amount}</p>
          <EditSpaces key={user.purchase.spaceIds.join('|')} purchase={user.purchase} options={options} onSaved={setFeedback} />
          <Link to="/available-packages">Cambiar de plan</Link></> : <><p>Podés contratar un plan para los espacios que Thotem te autorizó a administrar.</p><Link to="/available-packages">Elegir un plan</Link></>}
      </section>
      <section className="admin-plan__card"><h2>Acceso de usuarios</h2>
        <label htmlFor="managedSpace">Espacio</label><select id="managedSpace" value={selected || ''} onChange={event => { setSelectedId(event.target.value); setTarget(''); setError(''); setFeedback(''); }} disabled={pending}>{options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</select>
        <form onSubmit={event => { event.preventDefault(); run(() => apiRequest(`/admin/spaces/${selected}/members`, { method: 'POST', body: JSON.stringify({ user: target }) }), 'Usuario habilitado en el espacio.'); }}>
          <label htmlFor="memberUser">Usuario o email registrado</label><input id="memberUser" value={target} onChange={event => setTarget(event.target.value)} placeholder="Ej.: Juanito" required maxLength={30} disabled={pending} />
          <button className="admin-plan__primary" disabled={pending || !selected}>Habilitar usuario</button>
        </form>
        {data?.members.length === 0 && <p>Todavía no hay usuarios habilitados en este espacio.</p>}
        {data?.members.map(member => <div className="admin-member-row" key={member.idUser}><span><strong>{member.name}</strong><small>{member.email}</small></span><button disabled={pending} onClick={() => run(() => apiRequest(`/admin/spaces/${selected}/members/${member.idUser}`, { method: 'DELETE' }), 'Acceso del usuario retirado.')}>Retirar acceso</button></div>)}
      </section>
    </div>
  </div>;
}
