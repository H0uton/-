import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

function PrivateRoute({ children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/register" />;
  }

  return children;
}

export default PrivateRoute;