import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import packageJson from '../../../package.json';
import './style.css';

function formatDate(value) {
  if (!value) return 'No disponible';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'No disponible' : date.toLocaleDateString('es-UY', { dateStyle: 'long' });
}

export default function CurrentPlan() {
  const { user, authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  if (authLoading) return <p className="current-plan__status" role="status">Cargando plan…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.canPurchase || user.typeUser !== 'admin') return <Navigate to="/home" replace />;

  const institutions = (user.managedInstitutions || []).filter(item => item.plan);
  const institution = institutions.find(item => item.id === location.state?.institutionId)
    || institutions.find(item => item.id === user.purchase?.institutionId)
    || institutions[0];
  const plan = institution?.plan || user.purchase?.plan;
  if (!plan) return <Navigate to="/available-packages" replace />;

  const maxSpaces = institution?.maxSpaces || packageJson.planLimits[plan] || 0;
  const spaces = (user.managedSpaces || []).filter(space => !institution || space.institutionId === institution.id);
  const spacesUsed = Number.isFinite(institution?.spaceCount) ? institution.spaceCount : spaces.length;
  const spacesAvailable = Math.max(0, maxSpaces - spacesUsed);
  const amount = institution?.amount ?? user.purchase?.amount;
  const method = institution?.method || user.purchase?.method;
  const paidAt = institution?.paidAt || user.purchase?.paidAt;

  return <div className="current-plan">
    <div className="current-plan__inner">
      <header className="current-plan__heading">
        <p>Administración de la institución</p>
        <h1>Plan actual</h1>
        {institutions.length > 1 && <label className="current-plan__selector">Institución
          <select value={institution?.id || ''} onChange={event => navigate('/current-plan', { replace: true, state: { institutionId: event.target.value } })}>
            {institutions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>}
      </header>

      <section className="current-plan__summary" aria-labelledby="currentPlanName">
        <div className="current-plan__summary-heading">
          <div><span className="current-plan__eyebrow">{institution?.name || 'Tu institución'}</span><h2 id="currentPlanName">{plan}</h2></div>
          <span className="current-plan__badge">Activo</span>
        </div>
        <p className="current-plan__description">Plan contratado para habilitar espacios de comunicación de tu institución.</p>
        <div className="current-plan__stats">
          <article><strong>{spacesUsed} de {maxSpaces}</strong><span>espacios utilizados</span></article>
          <article><strong>{spacesAvailable}</strong><span>espacios disponibles</span></article>
          <article><strong>30</strong><span>usuarios comunes por espacio</span></article>
        </div>
      </section>

      <div className="current-plan__details-grid">
        <section className="current-plan__card" aria-labelledby="planLimitsTitle">
          <h2 id="planLimitsTitle">Límites y disponibilidad</h2>
          <ul className="current-plan__limits">
            <li><span>Máximo de espacios</span><strong>{maxSpaces}</strong></li>
            <li><span>Usuarios comunes por espacio</span><strong>30</strong></li>
            <li><span>Espacios ya creados</span><strong>{spacesUsed}</strong></li>
            <li><span>Lugares disponibles</span><strong>{spacesAvailable}</strong></li>
          </ul>
        </section>
        <section className="current-plan__card" aria-labelledby="planPaymentTitle">
          <h2 id="planPaymentTitle">Datos del plan</h2>
          <dl className="current-plan__payment">
            <div><dt>Institución</dt><dd>{institution?.name || 'No disponible'}</dd></div>
            <div><dt>Importe simulado</dt><dd>{amount == null ? 'No disponible' : amount}</dd></div>
            <div><dt>Método</dt><dd>{method || 'No disponible'}</dd></div>
            <div><dt>Fecha de contratación</dt><dd>{formatDate(paidAt)}</dd></div>
          </dl>
          <p className="current-plan__note">El pago mostrado es una simulación. No se realizan cobros reales.</p>
        </section>
      </div>

      <section className="current-plan__spaces" aria-labelledby="planSpacesTitle">
        <div className="current-plan__spaces-heading"><div><h2 id="planSpacesTitle">Espacios a tu cargo</h2><p>El plan cubre hasta {maxSpaces} espacios en la institución.</p></div><span>{spaces.length} {spaces.length === 1 ? 'espacio' : 'espacios'}</span></div>
        {spaces.length ? <ul>{spaces.map(space => <li key={space.id}><span>{space.name}</span><small>{space.institutionName}</small></li>)}</ul> : <p className="current-plan__empty">Todavía no hay espacios creados. Puedes crearlos desde Administración.</p>}
      </section>

      <nav className="current-plan__actions" aria-label="Acciones del plan">
        <Link className="current-plan__primary" to="/admin-plan">Administrar espacios</Link>
        <Link to="/available-packages" state={{ institutionId: institution?.id }}>Cambiar de plan</Link>
      </nav>
    </div>
  </div>;
}
