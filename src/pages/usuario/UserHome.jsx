import React, { useContext, useEffect, useState, useMemo } from "react";
import SidebarUser from "../../components/SidebarUser";
import { UserContext } from "../../context/UserContext";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

/**
 * HOME del adoptante
 * Muestra métricas + 3 próximas citas ordenadas por fecha ascendente
 */
export default function UserHome() {
  const { user } = useContext(UserContext);

  const [matches, setMatches] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------- */
  /*            FETCH MÉTRICAS + CITAS         */
  /* ----------------------------------------- */
  useEffect(() => {
    if (!user?.token || !user?.adoptante_id) return;

    const headers = { Authorization: `Bearer ${user.token}` };

    Promise.all([
      fetch(
        `http://34.195.195.173:8000/matches/adoptante/${user.adoptante_id}`,
        { headers }
      ).then((r) => (r.ok ? r.json() : [])),

      fetch(
        `http://34.195.195.173:8000/adopciones/adoptante/${user.adoptante_id}`,
        { headers }
      ).then((r) => (r.ok ? r.json() : [])),

      fetch(
        `http://34.195.195.173:8000/calendario/adoptante/${user.adoptante_id}`,
        { headers }
      ).then((r) => (r.ok ? r.json() : [])), // ← citas
    ])
      .then(([m, a, c]) => {
        setMatches(m);
        setAdoptions(a);
        setAppointments(c);
      })
      .catch(() => {
        setMatches([]);
        setAdoptions([]);
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  /* ----------------------------------------- */
  /*            DERIVADAS Y FORMATO            */
  /* ----------------------------------------- */
  const adoptedCount = adoptions.length;
  const inProcessCount = matches.length;

  const recentMatches = useMemo(
    () =>
      matches
        .slice(-5)
        .reverse()
        .map((m) => ({
          id: m.mascota.id,
          nombre: m.mascota.nombre,
          imagen: `http://34.195.195.173:8000/imagenes/${m.mascota.imagen_id}`,
          // 🔧 FIX: Convertir la fecha a string formateada
          fecha: new Date(m.fecha).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }),
        })),
    [matches]
  );

  // ‼️  SOLO 3 citas más próximas (≥ hoy) ordenadas
  const nextAppointments = useMemo(() => {
    const hoy = new Date();
    return [...appointments]
      .filter((c) => new Date(c.fecha_hora) >= hoy)
      .sort(
        (a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)
      )
      .slice(0, 3);
  }, [appointments]);

  /* ----------------------------------------- */
  /*                RENDER                     */
  /* ----------------------------------------- */
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdf0df] pt-14 md:pt-0 font-sans">
      <SidebarUser />

      <main className="flex-1 px-4 py-6 sm:px-6 md:px-10 md:pl-80 transition-all duration-300">
        {/* ---------- saludo ---------- */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
          ¡Bienvenid@, {user?.name || "Adoptante"}!
        </h1>

        {/* ---------- tarjetas métricas ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {/* adoptados */}
          <MetricCard
            emoji="🐶"
            value={adoptedCount}
            label="Doggos adoptados"
          />

          {/* en proceso */}
          <MetricCard
            emoji="🔄"
            value={inProcessCount}
            label="Adopciones en proceso"
          />

          {/* mensajes */}
          <MetricCard
            emoji="📩"
            value={0}
            label="Mensajes no leídos (próximamente)"
          />
        </div>

        {/* ---------- paneles (matches & calendario) ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Últimos matches */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Últimos matches</h3>

            {loading ? (
              <p className="text-sm text-gray-500">Cargando…</p>
            ) : recentMatches.length === 0 ? (
              <p className="text-sm text-gray-500">
                No tienes matches recientes.
              </p>
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

          {/* Próximas citas */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Tus 3 próximas citas</h3>

            {loading ? (
              <p className="text-sm text-gray-500">Cargando…</p>
            ) : nextAppointments.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aún no tienes citas programadas.
              </p>
            ) : (
              <ul className="space-y-4">
                {nextAppointments.map((cita) => {
                  const fechaObj = new Date(cita.fecha_hora);
                  const dia = fechaObj.toLocaleDateString("es-PE", {
                    day: "2-digit",
                  });
                  const mes = fechaObj
                    .toLocaleDateString("es-PE", { month: "short" })
                    .toUpperCase();
                  const hora = fechaObj.toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <li
                      key={cita.id}
                      className="flex items-center gap-4 bg-orange-50 rounded-xl p-4 shadow-sm hover:shadow transition"
                    >
                      {/* fecha "badge" */}
                      <div className="flex flex-col items-center justify-center bg-orange-500 text-white rounded-lg w-14 py-1">
                        <span className="text-lg font-bold leading-none">
                          {dia}
                        </span>
                        <span className="text-xs tracking-widest">{mes}</span>
                      </div>

                      {/* detalle */}
                      <div className="flex-1">
                        <p className="font-medium">{cita.titulo}</p>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <FaClock /> {hora}
                        </p>
                        {cita.asunto && (
                          <p className="text-xs text-gray-500 mt-1">
                            {cita.asunto}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- componente para las tarjetas métricas --- */
function MetricCard({ emoji, value, label }) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow">
      {/* degradado decorativo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/40 via-orange-400/40 to-orange-500/40 blur-lg scale-150" />
      <div className="relative bg-white/60 backdrop-blur p-6 text-center rounded-2xl">
        <div className="text-3xl mb-2">{emoji}</div>
        <p className="text-xl font-extrabold">{value}</p>
        <p className="text-sm text-gray-700">{label}</p>
      </div>
    </div>
  );
}