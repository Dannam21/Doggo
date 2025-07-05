// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

/* --------- Estado inicial y shape del contexto --------- */
const initialUser = {
  name:            null,
  email:           null,
  token:           null,
  adoptante_id:    null,   // para usuarios
  albergue_id:     null,   // para albergues
  imagen_perfil_id:null,
};

export const UserContext = createContext({
  ...initialUser,
  setUser:  () => {},
  loading:  true,
  logout:   () => {},
});

/* --------- Provider --------- */
export function UserProvider({ children }) {
  const [user, setUser]   = useState(initialUser);
  const [loading, setLoad] = useState(true);

  /* 1️⃣  Leer del localStorage al montar */
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.token) setUser(parsed);
      } catch (err) {
        console.error("user parse error:", err);
      }
    }
    setLoad(false);
  }, []);

  /* 2️⃣  Sincronizar cambios en “user” con localStorage */
  useEffect(() => {
    if (user?.token) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  /* 3️⃣  Función de logout (opcional pero útil) */
  const logout = () => {
    setUser(initialUser);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}
