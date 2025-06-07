import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // Mientras se carga el usuario desde localStorage, no renderizar nada (o un loader si prefieres)
  if (loading) {
    return <div>Cargando...</div>; // Aquí puedes poner un spinner si quieres
  }

  // Si no hay sesión, redirigir al home
  if (!user || !user.token) {
    return <Navigate to="/home" replace />;
  }

  // Si hay sesión, permitir acceso
  return children;
};

export default ProtectedRoute;
