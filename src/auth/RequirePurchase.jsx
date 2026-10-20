import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RequirePurchase({ children, allowAdminInbox = false }) {
  const { user, authLoading, sessionError } = useAuth();
  if (authLoading) return <p role="status">Cargando sesión…</p>;
  if (sessionError) return <p role="alert">{sessionError}</p>;
  const canUseInbox = allowAdminInbox && user?.typeUser === 'admin' && user?.managedInstitutions?.length > 0;
  if (!user?.hasAccess && user?.typeUser !== 'superadmin' && !canUseInbox) return <Navigate to="/home" replace />;
  return children;
}
