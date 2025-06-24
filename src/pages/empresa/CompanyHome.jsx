import React, { useContext, useEffect, useState } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function CompanyHome() {
  const { user } = useContext(UserContext);
  const [publicados, setPublicados] = useState(0);
  const [ultimasMascotas, setUltimasMascotas] = useState([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [adoptionsCount, setAdoptionsCount] = useState(0);
  const [adopcionesPorMes, setAdopcionesPorMes] = useState([]);
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

  useEffect(() => {
    if (!user?.token || !user?.albergue_id) return;
    const headers = { Authorization: `Bearer ${user.token}` };

    fetch(`http://localhost:8000/matches/albergue/${user.albergue_id}`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMatchesCount(data.length))
      .catch(() => setMatchesCount(0));

    fetch(`http://localhost:8000/adopciones/albergue/${user.albergue_id}`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setAdoptionsCount(data.length);

        // Agrupar por mes
        const counts = {};
        const now = new Date();
        for (let i = 0; i < 12; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
          counts[key] = 0;
        }

        data.forEach((a) => {
          const d = new Date(a.fecha);
          const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
          if (counts[key] !== undefined) counts[key]++;
        });

        const sorted = Object.entries(counts)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([mes, value]) => ({ mes, adopciones: value }));

        setAdopcionesPorMes(sorted);
      })
      .catch(() => setAdoptionsCount(0));
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdf0df] pt-[60px] md:pt-0">
      <SidebarCompany />
      <div className="flex-1 p-4 md:p-8 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          ¡Bienvenido, {user?.name || "Tu Albergue"}!
        </h1>

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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Últimos registros</h3>
            {ultimasMascotas.length === 0 ? (
              <p className="text-sm text-gray-500">No hay registros aún.</p>
            ) : (
              ultimasMascotas.map((m) => (
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
              ))
            )}
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Adopciones por mes (último año)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adopcionesPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="adopciones" fill="#f77534" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
