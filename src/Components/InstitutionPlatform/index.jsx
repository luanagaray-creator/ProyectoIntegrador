import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { apiRequest } from '../../auth/api';
import { useLiveMessages } from '../../auth/useLiveMessages';
import '../AdminPlan/style.css';
import SpaceSettings from '../AdminPlan/SpaceSettings';
import DeleteAction from '../AdminPlan/DeleteAction';
import AdminDirectoryDrawer from './AdminDirectoryDrawer';

const normalizeInstitutionName = value => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('es');

export default function InstitutionPlatform() {
  const { user, authLoading } = useAuth();
  const { data, error, refresh, loading } = useLiveMessages(user?.typeUser === 'superadmin' ? '/platform/institutions' : null);
  const [name, setName] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [institutionPickerOpen, setInstitutionPickerOpen] = useState(false);
  const institutionPickerRef = useRef(null);
  const [target, setTarget] = useState('');
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [actionError, setActionError] = useState('');
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [showCreateInstitutionForm, setShowCreateInstitutionForm] = useState(false);
  const selectedInstitution = data?.institutions.some(institution => institution.id === institutionId) ? institutionId : data?.institutions[0]?.id || '';
  useEffect(() => {
    if (!institutionPickerOpen) return undefined;
    const closeOnOutsideClick = event => { if (!institutionPickerRef.current?.contains(event.target)) setInstitutionPickerOpen(false); };
    const closeOnEscape = event => { if (event.key === 'Escape') setInstitutionPickerOpen(false); };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [institutionPickerOpen]);
  async function run(task, success) {
    if (pending) return;
    setPending(true); setFeedback(''); setActionError('');
    try { await task(); setFeedback(success); refresh(); return true; }
    catch (err) { setActionError(err.message); return false; }
    finally { setPending(false); }
  }
  if (authLoading) return <p role="status">Cargando sesión…</p>;
  if (user?.typeUser !== 'superadmin') return <Navigate to="/home" replace />;
  if (loading && !data && !error) return <p className="institution-platform__loading" role="status">Cargando instituciones…</p>;
  const institutions = data?.institutions || [];
  const filteredInstitutions = institutions.filter(institution => institution.name.toLocaleLowerCase().includes(institutionSearch.trim().toLocaleLowerCase()));
  const duplicateInstitution = Boolean(name.trim()) && institutions.some(institution => normalizeInstitutionName(institution.name) === normalizeInstitutionName(name));
  const hasInstitutions = institutions.length > 0;
  const createInstitution = <section className="admin-plan__card institution-platform__action-card">
    <h2>{hasInstitutions ? 'Nueva institución' : 'Creá tu primera institución'}</h2>
    {hasInstitutions && <p>Cada institución administra sus propios accesos y espacios.</p>}
    <form onSubmit={event => { event.preventDefault(); if (duplicateInstitution) { setActionError('Ya existe una institución con ese nombre.'); return; } run(async () => {
      const result = await apiRequest('/platform/institutions', { method: 'POST', body: JSON.stringify({ name }) });
      setInstitutionId(result.id);
      setName('');
      setShowCreateInstitutionForm(false);
    }, 'Institución creada.'); }}>
      <label htmlFor="institutionName">Nombre de la institución</label><input id="institutionName" value={name} onChange={event => { setName(event.target.value); setActionError(''); }} placeholder="Ej.: Ánima Bachillerato Tecnológico" required maxLength={80} disabled={pending} />
      {duplicateInstitution && <p className="institution-platform__duplicate-warning" role="status">Ya existe una institución con ese nombre.</p>}
      <button className="admin-plan__primary" disabled={pending || duplicateInstitution}>{pending ? 'Creando…' : 'Crear institución'}</button>
    </form>
  </section>;
  return <div className="admin-plan institution-platform">
    <div className="institution-platform__topbar">
      <div className="institution-platform__topbar-copy">
        <h1>Administración de Thotem</h1>
        <p>{hasInstitutions ? 'Organizá las instituciones, sus administradores y los espacios que utilizan.' : 'Registrá una institución para empezar a configurar quién la administra y cómo se organiza.'}</p>
      </div>
      {hasInstitutions && <div className="institution-platform__topbar-actions">
        <button type="button" className="institution-platform__new-trigger" aria-expanded={showCreateInstitutionForm} onClick={() => { setShowCreateInstitutionForm(value => !value); setFeedback(''); setActionError(''); }}>{showCreateInstitutionForm ? 'Cerrar' : 'Nueva institución'}</button>
        <button type="button" className="institution-platform__directory-trigger" disabled={!data} aria-haspopup="dialog" aria-expanded={directoryOpen} aria-controls="admin-directory-drawer" onClick={() => { setFeedback(''); setActionError(''); setDirectoryOpen(true); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          Ver administradores{data ? <span>{data.adminAccounts?.length || 0}</span> : null}
        </button>
      </div>}
    </div>
    {hasInstitutions && showCreateInstitutionForm && <div className="institution-platform__new-panel">{createInstitution}</div>}
    {(error || actionError) && <p role="alert">{actionError || error}</p>}
    {feedback && <p role="status">{feedback}</p>}
    {hasInstitutions ? <>
      <section className="institution-platform__workflow" aria-labelledby="institution-workflow-title">
        <div className="institution-platform__section-heading"><div><h2 id="institution-workflow-title">Acceso de administradores</h2><p>Elegí una institución y asociá una cuenta.</p></div></div>
        <form className="institution-platform__access-form" onSubmit={event => { event.preventDefault(); run(async () => {
          await apiRequest('/platform/administrators', { method: 'POST', body: JSON.stringify({ user: target, institutionId: selectedInstitution }) });
          setTarget('');
        }, 'Administrador autorizado en la institución.'); }}>
          <label htmlFor="institutionChoice">Institución<select id="institutionChoice" value={selectedInstitution} onChange={event => setInstitutionId(event.target.value)} disabled={pending}>{institutions.map(institution => <option key={institution.id} value={institution.id}>{institution.name}</option>)}</select></label>
          <label htmlFor="institutionAdmin">Usuario o email<input id="institutionAdmin" value={target} onChange={event => setTarget(event.target.value)} placeholder="Ej.: nombre o correo@institucion.edu" required maxLength={80} disabled={pending} /></label>
          <button className="institution-platform__authorize-button" disabled={pending || !selectedInstitution}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20"/><circle cx="10" cy="7" r="4"/><path d="M19 8v6m-3-3h6"/></svg>
            {pending ? 'Asignando…' : 'Autorizar administrador'}
          </button>
        </form>
      </section>
      <section className="institution-platform__institutions" aria-labelledby="institutions-title">
        <div className="institution-platform__section-heading"><div><h2 id="institutions-title">Instituciones</h2><p>Elegí una para administrar sus accesos y espacios.</p></div><span>{institutions.length} {institutions.length === 1 ? 'institución' : 'instituciones'}</span></div>
        <div className="institution-platform__institution-picker" ref={institutionPickerRef}>
          <button type="button" className="institution-platform__institution-trigger" aria-haspopup="listbox" aria-expanded={institutionPickerOpen} onClick={() => { setInstitutionPickerOpen(value => !value); setInstitutionSearch(''); }}>
            <span className="institution-platform__institution-trigger-label">{institutions.find(institution => institution.id === selectedInstitution)?.name || 'Seleccionar institución'}</span>
            <span className="institution-platform__institution-trigger-count">{institutions.length}</span>
            <svg className={institutionPickerOpen ? 'is-open' : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          {institutionPickerOpen && <div className="institution-platform__institution-popover">
            <label className="institution-platform__institution-search" htmlFor="institutionSearch">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>
              <input id="institutionSearch" type="search" autoFocus value={institutionSearch} onChange={event => setInstitutionSearch(event.target.value)} placeholder="Buscar institución…" aria-label="Buscar institución" />
              <span>{filteredInstitutions.length} de {institutions.length}</span>
            </label>
            <div className="institution-platform__institution-options" role="listbox" aria-label="Instituciones disponibles">
              {filteredInstitutions.map(institution => <button key={institution.id} type="button" role="option" aria-selected={institution.id === selectedInstitution} className={institution.id === selectedInstitution ? 'is-selected' : ''} onClick={() => { setInstitutionId(institution.id); setInstitutionPickerOpen(false); setInstitutionSearch(''); }}>
                <span>{institution.name}</span>{institution.id === selectedInstitution && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>}
              </button>)}
              {filteredInstitutions.length === 0 && <p className="institution-platform__no-results">No hay instituciones con ese nombre.</p>}
            </div>
          </div>}
        </div>
        <div className="institution-platform__grid institution-platform__grid--institutions">{institutions.filter(institution => institution.id === selectedInstitution).map(institution => <section className="admin-plan__card institution-platform__institution-card" key={institution.id}>
          <div className="institution-platform__institution-heading">
            <div><span>Institución</span><h3>{institution.name}</h3></div>
            <div className="institution-platform__institution-actions"><DeleteAction label="Eliminar institución" name={institution.name} pending={pending}
              description="Se borrarán la institución, todos sus espacios, chats grupales, conversaciones privadas y permisos. Las cuentas de los usuarios se conservarán; los planes sin espacios se cancelarán."
              onDelete={() => run(() => apiRequest(`/platform/institutions/${institution.id}`, { method: 'DELETE' }), 'Institución eliminada.')} /></div>
          </div>
          <section className={`institution-platform__plan-summary${institution.plan ? ' has-active-plan' : ''}`} aria-label="Plan institucional">
            <div className="institution-platform__plan-state"><span className="institution-platform__plan-indicator" aria-hidden="true" /><div><span>Plan institucional</span><strong>{institution.plan ? 'Activo' : 'Sin plan activo'}</strong></div></div>
            {institution.plan ? <>
              <div className="institution-platform__plan-detail"><span>Plan actual</span><strong>{institution.plan.plan}</strong></div>
              <div className="institution-platform__plan-detail institution-platform__plan-payer"><span>Cuenta que lo paga</span><strong>{institution.plan.payerEmail || 'Correo no disponible'}</strong>{institution.plan.payerName && <small>{institution.plan.payerName}{institution.plan.payerIsActive === false ? ' · Cuenta inactiva' : ''}</small>}</div>
            </> : <p>Al contratar un plan, acá aparecerán el plan y el correo de la cuenta pagadora.</p>}
          </section>
          <div className="institution-platform__people"><h4>Administradores</h4>
            {(data.institutionAdministrators || []).filter(admin => admin.institutionId === institution.id).map(admin => <div className="admin-member-row" key={admin.idUser}><span>{admin.name}<small>Administrador de la institución{data.adminAccounts?.find(account => account.idUser === admin.idUser)?.isActive === false ? ' · Inactivo' : ''}</small></span><button type="button" disabled={pending} onClick={() => run(() => apiRequest(`/platform/institutions/${institution.id}/administrators/${admin.idUser}`, { method: 'DELETE' }), 'Permiso institucional retirado.')}>Retirar permiso</button></div>)}
            {!(data.institutionAdministrators || []).some(admin => admin.institutionId === institution.id) && <p className="institution-platform__empty-note">Todavía no hay un administrador asignado. Podés autorizarlo en el paso anterior.</p>}
          </div>
          <div className="institution-platform__spaces"><h4>Espacios</h4>
            {!data.spaces.some(space => space.institutionId === institution.id) && <p className="institution-platform__empty-note">El administrador podrá crear espacios después de contratar un plan.</p>}
            {data.spaces.filter(space => space.institutionId === institution.id).map(space => <div className="admin-space-row" key={space.id}><h3>{space.name}</h3>
              <SpaceSettings key={`${space.id}-${space.name}`} space={space} pending={pending} onAction={run} />
            </div>)}
          </div>
        </section>)}</div>
      </section>
    </> : <>
      <section className="institution-platform__first-step">{createInstitution}</section>
      <section className="institution-platform__institutions" aria-labelledby="institutions-title">
        <div className="institution-platform__section-heading"><div><h2 id="institutions-title">Instituciones</h2><p>Las instituciones creadas aparecerán aquí para que puedas seleccionarlas y gestionarlas.</p></div><span>0 instituciones</span></div>
        <p className="institution-platform__institution-empty">Todavía no hay instituciones registradas.</p>
      </section>
    </>}
    {directoryOpen && data && <AdminDirectoryDrawer data={data} pending={pending} onAction={run} onClose={() => setDirectoryOpen(false)} error={actionError || error} feedback={feedback} />}
  </div>;
}
