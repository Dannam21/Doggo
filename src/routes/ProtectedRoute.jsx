// src/routes/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();
  const path = location.pathname;

  // 1️⃣ Esperar a que termine la carga del contexto
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando…</p>
      </div>
    );
  }

  // 2️⃣ Validar token
  if (!user?.token) {
    // Guardar la ruta si no es login o registro
    const shouldRemember =
      !path.startsWith("/login") &&
      !path.startsWith("/register") &&
      !path.startsWith("/cuestionario") &&
      !path.startsWith("/preferences");

    if (shouldRemember) {
      sessionStorage.setItem(
        "postAuthRedirect",
        JSON.stringify({ pathname: path, state: location.state })
      );
    }
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Validar rol según la ruta
  const isCompanyRoute = path.startsWith("/company");
  const isUserRoute = 
    path.startsWith("/user") ||
    path === "/dashboard/user" ||
    path.startsWith("/doggoUser") ||
    path.startsWith("/doggoMatch") ||
    path.startsWith("/dashboard");

  if (isCompanyRoute && !user.albergue_id) {
    // Intento de acceder a ruta de empresa sin albergue_id
    return <Navigate to="/login" replace />;
  }

  if (isUserRoute && !user.adoptante_id) {
    // Intento de acceder a ruta de usuario sin adoptante_id
    return <Navigate to="/login" replace />;
  }

  // 4️⃣ Todo OK → renderiza los hijos
  return children;
}
