import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { apiRequest } from '../../auth/api';
import { useLiveMessages } from '../../auth/useLiveMessages';
import '../AdminPlan/style.css';
import SpaceSettings from '../AdminPlan/SpaceSettings';
import DeleteAction from '../AdminPlan/DeleteAction';
import AdminDirectoryDrawer from './AdminDirectoryDrawer';

export default function InstitutionPlatform() {
  const { user, authLoading } = useAuth();
  const { data, error, refresh } = useLiveMessages(user?.typeUser === 'superadmin' ? '/platform/institutions' : null);
  const [name, setName] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [target, setTarget] = useState('');
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [actionError, setActionError] = useState('');
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const selectedInstitution = data?.institutions.some(institution => institution.id === institutionId) ? institutionId : data?.institutions[0]?.id || '';
  async function run(task, success) {
    if (pending) return;
    setPending(true); setFeedback(''); setActionError('');
    try { await task(); setFeedback(success); refresh(); return true; }
    catch (err) { setActionError(err.message); return false; }
    finally { setPending(false); }
  }
  if (authLoading) return <p role="status">Cargando sesión…</p>;
  if (user?.typeUser !== 'superadmin') return <Navigate to="/home" replace />;
  return <div className="admin-plan institution-platform">
    <h1>Administración de Thotem</h1>
    <p>Creá instituciones y autorizá sus administradores. Cada administrador podrá contratar un plan y crear sus propios espacios.</p>
    <button type="button" className="institution-platform__directory-trigger" disabled={!data} aria-haspopup="dialog" aria-expanded={directoryOpen} aria-controls="admin-directory-drawer" onClick={() => { setFeedback(''); setActionError(''); setDirectoryOpen(true); }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      Administradores{data ? <span>{data.adminAccounts?.length || 0}</span> : null}
    </button>
    {(error || actionError) && <p role="alert">{actionError || error}</p>}
    {feedback && <p role="status">{feedback}</p>}
    <div className="institution-platform__grid">
      <section className="admin-plan__card"><h2>Nueva institución</h2>
        <form onSubmit={event => { event.preventDefault(); run(async () => { const result = await apiRequest('/platform/institutions', { method: 'POST', body: JSON.stringify({ name }) }); setName(''); setInstitutionId(result.id); }, 'Institución creada.'); }}>
          <label htmlFor="institutionName">Nombre</label><input id="institutionName" value={name} onChange={event => setName(event.target.value)} placeholder="Ej.: Ánima Bachillerato Tecnológico" required maxLength={80} disabled={pending} />
          <p>Los espacios los creará su administrador después de contratar un plan.</p>
          <button className="admin-plan__primary" disabled={pending}>Crear institución</button>
        </form>
      </section>
      <section className="admin-plan__card"><h2>Autorizar administrador</h2>
        {data?.institutions.length ? <form onSubmit={event => { event.preventDefault(); run(async () => { await apiRequest('/platform/administrators', { method: 'POST', body: JSON.stringify({ user: target, institutionId: selectedInstitution }) }); setTarget(''); }, 'Administrador autorizado en la institución.'); }}>
          <label htmlFor="institutionChoice">Institución</label><select id="institutionChoice" value={selectedInstitution} onChange={event => setInstitutionId(event.target.value)} disabled={pending}>{data.institutions.map(institution => <option key={institution.id} value={institution.id}>{institution.name}</option>)}</select>
          <label htmlFor="institutionAdmin">Cuenta registrada</label><input id="institutionAdmin" value={target} onChange={event => setTarget(event.target.value)} placeholder="Usuario o email de Ánima" required maxLength={30} disabled={pending} />
          <button className="admin-plan__primary" disabled={pending || !selectedInstitution}>Otorgar permisos</button>
        </form> : <p>Primero creá una institución. Su administrador debe tener una cuenta registrada.</p>}
      </section>
    </div>
    {directoryOpen && data && <AdminDirectoryDrawer data={data} pending={pending} onAction={run} onClose={() => setDirectoryOpen(false)} error={actionError || error} feedback={feedback} />}
    <div className="institution-platform__grid">{data?.institutions.map(institution => <section className="admin-plan__card" key={institution.id}><h2>{institution.name}</h2>
      {(data.institutionAdministrators || []).filter(admin => admin.institutionId === institution.id).map(admin => <div className="admin-member-row" key={admin.idUser}><span>{admin.name}<small>Administrador de la institución{data.adminAccounts?.find(account => account.idUser === admin.idUser)?.isActive === false ? ' · Inactivo' : ''}</small></span><button type="button" disabled={pending} onClick={() => run(() => apiRequest(`/platform/institutions/${institution.id}/administrators/${admin.idUser}`, { method: 'DELETE' }), 'Permiso institucional retirado.')}>Retirar permiso</button></div>)}
      {!data.spaces.some(space => space.institutionId === institution.id) && <p>El administrador todavía no creó espacios.</p>}
      {data.spaces.filter(space => space.institutionId === institution.id).map(space => <div className="admin-space-row" key={space.id}><h3>{space.name}</h3>
        <SpaceSettings key={`${space.id}-${space.name}`} space={space} pending={pending} onAction={run} />
      </div>)}
      <DeleteAction label="Eliminar institución" name={institution.name} pending={pending}
        description="Se borrarán la institución, todos sus espacios, chats grupales, conversaciones privadas y permisos. Las cuentas de los usuarios se conservarán; los planes sin espacios se cancelarán."
        onDelete={() => run(() => apiRequest(`/platform/institutions/${institution.id}`, { method: 'DELETE' }), 'Institución eliminada.')} />
    </section>)}</div>
  </div>;
}
