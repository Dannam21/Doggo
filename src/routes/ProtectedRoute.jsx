import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();

  /* pantalla de carga mientras se verifica la sesión */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando…</p>
      </div>
    );
  }

  /* 1️⃣  Si no hay token */
  if (!user?.token) {
    const shouldRemember =
      !location.pathname.startsWith("/company") &&           // descarta /company…
      !location.pathname.startsWith("/user") &&  
      location.pathname !== "/dashboard/user";               // …y /dashboard/user

    if (shouldRemember) {
      sessionStorage.setItem(
        "postAuthRedirect",
        JSON.stringify({ pathname: location.pathname, state: location.state })
      );
    }

    return <Navigate to="/login" replace />;
  }

  /* 2️⃣  Con sesión válida */
  return children;
}
