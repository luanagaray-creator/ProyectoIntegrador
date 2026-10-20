import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useLiveMessages } from '../../auth/useLiveMessages';
import { apiRequest } from '../../auth/api';
import './style.css';
import packageJson from '../../../package.json';
import SpaceSettings from './SpaceSettings';

export default function AdminPlan() {
  const { user, authLoading, refreshSession, cancelPlan } = useAuth();
  const [confirmCancellation, setConfirmCancellation] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [target, setTarget] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const allManaged = user?.managedSpaces || [];
  const institutions = user?.managedInstitutions || [...new Map(allManaged.map(space => [space.institutionId, { id: space.institutionId, name: space.institutionName, plan: user?.purchase?.plan, amount: user?.purchase?.amount, spaceCount: allManaged.filter(item => item.institutionId === space.institutionId).length }])).values()];
  const institution = institutions.find(item => item.id === institutionId) || institutions[0];
  const managed = allManaged.filter(space => space.institutionId === institution?.id);
  const spaceLimit = packageJson.planLimits[institution?.plan] || 0;
  const spaceCount = institution?.spaceCount || 0;
  const canCreate = !!spaceLimit && spaceCount < spaceLimit;
  const selectedSpace = managed.find(space => space.id === selectedId);
  const selected = selectedSpace?.id;
  const { data, error: loadError, refresh } = useLiveMessages(user?.canPurchase && selected ? `/admin/spaces/${selected}/members` : null);
  const options = managed.map(space => ({ id: space.id, institutionId: space.institutionId, label: `${space.institutionName} · ${space.name}` }));
  async function run(task, message) {
    if (pending) return;
    setPending(true); setError(''); setFeedback('');
    try { await task(); await refreshSession(); setFeedback(message); setTarget(''); refresh(); return true; }
    catch (err) { setError(err.message); if (err.status === 403) refreshSession(); return false; }
    finally { setPending(false); }
  }
  if (authLoading) return <p role="status">Cargando sesión…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.typeUser === 'superadmin') return <Navigate to="/platform" replace />;
  if (!user.canPurchase) return <Navigate to="/spaces" replace />;
  return <div className="admin-plan institution-platform"><h1>Administración de mi institución</h1>
    {institutions.length > 1 && <label className="admin-plan__institution">Institución<select value={institution?.id || ''} disabled={pending} onChange={event => { setInstitutionId(event.target.value); setSelectedId(''); setSpaceName(''); setConfirmCancellation(false); setError(''); }}>{institutions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
    {feedback && <p role="status">{feedback}</p>}{(error || loadError) && <p role="alert">{error || loadError}</p>}
    <div className="institution-platform__grid">
      <section className="admin-plan__card"><h2>{institution?.plan ? 'Plan Actual' : 'Mi plan'}</h2>
        {institution?.plan ? <><p><strong>{institution.plan}</strong> · Importe simulado: {institution.amount}</p>
          <p>Hasta {spaceLimit} espacios personalizados · 30 usuarios por espacio.</p>
          <p>{spaceCount} de {spaceLimit} espacios creados.</p>
          <Link className="admin-plan__details-link" to="/current-plan" state={{ institutionId: institution.id }}>Ver detalles del plan</Link>
          {spaceCount > spaceLimit && <p role="alert">Tu institución supera el cupo actual. Eliminá los espacios que no necesites o elegí un plan mayor.</p>}
          <Link to="/available-packages" state={{ institutionId: institution.id }}>Cambiar de plan</Link>
          {confirmCancellation ? <div className="admin-plan__cancellation">
            <p>Al cancelar, los espacios de este plan perderán su cobertura. Sus nombres, usuarios y mensajes se conservarán.</p>
            <button className="admin-plan__danger" disabled={pending} onClick={() => run(async () => { await cancelPlan(institution.id); setConfirmCancellation(false); }, 'Plan cancelado.')}>Confirmar cancelación</button>
            <button className="admin-plan__primary" disabled={pending} onClick={() => setConfirmCancellation(false)}>Conservar plan</button>
          </div> : <button className="admin-plan__danger" disabled={pending} onClick={() => setConfirmCancellation(true)}>Cancelar plan</button>}
          </> : <><p>Contratá un plan para empezar a crear los espacios de tu institución.</p><Link to="/available-packages" state={{ institutionId: institution?.id }}>Elegir un plan</Link></>}
      </section>
      <section className="admin-plan__card"><h2>Crear espacio</h2>
        <p>Escribí el nombre de tu nueva clase. Cada espacio tendrá lugar para 30 usuarios.</p>
        {spaceLimit ? <p role="status">{spaceCount} de {spaceLimit} espacios creados · {Math.max(0, spaceLimit - spaceCount)} disponibles.</p> : <p>Primero contratá un plan para crear tus espacios.</p>}
        <form onSubmit={event => { event.preventDefault(); if (!canCreate || pending) return; run(async () => { const result = await apiRequest('/admin/spaces', { method: 'POST', body: JSON.stringify({ institutionId: institution.id, name: spaceName }) }); setSpaceName(''); setSelectedId(result.id); }, 'Espacio creado. Ya podés agregar usuarios.'); }}>
          <div className="admin-plan__field"><label htmlFor="newSpaceName">Nombre del nuevo espacio</label><input id="newSpaceName" value={spaceName} onChange={event => setSpaceName(event.target.value)} placeholder="Ej.: Desarrollo web" required maxLength={30} disabled={pending || !canCreate} /></div>
          <button className="admin-plan__primary" disabled={pending || !canCreate || !spaceName.trim()}>{pending ? 'Guardando…' : spaceLimit && !canCreate ? 'Límite de espacios alcanzado' : 'Crear espacio'}</button>
        </form>
      </section>
      <section className="admin-plan__card"><h2>Agregar usuarios a un espacio</h2>
        <p>Elegí uno de los espacios que creaste y agregá una cuenta registrada. Cada usuario puede tener un solo chat grupal.</p>
        {!managed.length && <p>Cuando crees tu primer espacio, podrás agregarle usuarios acá.</p>}
        <div className="admin-plan__field"><label htmlFor="managedSpace">Espacio creado</label><select id="managedSpace" value={selected || ''} onChange={event => { setSelectedId(event.target.value); setTarget(''); setError(''); setFeedback(''); }} disabled={pending || !managed.length}><option value="" disabled>Elegí uno de tus espacios</option>{options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</select></div>
        {data && <p role="status">{data.members.length} / {data.capacity} usuarios · {data.available} lugares disponibles.</p>}
        <form onSubmit={event => { event.preventDefault(); if (!selected) return; run(() => apiRequest(`/admin/spaces/${selected}/members`, { method: 'POST', body: JSON.stringify({ user: target }) }), `Espacio ${selectedSpace.name} asignado a ${target.trim()}.`); }}>
          <div className="admin-plan__field"><label htmlFor="memberUser">Usuario o email registrado</label><input id="memberUser" value={target} onChange={event => setTarget(event.target.value)} placeholder="Ej.: Juanito" required maxLength={30} disabled={pending} /></div>
          <button className="admin-plan__primary" disabled={pending || !selected || !target.trim() || !data || data.available <= 0}>{pending ? 'Guardando…' : data?.available === 0 ? 'Espacio completo' : 'Asignar espacio'}</button>
        </form>
        {selectedSpace && <h3>Usuarios de {selectedSpace.name}</h3>}
        {data?.members.length === 0 && <p>Todavía no hay usuarios habilitados en este espacio.</p>}
        {data?.members.map(member => <div className="admin-member-row" key={member.idUser}><span><strong>{member.name}</strong><small>{member.email}</small><small>Chat asignado: {selectedSpace.name}</small></span><button disabled={pending} onClick={() => run(() => apiRequest(`/admin/spaces/${selected}/members/${member.idUser}`, { method: 'DELETE' }), 'Acceso del usuario retirado.')}>Retirar acceso</button></div>)}
      </section>
    </div>
    <section className="admin-plan__card admin-plan__spaces"><h2>Mis espacios</h2>
      <p>Estos son los espacios de tu institución. Podés cambiarles el nombre o eliminar los que ya no necesites.</p>
      {!managed.length && <p>Todavía no creaste espacios.</p>}
      {managed.map(space => <div className="admin-space-row" key={space.id}>
        <p>{space.institutionName}</p><h3>{space.name}</h3>
        <SpaceSettings key={`${space.id}-${space.name}`} space={space} pending={pending} onAction={run} />
      </div>)}
    </section>
  </div>;
}
