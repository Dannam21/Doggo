import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SidebarUser from "../../components/SidebarUser";
import { UserContext } from "../../context/UserContext";

export default function UserCalendar() {
  const [selectedDate] = useState(new Date()); // Día actual fijo
  const [events, setEvents] = useState([]);
  const { user } = useContext(UserContext);
  const adoptanteId = user?.adoptante_id;

  const fetchEventosDeDia = async (date) => {
    const fecha = date.toISOString().split("T")[0];
    try {
      const res = await fetch(`http://localhost:8000/calendario/dia/${fecha}`);
      const data = await res.json();

      // Filtrar por adoptante y que venga del company (asumimos que eso se puede identificar)
      const eventosFiltrados = data.filter(
        (evento) =>
          evento.adoptante_id === adoptanteId &&
          evento.emisor_tipo === "albergue" // Aquí filtramos los que vienen del company
      );

      setEvents(eventosFiltrados);
    } catch (err) {
      console.error("Error cargando eventos:", err);
    }
  };

  useEffect(() => {
    fetchEventosDeDia(selectedDate);
  }, [selectedDate]);

  return (
    <div className="flex min-h-screen bg-[#fdf0df] font-sans">
      <SidebarUser />
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-[#2e2e2e] mb-10 flex items-center gap-3">
          Mi Calendario
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <Calendar
              value={selectedDate}
              className="w-full rounded-xl overflow-hidden pointer-events-none opacity-50"
              tileDisabled={() => true} // evita interacción
            />
            <p className="mt-4 text-gray-700 text-center">
  Día actual:{" "}
  <span className="font-medium">
    {selectedDate.toLocaleDateString("es-PE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
  </span>
</p>

          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">📌 Mis Citas</h2>

            {events.length > 0 ? (
              <ul className="space-y-2 text-gray-800">
                {events.map((ev, idx) => (
                  <li
                    key={idx}
                    className="bg-orange-100 px-4 py-2 rounded-lg shadow-sm"
                  >
                    {ev.asunto}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">
                No tienes citas programadas para este día
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
