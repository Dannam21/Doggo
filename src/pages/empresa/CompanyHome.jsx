import React, { useContext, useEffect, useState } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function CompanyHome() {
  const { user } = useContext(UserContext);
  const [publicados, setPublicados] = useState(0);
  const [ultimasMascotas, setUltimasMascotas] = useState([]);
  const [matchesCount, setMatchesCount] = useState(0);      
  const [adoptionsCount, setAdoptionsCount] = useState(0);   
  const navigate = useNavigate();

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const parts = timestamp.split(".");
    const datePart = parts[0];
    const offsetMatch = timestamp.match(/(-|\+)\d{2}$/);
    const offsetRaw = offsetMatch ? offsetMatch[0] : "+00";
    const offset = offsetRaw.includes(":") ? offsetRaw : `${offsetRaw}:00`;
    const isoString = `${datePart.replace(" ", "T")}${offset}`;
    const created = new Date(isoString);
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

  // 1) Mascotas publicadas y últimas
  useEffect(() => {
    const fetchPublicados = async () => {
      if (!user?.token || !user?.albergue_id) return;
      try {
        const res = await fetch(
          `http://34.195.195.173:8000/mascotas/albergue/${user.albergue_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!res.ok) throw new Error();
        const mascotas = await res.json();
        setPublicados(mascotas.length);
        const ordenadas = [...mascotas].sort((a, b) => {
          const toIso = (raw) => {
            const [partFecha] = raw.split(".");
            const offM = raw.match(/(-|\+)\d{2}$/);
            const off = offM ? `${offM[0]}:00` : "+00:00";
            return `${partFecha.replace(" ", "T")}${off}`;
          };
          return new Date(toIso(b.created_at)) - new Date(toIso(a.created_at));
        });
        setUltimasMascotas(ordenadas.slice(0, 5));
      } catch {
        setPublicados(0);
        setUltimasMascotas([]);
      }
    };
    fetchPublicados();
  }, [user]);

  // 2) Matches pendientes y Adopciones logradas
  useEffect(() => {
    if (!user?.token || !user?.albergue_id) return;
    const headers = { Authorization: `Bearer ${user.token}` };

    // Pending matches
    fetch(`http://34.195.195.173:8000/matches/albergue/${user.albergue_id}`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMatchesCount(data.length))
      .catch(() => setMatchesCount(0));

    // Completed adoptions
    fetch(`http://34.195.195.173:8000/adopciones/albergue/${user.albergue_id}`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setAdoptionsCount(data.length))
      .catch(() => setAdoptionsCount(0));
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FFF1DC] pt-[60px] md:pt-0">
      <SidebarCompany />
      <div className="flex-1 p-4 md:p-8 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          ¡Bienvenido, {user?.name || "Tu Albergue"}!
        </h1>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">🐾</div>
            <p className="text-xl font-bold">{publicados}</p>
            <p className="text-sm text-gray-600">Doggos publicados</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">💛</div>
            <p className="text-xl font-bold">{matchesCount}</p>
            <p className="text-sm text-gray-600">En espera de aprobación</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">📩</div>
            <p className="text-xl font-bold">5</p>
            <p className="text-sm text-gray-600">Mensajes no leídos</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">🔄</div>
            <p className="text-xl font-bold">{adoptionsCount}</p>
            <p className="text-sm text-gray-600">Adopciones logradas</p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <h2 className="text-xl font-semibold mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition"
            onClick={() => navigate("/company/adddoggo")}
          >
            Añadir doggo
          </button>
          <button
            className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition"
            onClick={() => navigate("/company/listdoggo")}
          >
            Ver listado
          </button>
          
          <button
            className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition"
            onClick={() => navigate("/company/messages")}
          >
            Revisar mensajes
          </button>
        </div>

        {/* Últimos registros y otra estadística */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Últimos registros</h3>
            {ultimasMascotas.length === 0 ? (
              <p className="text-sm text-gray-500">No hay registros aún.</p>
            ) : (
              ultimasMascotas.map((m) => (
                <div key={m.id} className="flex items-center gap-4 mb-3">
                  <img
                    src={`http://34.195.195.173:8000/imagenes/${m.imagen_id}`}
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
              ))
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