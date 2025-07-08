// src/pages/user/MatchUser.jsx
import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { UserContext } from "../../context/UserContext";

// 👉  Si ya tienes un archivo de configuración de tu API, reemplaza la URL fija.
const API_URL = "http://34.195.195.173:8000";

export default function MatchUser() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { state } = useLocation();
  const {
    dog,
    fromIndex = 0,
    origin = "/dashboard/user", // ruta desde la que llegaste
  } = state || {};

  /* ───────── REDIRECCIÓN SEGURA ───────── */
  useEffect(() => {
    if (!dog) navigate("/dashboard/user");
  }, [dog, navigate]);
  if (!dog) return null;

  /* ───────── FUNCIÓN “REGRESAR” ───────── */
  const handleBack = () => {
    if (origin === "/dashboard/user") {
      // vuelve al carrusel y restaura el índice
      navigate(origin, { state: { restoreIndex: fromIndex } });
    } else {
      // vuelve al detalle u otra página
      navigate(origin);
    }
  };

  /* ───────── CHAT AUTOMÁTICO ───────── */
  const iniciarChatAutomatico = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      /* 1️⃣  Registrar match */
      await fetch(`${API_URL}/matches/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adoptante_id: user.adoptante_id,
          mascota_id: dog.id,
        }),
      });

      /* 2️⃣  Registrar match_totales */
      await fetch(`${API_URL}/match_totales/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          albergue_id: dog.albergue_id,
          adoptante_id: user.adoptante_id,
          mascota_id: dog.id,
        }),
      });
    } catch (err) {
      console.error("❌ No se pudo registrar los matches:", err);
      return;
    }

    try {
      /* 3️⃣  Obtener datos de la mascota */
      const res = await fetch(`${API_URL}/usuario/mascotas/${dog.id}`);
      if (!res.ok) throw new Error();
      const mascota = await res.json();
      const albergueId = mascota.albergue_id;

      /* 4️⃣  WebSocket para enviar mensajes */
      const socket = new WebSocket(
        `ws://34.195.195.173:8000/ws/chat/adoptante/${user.adoptante_id}`
      );

      socket.onopen = () => {
        const mensajeTexto = {
          receptor_id: albergueId,
          receptor_tipo: "albergue",
          mascota_id: dog.id,
          contenido: `Hola, ¿${dog.nombre} sigue disponible?`,
        };
        socket.send(JSON.stringify(mensajeTexto));

        setTimeout(() => {
          if (socket.readyState === WebSocket.OPEN) {
            const mensajeCard = {
              receptor_id: albergueId,
              receptor_tipo: "albergue",
              mascota_id: dog.id,
              contenido: JSON.stringify({
                tipo: "card_perro",
                nombre: dog.nombre,
                descripcion: dog.descripcion,
                imagen: `${API_URL}/imagenes/${dog.imagen_id}`,
              }),
            };
            socket.send(JSON.stringify(mensajeCard));
          }

          setTimeout(() => {
            socket.close();
            localStorage.setItem(
              "lastUserChat",
              `albergue-${albergueId}-${dog.id}`
            );
            navigate("/user/messages");
          }, 300);
        }, 200);
      };

      socket.onerror = (e) => console.error("🛑 WebSocket error:", e);
      socket.onclose = (e) => console.warn("⚠️ WebSocket cerrado", e);
    } catch (err) {
      console.error("❌ Error iniciando chat automático:", err);
    }
  };

  /* ───────── UI ───────── */
  return (
    <>
      <Navbar />
      <main className="bg-[#FFF1DC] min-h-screen flex items-center justify-center p-6">
        <div className="bg-[#ee9c70] rounded-2xl p-6 max-w-sm w-full text-center text-white">
          <h1 className="text-2xl font-bold mb-4">¡Es un Match!</h1>

          <div className="bg-white rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
            <img
              src={`${API_URL}/imagenes/${dog.imagen_id}`}
              alt={dog.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="mb-6">
            Has dado like a <span className="font-semibold">{dog.nombre}</span>{" "}
            y también te ha dado like.
          </p>

          {/* ───────── Nuevo mensaje de confirmación ───────── */}
          <p className="mb-6 font-medium">
            ¿Quieres confirmar el Match? Presiona <span className="italic">Continuar</span>.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBack}
              className="flex-1 bg-[#4FB286] text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
            >
              Regresar
            </button>

            <button
              onClick={iniciarChatAutomatico}
              className="flex-1 bg-[#4FB286] text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
            >
              Continuar
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
