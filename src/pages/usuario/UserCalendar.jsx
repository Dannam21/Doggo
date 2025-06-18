import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SidebarUser from "../../components/SidebarUser";
import { UserContext } from "../../context/UserContext";

export default function UserCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { user } = useContext(UserContext);
  const adoptanteId = user?.adoptante_id;

  const fetchEventosDeDia = async (date) => {
    const fecha = date.toISOString().split("T")[0];
    try {
      const res = await fetch(`http://34.195.195.173:8000/calendario/dia/${fecha}`);
      const data = await res.json();
      const dateKey = date.toDateString();

      const eventosFiltrados = data.filter(
        (evento) => evento.adoptante_id === adoptanteId
      );

      setEvents((prev) => ({
        ...prev,
        [dateKey]: eventosFiltrados,
      }));
    } catch (err) {
      console.error("Error cargando eventos:", err);
    }
  };

  const fetchEventoById = async (id, date) => {
    const fecha = date.toISOString().split("T")[0];
    try {
      const res = await fetch(`http://34.195.195.173:8000/calendario/dia/${fecha}`);
      const data = await res.json();

      const eventoEncontrado = data.find(
        (e) => e.id === id && e.adoptante_id === adoptanteId
      );
      if (eventoEncontrado) {
        setSelectedEvent(eventoEncontrado);
      } else {
        console.warn("No se encontró el evento");
      }
    } catch (err) {
      console.error("Error al obtener el evento:", err);
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
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedEvent(null);
              }}
              value={selectedDate}
              className="w-full rounded-xl overflow-hidden"
              tileClassName={({ date }) => {
                const key = date.toDateString();
                if (events[key] && events[key].length > 0)
                  return "bg-orange-100 text-orange-800 font-semibold";
              }}
            />
            <p className="mt-4 text-gray-700 text-center">
              Día seleccionado:{" "}
              <span className="font-medium">{selectedDate.toDateString()}</span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">📌 Mis Citas</h2>

            {(events[selectedDate.toDateString()] || []).length > 0 ? (
              <ul className="space-y-2 text-gray-800">
                {events[selectedDate.toDateString()].map((ev, idx) => (
                  <li
                    key={idx}
                    className="bg-orange-100 px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-orange-200 transition"
                    onClick={() => fetchEventoById(ev.id, selectedDate)}
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

            {selectedEvent && (
              <div className="mt-8 p-4 bg-orange-50 border border-orange-300 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-orange-700">
                  Detalles de la cita
                </h4>
                <p>
                  <strong>Asunto:</strong> {selectedEvent.asunto}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(selectedEvent.fecha_hora).toLocaleString()}
                </p>
                <p>
                  <strong>Lugar:</strong> {selectedEvent.lugar}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
