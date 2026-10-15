import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { apiRequest } from '../../auth/api';
import { useLiveMessages } from '../../auth/useLiveMessages';
import { GROUPS } from '../../auth/groups';
import GroupChoices from '../AdminPlan/GroupChoices';
import '../AdminPlan/style.css';

export default function InstitutionPlatform() {
  const { user, authLoading } = useAuth();
  const { data, error, refresh } = useLiveMessages(user?.typeUser === 'superadmin' ? '/platform/institutions' : null);
  const [name, setName] = useState('');
  const [codes, setCodes] = useState([...GROUPS]);
  const [institutionId, setInstitutionId] = useState('');
  const [target, setTarget] = useState('');
  const [spaceIds, setSpaceIds] = useState([]);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [actionError, setActionError] = useState('');
  const selectedInstitution = institutionId || data?.institutions[0]?.id || '';
  const options = (data?.spaces || []).filter(space => space.institutionId === selectedInstitution).map(space => ({ id: space.id, label: space.name }));
  async function run(task, success) {
    if (pending) return;
    setPending(true); setFeedback(''); setActionError('');
    try { await task(); setFeedback(success); refresh(); }
    catch (err) { setActionError(err.message); }
    finally { setPending(false); }
  }
  if (authLoading) return <p role="status">Cargando sesión…</p>;
  if (user?.typeUser !== 'superadmin') return <Navigate to="/home" replace />;
  return <div className="admin-plan institution-platform">
    <h1>Administración de Thotem</h1>
    <p>Creá instituciones y autorizá qué cuentas pueden administrar sus espacios.</p>
    {(error || actionError) && <p role="alert">{actionError || error}</p>}
    {feedback && <p role="status">{feedback}</p>}
    <div className="institution-platform__grid">
      <section className="admin-plan__card"><h2>Nueva institución</h2>
        <form onSubmit={event => { event.preventDefault(); run(async () => { const result = await apiRequest('/platform/institutions', { method: 'POST', body: JSON.stringify({ name, groupCodes: codes }) }); setName(''); setInstitutionId(result.id); setSpaceIds([]); }, 'Institución creada.'); }}>
          <label htmlFor="institutionName">Nombre</label><input id="institutionName" value={name} onChange={event => setName(event.target.value)} placeholder="Ej.: Ánima Bachillerato Tecnológico" required maxLength={80} disabled={pending} />
          <GroupChoices value={codes} onChange={setCodes} disabled={pending} title="Espacios de la institución" />
          <button className="admin-plan__primary" disabled={pending || !codes.length}>Crear institución</button>
        </form>
      </section>
      <section className="admin-plan__card"><h2>Autorizar administrador</h2>
        {data?.institutions.length ? <form onSubmit={event => { event.preventDefault(); run(async () => { await apiRequest('/platform/administrators', { method: 'POST', body: JSON.stringify({ user: target, spaceIds }) }); setTarget(''); setSpaceIds([]); }, 'Administrador autorizado en los espacios seleccionados.'); }}>
          <label htmlFor="institutionChoice">Institución</label><select id="institutionChoice" value={selectedInstitution} onChange={event => { setInstitutionId(event.target.value); setSpaceIds([]); }} disabled={pending}>{data.institutions.map(institution => <option key={institution.id} value={institution.id}>{institution.name}</option>)}</select>
          <label htmlFor="institutionAdmin">Cuenta registrada</label><input id="institutionAdmin" value={target} onChange={event => setTarget(event.target.value)} placeholder="Usuario o email de Ánima" required maxLength={30} disabled={pending} />
          <GroupChoices value={spaceIds} onChange={setSpaceIds} options={options} disabled={pending} title="Podrá administrar" />
          <button className="admin-plan__primary" disabled={pending || !spaceIds.length}>Otorgar permisos</button>
        </form> : <p>Primero creá una institución. Su administrador debe tener una cuenta registrada.</p>}
      </section>
    </div>
    <div className="institution-platform__grid">{data?.institutions.map(institution => <section className="admin-plan__card" key={institution.id}><h2>{institution.name}</h2>
      {data.spaces.filter(space => space.institutionId === institution.id).map(space => <div className="admin-space-row" key={space.id}><h3>{space.name}</h3>
        {data.administrators.filter(admin => admin.spaceId === space.id).map(admin => <div className="admin-member-row" key={admin.idUser}><span>{admin.name}</span><button type="button" disabled={pending} onClick={() => run(() => apiRequest(`/platform/spaces/${space.id}/administrators/${admin.idUser}`, { method: 'DELETE' }), 'Permiso retirado.')}>Retirar permiso</button></div>)}
        {!data.administrators.some(admin => admin.spaceId === space.id) && <p>Sin administrador asignado.</p>}
      </div>)}
    </section>)}</div>
  </div>;
}
