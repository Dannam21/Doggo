import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
    <div className="flex min-h-screen bg-[#fdf0df] font-sans">
      <SidebarCompany />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-[#2e2e2e] mb-10 flex items-center gap-3">
          Calendario de Citas
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Calendario */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full rounded-xl overflow-hidden"
              tileClassName={({ date, view }) => {
                const key = date.toDateString();
                if (events[key]) return "bg-orange-100 text-orange-800 font-semibold";
              }}
            />
            <p className="mt-4 text-gray-700 text-center">
              Día seleccionado: <span className="font-medium">{selectedDate.toDateString()}</span>
            </p>
          </div>

          {/* Evento */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">➕ Agregar Cita</h2>
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Ej. Visita de adopción a las 4pm"
              className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleAddEvent}
              className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition font-semibold"
            >
              Guardar cita
            </button>

            {/* Lista de eventos */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3 text-gray-700">
                📌 Citas del {selectedDate.toDateString()}
              </h3>
              {(events[selectedDate.toDateString()] || []).length > 0 ? (
                <ul className="space-y-2 text-gray-800">
                  {events[selectedDate.toDateString()].map((ev, idx) => (
                    <li key={idx} className="bg-orange-100 px-4 py-2 rounded-lg shadow-sm">
                      {ev}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">Sin citas para este día</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
