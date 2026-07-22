import { Navigate } from 'react-router-dom';
import { getStoredToken, isTokenExpired } from '@/utils/tokenUtils';

export default function ProtectedRoute({ children }) {
  const token = getStoredToken();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
