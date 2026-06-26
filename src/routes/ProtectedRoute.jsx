import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Si no está autenticado, lo enviamos al login y le decimos a dónde quería ir
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // Si la ruta requiere ser admin y no lo es, al inicio
    return <Navigate to="/" replace />;
  }

  // Todo correcto
  return children;
};

export default ProtectedRoute;
