import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 👈 Importa los estilos
import SidebarCompany from "../../components/SidebarCompany";

export default function CompanyCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState("");

  const handleAddEvent = () => {
    if (!newEvent.trim()) return;

    const dateKey = selectedDate.toDateString();
    const updatedEvents = {
      ...events,
      [dateKey]: [...(events[dateKey] || []), newEvent],
    };
    setEvents(updatedEvents);
    setNewEvent("");
  };

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-[#2e2e2e] mb-8">📅 Calendario de Citas</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendario */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full"
            />
            <p className="mt-4 text-sm text-gray-600">
              Día seleccionado: <strong>{selectedDate.toDateString()}</strong>
            </p>
          </div>

          {/*evento */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">➕ Agregar Cita</h2>
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Ej. Visita de adopción a las 4pm"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 mb-4"
            />
            <button
              onClick={handleAddEvent}
              className="bg-[#f77534] text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition"
            >
              Guardar cita
            </button>

            {/* Lista de eventos */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">📌 Citas del {selectedDate.toDateString()}</h3>
              <ul className="list-disc list-inside text-gray-700">
                {(events[selectedDate.toDateString()] || []).map((ev, idx) => (
                  <li key={idx}>{ev}</li>
                ))}
                {!(events[selectedDate.toDateString()] || []).length && (
                  <p className="text-sm text-gray-400">Sin citas para este día</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
