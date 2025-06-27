import React, { useContext, useEffect, useState } from "react";
import SidebarUser from "../../components/SidebarUser";
import { UserContext } from "../../context/UserContext";
import { FaCalendarAlt } from "react-icons/fa";

export default function UserHome() {
  const { user } = useContext(UserContext);
  const [matches, setMatches] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token || !user?.adoptante_id) return;
    const headers = { Authorization: `Bearer ${user.token}` };

    fetch(`http://localhost:8000/matches/adoptante/${user.adoptante_id}`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then(setMatches)
      .catch(() => setMatches([]));

    fetch(`http://localhost:8000/adopciones/adoptante/${user.adoptante_id}`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then(setAdoptions)
      .catch(() => setAdoptions([]))
      .finally(() => setLoading(false));
  }, [user]);

  const adoptedCount = adoptions.length;
  const inProcessCount = matches.length;

  const recentMatches = matches
    .slice(-5)
    .reverse()
    .map((m) => ({
      id: m.mascota.id,
      nombre: m.mascota.nombre,
      imagen: `http://localhost:8000/imagenes/${m.mascota.imagen_id}`,
      fecha: new Date(m.fecha).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdf0df] pt-14 md:pt-0 font-sans">
      <SidebarUser />
      <main className="flex-1 px-4 py-6 sm:px-6 md:px-10 md:pl-80 transition-all duration-300">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
          ¡Bienvenid@, {user?.name || "Adoptante"}!
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <div className="text-3xl mb-2">🐶</div>
            <p className="text-xl font-bold">{adoptedCount}</p>
            <p className="text-sm text-gray-600">Doggos adoptados</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <div className="text-3xl mb-2">🔄</div>
            <p className="text-xl font-bold">{inProcessCount}</p>
            <p className="text-sm text-gray-600">Adopciones en proceso</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <div className="text-3xl mb-2">📩</div>
            <p className="text-xl font-bold">0</p>
            <p className="text-sm text-gray-600">Mensajes no leídos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Últimos Matches</h3>
            {loading ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : recentMatches.length === 0 ? (
              <p className="text-sm text-gray-500">No tienes matches recientes.</p>
            ) : (
              <div className="space-y-4">
                {recentMatches.map((rm) => (
                  <div key={rm.id} className="flex items-center gap-4">
                    <img
                      src={rm.imagen}
                      alt={rm.nombre}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{rm.nombre}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaCalendarAlt /> {rm.fecha}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Calendario</h3>
            <p className="text-sm text-gray-500">Aquí verás tus próximas citas.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
