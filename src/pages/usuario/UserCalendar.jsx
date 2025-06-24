import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SidebarUser from "../../components/SidebarUser";
import { UserContext } from "../../context/UserContext";

export default function UserCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const { user } = useContext(UserContext);
  const adoptanteId = user?.adoptante_id;

  const fetchEventosDeDia = async (date) => {
    const fecha = date.toISOString().split("T")[0];
    try {
      const res = await fetch(
        `http://34.195.195.173:8000/calendario/dia/${fecha}?adoptante_id=${adoptanteId}`
      );
      const data = await res.json();

      const eventosFiltrados = data.filter(
        (evento) =>
          evento.tipo === "visita" &&
          String(evento.adoptante_id) === String(adoptanteId)
      );
      setEvents(eventosFiltrados);
    } catch (err) {
      console.error("Error cargando eventos:", err);
    }
  };

  useEffect(() => {
    if (adoptanteId) {
      fetchEventosDeDia(selectedDate);
    }
  }, [selectedDate, adoptanteId]);

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
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full rounded-xl overflow-hidden"
            />
            <p className="mt-4 text-gray-700 text-center">
              Día seleccionado:{" "}
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
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              📌 Mis Citas
            </h2>

            {events.length > 0 ? (
              <ul className="space-y-2 text-gray-800">
                {events.map((ev) => (
                  <li
                    key={ev.id}
                    className="bg-orange-100 px-4 py-2 rounded-lg shadow-sm"
                  >
                    <div className="font-bold">{ev.asunto}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(ev.fecha_hora).toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
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
