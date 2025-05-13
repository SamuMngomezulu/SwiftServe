// RequireAuth.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children, allowedRoles }) => {
    const { user, hasRole } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default RequireAuth;