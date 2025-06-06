import React, { useContext, useEffect, useState } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import { UserContext } from "../../context/UserContext";

export default function CompanyHome() {
  const { user } = useContext(UserContext);
  const [publicados, setPublicados] = useState(0);
  const [ultimasMascotas, setUltimasMascotas] = useState([]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";

    const created = new Date(timestamp);
    if (isNaN(created)) return "";

    const now = new Date();
    const diffMs = now - created;
    const diffMinutes = Math.floor(diffMs / 1000 / 60);

    if (diffMinutes < 1) return "Justo ahora";
    if (diffMinutes < 60) return `${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} día${diffDays > 1 ? "s" : ""}`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} mes${diffMonths > 1 ? "es" : ""}`;
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} año${diffYears > 1 ? "s" : ""}`;
  };

  useEffect(() => {
    const fetchPublicados = async () => {
      if (!user?.token || !user?.albergue_id) return;
      try {
        const res = await fetch(
          `http://localhost:8000/mascotas/albergue/${user.albergue_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!res.ok) {
          setPublicados(0);
          return;
        }
        const mascotas = await res.json();

        setPublicados(Array.isArray(mascotas) ? mascotas.length : 0);

        let ordenadas = [...mascotas];
        if (mascotas[0]?.created_at) {
          ordenadas.sort((a, b) => {
            const aDate = new Date(a.created_at);
            const bDate = new Date(b.created_at);
            return bDate - aDate;
          });
        } else {
          ordenadas.sort((a, b) => b.id - a.id);
        }

        setUltimasMascotas(ordenadas.slice(0, 5));
      } catch (e) {
        setPublicados(0);
        setUltimasMascotas([]);
      }
    };

    fetchPublicados();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">
          ¡Bienvenido, {user?.name || "Tu Albergue"}!
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        </div>

        <h2 className="text-xl font-semibold mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-4 mb-10">
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Últimos registros</h3>
            {ultimasMascotas.length === 0 ? (
              <p className="text-sm text-gray-500">No hay registros aún.</p>
            ) : (
              ultimasMascotas.map((m) => {
                return (
                  <div key={m.id} className="flex items-center gap-4 mb-3">
                    <img
                      src={`http://localhost:8000/imagenes/${m.imagen_id}`}
                      alt={m.nombre}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                    <div>
                      <p className="font-medium">{m.nombre}</p>
                      <p className="text-sm text-gray-500">
                        Registrado hace {formatTimeAgo(m.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-300 to-teal-400 opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
