import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RequirePurchase({ children }) {
  const { user, authLoading, sessionError } = useAuth();
  if (authLoading) return <p role="status">Cargando sesión…</p>;
  if (sessionError) return <p role="alert">{sessionError}</p>;
  if (!user?.purchase) return <Navigate to="/home" replace />;
  return children;
}
