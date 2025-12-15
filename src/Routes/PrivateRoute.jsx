import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-8 text-center">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    else if (user.role === "volunteer") return <Navigate to="/volunteer" replace />;
    else return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
