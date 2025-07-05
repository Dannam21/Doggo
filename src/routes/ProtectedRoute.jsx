import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();         
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando…</p>
      </div>
    );
  }

  if (!user?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
