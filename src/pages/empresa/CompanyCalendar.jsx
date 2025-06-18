// 👇 IMPORTACIONES
import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SidebarCompany from "../../components/SidebarCompany";
import { UserContext } from "../../context/UserContext";

export default function CompanyCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState("");
  const [tipoEvento, setTipoEvento] = useState("evento");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [manualAdoptanteId, setManualAdoptanteId] = useState(null);
  const [adoptantesDisponibles, setAdoptantesDisponibles] = useState([]);

  const { user } = useContext(UserContext);
  const albergueId = user?.albergue_id;

  // ✅ CARGAR EVENTOS DE UN DÍA
  const fetchEventosDeDia = async (date) => {
    const fecha = date.toISOString().split("T")[0];
    try {
      const res = await fetch(`http://34.195.195.173:8000/calendario/dia/${fecha}`);
      const data = await res.json();
      const eventosConTipo = data;


      const dateKey = date.toDateString();

      setEvents((prev) => ({
        ...prev,
        [dateKey]: eventosConTipo,
      }));
    } catch (err) {
      console.error("Error cargando eventos del día:", err);
    }
  };

  
  const fetchEventoById = async (id, date) => {
    const fecha = date.toISOString().split("T")[0];
    try {
      const res = await fetch(`http://34.195.195.173:8000/calendario/dia/${fecha}`);
      const data = await res.json();
  
      const eventosConTipo = data.map((evento) => {
        const isVisita = "adoptante_id" in evento && evento.adoptante_id !== null;
        return {
          ...evento,
          tipo: isVisita ? "visita" : "evento",
          adoptante_id: isVisita ? evento.adoptante_id : null,
        };
      });
  
      const eventoEncontrado = eventosConTipo.find(e => e.id === id);
      if (eventoEncontrado) {
        setSelectedEvent(eventoEncontrado);
      } else {
        console.warn("❌ No se encontró el evento por ID");
      }
    } catch (err) {
      console.error("Error al obtener evento por ID:", err);
    }
  };
  
  useEffect(() => {
    fetchEventosDeDia(selectedDate);
  }, [selectedDate]);

  // 👥 ADOPTANTES CONVERSADOS
  useEffect(() => {
    if (user?.albergue_id) {
      fetch(`http://34.195.195.173:8000/mensajes/contactos?emisor_id=${user.albergue_id}&emisor_tipo=albergue`)
        .then(res => res.json())
        .then(data => {
          const adoptantes = data.filter(contacto => contacto.userType === "adoptante");
          setAdoptantesDisponibles(adoptantes);
        })
        .catch(err => console.error("Error al obtener contactos adoptantes:", err));
    }
  }, [user?.albergue_id]);

  const handleAddEvent = async () => {
    if (!newEvent.trim()) return;

    const fechaISO = selectedDate.toISOString();

    const baseCalendario = {
      fecha_hora: fechaISO,
      asunto: newEvent,
      lugar: "Albergue principal",
      albergue_id: albergueId,
    };

    let endpoint = "";
    let payload = {};

    const adoptanteId = user?.adoptante_id || manualAdoptanteId;

    if (tipoEvento === "evento") {
      endpoint = "http://34.195.195.173:8000/calendario/evento";
      payload = { calendario: baseCalendario };
    } else {
      if (!adoptanteId) {
        alert("⚠️ Debes seleccionar un adoptante para registrar una visita.");
        return;
      }

      endpoint = "http://34.195.195.173:8000/calendario/visita";
      payload = {
        calendario: baseCalendario,
        adoptante_id: adoptanteId,
      };
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al registrar");

      const cita = await res.json();
      cita.tipo = tipoEvento;
      if (tipoEvento === "visita") {
        cita.adoptante_id = adoptanteId;
      }

      const dateKey = selectedDate.toDateString();
      const updatedEvents = {
        ...events,
        [dateKey]: [...(events[dateKey] || []), cita],
      };

      setEvents(updatedEvents);
      setNewEvent("");
      alert("✅ Cita guardada exitosamente");
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar la cita");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdf0df] ml-64">
      <SidebarCompany />
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-[#2e2e2e] mb-10 flex items-center gap-3">
          Calendario de Citas
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* CALENDARIO */}
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
              Día seleccionado: <span className="font-medium">{selectedDate.toDateString()}</span>
            </p>
          </div>

          {/* AGREGAR CITA */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">➕ Agregar Cita</h2>

            <div className="flex mb-4 space-x-4">
              <button
                className={`py-2 px-4 rounded-lg font-semibold ${
                  tipoEvento === "evento"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setTipoEvento("evento")}
              >
                Evento
              </button>
              <button
                className={`py-2 px-4 rounded-lg font-semibold ${
                  tipoEvento === "visita"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setTipoEvento("visita")}
              >
                Visita
              </button>
            </div>

            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Ej. Visita de adopción a las 4pm"
              className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-orange-400"
            />

            {/* SELECT DE ADOPTANTES */}
            {tipoEvento === "visita" && (
              <select
                value={manualAdoptanteId || ""}
                onChange={(e) => setManualAdoptanteId(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Selecciona un adoptante</option>
                {adoptantesDisponibles.map((adop) => (
                  <option key={adop.userId} value={adop.userId}>
                    {adop.name} (ID: {adop.userId})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleAddEvent}
              className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition font-semibold"
            >
              Guardar cita
            </button>

            {/* LISTA DE EVENTOS DEL DÍA */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3 text-gray-700">
                📌 Citas del {selectedDate.toDateString()}
              </h3>
              {(events[selectedDate.toDateString()] || []).length > 0 ? (
                <ul className="space-y-2 text-gray-800">
                  {events[selectedDate.toDateString()].map((ev, idx) => (
                    <li
                      key={idx}
                      className="bg-orange-100 px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-orange-200 transition"
                      onClick={() => fetchEventoById(ev.id, selectedDate)}
                      >
                      {ev.asunto} {ev.tipo === "visita" && "(Visita)"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">Sin citas para este día</p>
              )}
            </div>

            {/* DETALLES DEL EVENTO */}
            {(events[selectedDate.toDateString()] || []).length > 0 && (
  <div className="mt-8 p-4 bg-orange-50 border border-orange-300 rounded-lg">
    <h4 className="text-lg font-semibold mb-4 text-orange-700">📄 Detalles del día</h4>
    <ul className="space-y-4">
      {events[selectedDate.toDateString()].map((evento) => (
        <li key={evento.id} className="bg-white rounded-xl p-4 shadow border border-orange-200">
          <p><strong>Asunto:</strong> {evento.asunto}</p>
          <p><strong>Fecha:</strong> {new Date(evento.fecha_hora).toLocaleString()}</p>
          <p><strong>Lugar:</strong> {evento.lugar}</p>
          <p><strong>Tipo:</strong> {evento.tipo === "visita" ? "Visita" : "Evento"}</p>
          {evento.tipo === "visita" && (
  <p>
    <strong>Adoptante:</strong>{" "}
    {
      adoptantesDisponibles.find(adop => adop.userId === evento.adoptante_id)
        ? `${adoptantesDisponibles.find(adop => adop.userId === evento.adoptante_id).name} (ID: ${evento.adoptante_id})`
        : `ID: ${evento.adoptante_id || "Desconocido"}`
    }
  </p>
)}


        </li>
      ))}
    </ul>
  </div>
)}

          </div>
        </div>
      </main>
    </div>
  );
}
