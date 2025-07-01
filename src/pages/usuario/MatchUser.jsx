// src/pages/user/MatchUser.jsx
import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { UserContext } from "../../context/UserContext";

export default function MatchUser() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { state } = useLocation();
  const { dog, fromIndex } = state || {};

  // Si no viene dog en el state, redirige de vuelta
  if (!dog) {
    navigate("/dashboard/user");
    return null;
  }

  const iniciarChatAutomatico = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // 1️⃣ Registrar en matches
      const matchRes = await fetch("http://34.195.195.173:8000/matches/", {
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
      if (!matchRes.ok) throw new Error("Error al registrar el match");
      console.log("✅ Match registrado correctamente");

      // 2️⃣ Registrar en match_totales
      const totalRes = await fetch("http://34.195.195.173:8000/match_totales/", {
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
      if (!totalRes.ok) throw new Error("Error al registrar match_totales");
      console.log("✅ MatchTotal registrado correctamente");
    } catch (err) {
      console.error("❌ No se pudo registrar los matches:", err);
      return;
    }

    try {
      // 3️⃣ Obtener datos de la mascota (para el albergue_id, si no lo tenías)
      const res = await fetch(`http://34.195.195.173:8000/usuario/mascotas/${dog.id}`);
      if (!res.ok) throw new Error("No se encontró la mascota");
      const mascota = await res.json();
      const albergueId = mascota.albergue_id;

      // 4️⃣ Abrir WebSocket y enviar mensajes
      const socket = new WebSocket(
        `ws://34.195.195.173:8000/ws/chat/adoptante/${user.adoptante_id}`
      );

      socket.onopen = () => {
        console.log("✅ WebSocket abierto");

        // Mensaje de texto
        const mensajeTexto = {
          receptor_id: albergueId,
          receptor_tipo: "albergue",
          mascota_id: dog.id,
          contenido: `Hola, ¿${dog.nombre} sigue disponible?`,
        };
        socket.send(JSON.stringify(mensajeTexto));
        console.log("📤 MensajeTexto enviado");

        // Mensaje de tarjeta con delay
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
                imagen: `http://34.195.195.173:8000/imagenes/${dog.imagen_id}`,
              }),
            };
            socket.send(JSON.stringify(mensajeCard));
            console.log("📤 MensajeCard enviado");
          }

          // Cerrar socket y navegar a la lista de mensajes
          setTimeout(() => {
            socket.close();
            console.log("❌ WebSocket cerrado manualmente");
            localStorage.setItem(
              "lastUserChat",
              `albergue-${albergueId}-${dog.id}`
            );
            navigate("/user/messages");
          }, 300);
        }, 200);
      };

      socket.onerror = (e) => {
        console.error("🛑 WebSocket error:", e);
      };
      socket.onclose = (e) => {
        console.warn("⚠️ WebSocket cerrado", e);
      };
    } catch (err) {
      console.error("❌ Error iniciando chat automático:", err);
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#FFF1DC] min-h-screen flex items-center justify-center p-6">
        <div className="bg-[#ee9c70] rounded-2xl p-6 max-w-sm w-full text-center text-white">
          <h1 className="text-2xl font-bold mb-4">¡Es un Match!</h1>
          <div className="bg-white rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
            <img
              src={`http://34.195.195.173:8000/imagenes/${dog.imagen_id}`}
              alt={dog.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mb-6">
            Has dado like a{" "}
            <span className="font-semibold">{dog.nombre}</span> y también te ha
            dado like.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() =>
                navigate("/dashboard/user", { state: { restoreIndex: fromIndex } })
              }
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
