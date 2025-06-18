import React, { useContext, useEffect, useState } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";


export default function CompanyHome() {
  const { user } = useContext(UserContext);
  const [publicados, setPublicados] = useState(0);
  const [ultimasMascotas, setUltimasMascotas] = useState([]);
  const navigate = useNavigate();


  // Helper para formatear "hace X...", interpretando correctamente el offset "-05"
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";

    // Convertir "YYYY-MM-DD HH:mm:ss.xxx-05" a ISO "YYYY-MM-DDTHH:mm:ss-05:00"
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
          `http://34.195.195.173:8000/mascotas/albergue/${user.albergue_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!res.ok) {
          setPublicados(0);
          setUltimasMascotas([]);
          return;
        }
        const mascotas = await res.json();

        console.log("🐶 Mascotas crudas:", mascotas);
        setPublicados(Array.isArray(mascotas) ? mascotas.length : 0);

        // Ordenar por created_at con offset o por id
        const ordenadas = [...mascotas].sort((a, b) => {
          if (a.created_at && b.created_at) {
            const toIso = (raw) => {
              const [partFecha] = raw.split(".");
              const offsetM = raw.match(/(-|\+)\d{2}$/);
              const off = offsetM ? `${offsetM[0]}:00` : "+00:00";
              return `${partFecha.replace(" ", "T")}${off}`;
            };
            return new Date(toIso(b.created_at)) - new Date(toIso(a.created_at));
          }
          return b.id - a.id;
        });

        setUltimasMascotas(ordenadas.slice(0, 5));
      } catch (e) {
        console.error("❌ Error en fetchPublicados:", e);
        setPublicados(0);
        setUltimasMascotas([]);
      }
    };

    fetchPublicados();
  }, [user]);

  // asdasda
  return (
  <div className="flex min-h-screen bg-[#fdf0df] ml-64">
      <SidebarCompany />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">
          ¡Bienvenido, {user?.name || "Tu Albergue"}!
        </h1>

        {/* Sección de estadísticas: grid de 4 tarjetas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">🐾</div>
            <p className="text-xl font-bold">{publicados}</p>
            <p className="text-sm text-gray-600">Doggos publicados</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">🟡</div>
            <p className="text-xl font-bold">3</p>
            <p className="text-sm text-gray-600">En espera de aprobación</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">📩</div>
            <p className="text-xl font-bold">5</p>
            <p className="text-sm text-gray-600">Mensajes no leídos</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">🔄</div>
            <p className="text-xl font-bold">2</p>
            <p className="text-sm text-gray-600">Adopciones logradas</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-4 mb-10">
          <button className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition"
          onClick={() => navigate("/company/adddoggo")}>
            Añadir doggo
          </button>
          <button className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition"
          onClick={() => navigate("/company/listdoggo")}>
            Ver listado
          </button>
          <button className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition"
          onClick={() => navigate("/company/editdoggos")}
          >
            Editar perfil
          </button>
          <button className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition"
          onClick={() => navigate("/company/messages")}>
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