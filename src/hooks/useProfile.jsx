import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

export function useProfile() {
  const { user, setUser } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    fetch("http://34.195.195.173:8000/adoptante/me", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then(data => {
        setProfile(data);
        // opcional: sincronizar etiquetas y pesos
        setUser(prev => ({
          ...prev,
          etiquetas: data.etiquetas,
          pesos: data.pesos
        }));
      })
      .catch(() => {
        // si falla, limpias el usuario
        setUser({});
      })
      .finally(() => setLoading(false));
  }, [user?.token, setUser]);

  return { profile, loading };
}