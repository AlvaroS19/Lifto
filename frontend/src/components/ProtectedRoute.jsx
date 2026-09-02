import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

// Esto es un "wrapper": envuelve a otro componente y decide si lo muestra o no.
// Uso: <ProtectedRoute><Dashboard /></ProtectedRoute>
export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
