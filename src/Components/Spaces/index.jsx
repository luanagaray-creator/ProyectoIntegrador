import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import '../AdminPlan/style.css';

export default function Spaces() {
  const { user, authLoading } = useAuth();
  if (authLoading) return <p role="status">Cargando sesión…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.typeUser === 'superadmin') return <Navigate to="/platform" replace />;
  const activeSpaces = user.spaces?.filter(space => space.isActive) || [];
  if (activeSpaces.length === 1) return <Navigate to="/default-page" replace />;
  return <div className="admin-plan institution-platform"><h1>Mis espacios</h1>
    {!user.spaces?.length && <section className="admin-plan__card"><p>Tu institución todavía no te habilitó en un espacio. Pedile al administrador que agregue tu usuario <strong>{user.name}</strong> o tu email.</p></section>}
    <div className="institution-platform__grid">{user.spaces?.map(space => <section key={space.id} className="admin-plan__card"><p>{space.institutionName}</p><h2>{space.name}</h2>
      {space.isActive ? <><p>Acceso habilitado.</p><Link className="admin-plan__primary admin-plan__link" to={`/chat?spaceId=${space.id}`}>Entrar al chat</Link><Link to="/default-page">Mis mensajes</Link></> : <p>Tenés permiso para este espacio. Falta que la institución lo incluya en un plan.</p>}
    </section>)}</div>
  </div>;
}
