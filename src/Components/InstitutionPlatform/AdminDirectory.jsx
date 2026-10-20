import { useId, useState } from 'react';
import { apiRequest } from '../../auth/api';

export default function AdminDirectory({ accounts, institutions, assignments, pending = false, onAction }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [confirming, setConfirming] = useState('');
  const searchId = useId();
  const statusId = useId();
  const entries = accounts.map(account => ({
    ...account,
    institutions: institutions.filter(institution => assignments.some(assignment => assignment.idUser === account.idUser && assignment.institutionId === institution.id)),
  }));
  const query = search.trim().toLocaleLowerCase('es');
  const visible = entries.filter(account => {
    const active = account.isActive !== false;
    return (status === 'all' || (status === 'active' ? active : !active)) && [account.name, account.email, ...account.institutions.map(institution => institution.name)].some(value => (value || '').toLocaleLowerCase('es').includes(query));
  });
  async function changeStatus(account, isActive) {
    const saved = await onAction(() => apiRequest(`/platform/administrators/${account.idUser}`, { method: 'PATCH', body: JSON.stringify({ isActive }) }), isActive ? 'Administrador reactivado.' : 'Administrador desactivado.');
    if (saved) setConfirming('');
  }
  return <section id="administrators" className="admin-plan__card admin-directory" aria-labelledby="administrators-title">
    <header className="admin-directory__heading"><div><p className="admin-directory__eyebrow">Gestión de acceso</p><h2 id="administrators-title">Administradores</h2><p>Revisá las cuentas y las instituciones a las que tienen acceso.</p></div><span>{accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'}</span></header>
    <div className="admin-directory__filters">
      <label htmlFor={searchId}>Buscar por nombre, email o institución<input id={searchId} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Escribí para buscar…" /></label>
      <label htmlFor={statusId}>Estado<select id={statusId} value={status} onChange={event => setStatus(event.target.value)}><option value="all">Todos</option><option value="active">Activos</option><option value="inactive">Inactivos</option></select></label>
    </div>
    {!accounts.length ? <p className="admin-directory__empty" role="status">Todavía no hay administradores registrados.</p> : !visible.length ? <p className="admin-directory__empty" role="status">No se encontraron administradores para esta búsqueda.</p> : <>
      <p className="admin-directory__count" role="status">Mostrando {visible.length} de {accounts.length} {accounts.length === 1 ? 'administrador' : 'administradores'}</p>
      <div className="admin-directory__columns" aria-hidden="true"><span>Cuenta</span><span>Institución asignada</span><span>Estado</span><span /></div>
      <ul className="admin-directory__list">{visible.map(account => <li className="admin-directory__row" key={account.idUser}>
        <div className="admin-directory__account"><strong>{account.name}</strong><span>{account.email}</span></div>
        <div className="admin-directory__institutions"><span className="admin-directory__role">Administrador</span>
          {account.institutions.length ? <ul>{account.institutions.map(institution => <li key={institution.id}>{institution.name}</li>)}</ul> : <span>Sin institución asignada</span>}
        </div>
        <span className={`admin-directory__status${account.isActive === false ? ' admin-directory__status--inactive' : ''}`}>{account.isActive === false ? 'Inactivo' : 'Activo'}</span>
        <div className="admin-directory__actions"><button type="button" className="admin-directory__toggle" disabled={pending} aria-label={`${account.isActive === false ? 'Reactivar' : 'Desactivar'} administrador ${account.name}`} onClick={() => account.isActive === false ? changeStatus(account, true) : setConfirming(account.idUser)}>{account.isActive === false ? 'Reactivar' : 'Desactivar'}</button></div>
        {confirming === account.idUser && account.isActive !== false && <div className="admin-directory__confirmation" role="group" aria-label={`Desactivar a ${account.name}`}>
          <p>¿Desactivar a <strong>{account.name}</strong>? Se cerrarán sus sesiones y no podrá ingresar. Sus instituciones, permisos y datos se conservarán.</p>
          <div className="admin-plan__delete-actions"><button type="button" className="admin-directory__toggle" disabled={pending} onClick={() => changeStatus(account, false)}>{pending ? 'Guardando…' : 'Confirmar desactivación'}</button><button type="button" className="admin-directory__toggle" disabled={pending} onClick={() => setConfirming('')}>Conservar activo</button></div>
        </div>}
      </li>)}</ul>
    </>}
  </section>;
}
