// src/pages/user/MatchUser.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { UserContext } from "../../context/UserContext";
const API_URL = "http://34.195.195.173:8000";

export default function MatchUser() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { state } = useLocation();
  const [matchExistente, setMatchExistente] = useState(null);
  const [verificandoMatch, setVerificandoMatch] = useState(true);
  const [errorMatch, setErrorMatch] = useState(null); // Nuevo estado para manejar errores
  
  const {
    dog,
    fromIndex = 0,
    origin = "/dashboard/user",
  } = state || {};

  // Verificar match existente al cargar el componente
  useEffect(() => {
    const verificarMatch = async () => {
      if (!dog || !user?.adoptante_id) {
        navigate("/dashboard/user");
        return;
      }

      const token = user?.token || localStorage.getItem("user") 
        ? JSON.parse(localStorage.getItem("user")).token 
        : null;

      if (!token) {
        navigate("/dashboard/user");
        return;
      }

      try {
        console.log("🔍 Verificando match existente al cargar...");
        const response = await fetch(`${API_URL}/matches/adoptante/${user.adoptante_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const matches = await response.json();
          const matchExistente = matches.find(match => match.mascota_id === dog.id);
          
          if (matchExistente) {
            console.log("⚠️ Ya existe un match con esta mascota, redirigiendo...");
            setMatchExistente(matchExistente);
            
            // Opcional: Redirigir automáticamente al chat
            setTimeout(() => {
              localStorage.setItem(
                "lastUserChat",
                `albergue-${dog.albergue_id}-${dog.id}`
              );
              navigate("/user/messages");
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Error verificando match:", error);
      } finally {
        setVerificandoMatch(false);
      }
    };

    verificarMatch();
  }, [dog, user, navigate]);

  const handleBack = () => {
    if (origin === "/dashboard/user") {
      navigate(origin, { state: { restoreIndex: fromIndex } });
    } else {
      navigate(origin);
    }
  };

  const irAlChat = () => {
    localStorage.setItem(
      "lastUserChat",
      `albergue-${dog.albergue_id}-${dog.id}`
    );
    navigate("/user/messages");
  };

  const iniciarChatAutomatico = async () => {
    const token = user?.token || localStorage.getItem("user") 
      ? JSON.parse(localStorage.getItem("user")).token 
      : null;

    if (!token) {
      console.error("❌ No hay token disponible");
      setErrorMatch("Error: No hay sesión activa");
      return;
    }

    if (!user?.adoptante_id) {
      console.error("❌ No hay adoptante_id disponible");
      setErrorMatch("Error: No se pudo identificar el usuario");
      return;
    }

    console.log("🔄 Iniciando chat automático...");

    try {
      console.log("📝 Registrando match...");
      const matchResponse = await fetch(`${API_URL}/matches/`, {
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

      if (!matchResponse.ok) {
        const errorData = await matchResponse.json();
        console.error("❌ Error al registrar match:", errorData);
        
        // Manejar específicamente el error 409 (Conflict) - Match duplicado
        if (matchResponse.status === 409) {
          console.log("⚠️ Match duplicado detectado, mostrando pantalla de error");
          setErrorMatch("Ya tienes un match con esta mascota. Puedes continuar la conversación en el chat.");
          return;
        }
        
        throw new Error(`Error al registrar match: ${matchResponse.status}`);
      }

      const matchData = await matchResponse.json();
      console.log("✅ Match registrado:", matchData);

      console.log("📝 Registrando match_totales...");
      const matchTotalesResponse = await fetch(`${API_URL}/match_totales/`, {
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

      if (!matchTotalesResponse.ok) {
        const errorData = await matchTotalesResponse.json();
        console.error("❌ Error al registrar match_totales:", errorData);
        throw new Error(`Error al registrar match_totales: ${matchTotalesResponse.status}`);
      }

      const matchTotalesData = await matchTotalesResponse.json();
      console.log("✅ Match_totales registrado:", matchTotalesData);

    } catch (err) {
      console.error("❌ No se pudo registrar los matches:", err);
      setErrorMatch("Error al crear el match. Por favor, intenta nuevamente.");
      return;
    }

    try {
      console.log("🔍 Obteniendo datos de la mascota...");
      const res = await fetch(`${API_URL}/usuario/mascotas/${dog.id}`);
      if (!res.ok) {
        throw new Error(`Error al obtener datos de mascota: ${res.status}`);
      }
      const mascota = await res.json();
      const albergueId = mascota.albergue_id;
      
      console.log("✅ Datos de mascota obtenidos:", mascota);
      console.log("🏠 Albergue ID:", albergueId);

      console.log("🌐 Iniciando WebSocket...");
      const socket = new WebSocket(
        `ws://34.195.195.173:8000/ws/chat/adoptante/${user.adoptante_id}`
      );

      socket.onopen = () => {
        console.log("✅ WebSocket conectado");
        
        const mensajeTexto = {
          receptor_id: albergueId,
          receptor_tipo: "albergue",
          mascota_id: dog.id,
          contenido: `Hola, ¿${dog.nombre} sigue disponible?`,
        };
        
        console.log("📤 Enviando mensaje de texto:", mensajeTexto);
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
            
            console.log("📤 Enviando mensaje de card:", mensajeCard);
            socket.send(JSON.stringify(mensajeCard));
          }

          setTimeout(() => {
            console.log("🔌 Cerrando WebSocket...");
            socket.close();
            localStorage.setItem(
              "lastUserChat",
              `albergue-${albergueId}-${dog.id}`
            );
            console.log("🏃 Navegando a mensajes...");
            navigate("/user/messages");
          }, 300);
        }, 200);
      };

      socket.onerror = (e) => {
        console.error("🛑 WebSocket error:", e);
        setErrorMatch("Error de conexión. Por favor, intenta nuevamente.");
      };
      
      socket.onclose = (e) => {
        console.warn("⚠️ WebSocket cerrado", e);
        if (e.code !== 1000) {
          console.error("❌ WebSocket cerrado inesperadamente");
        }
      };

      setTimeout(() => {
        if (socket.readyState === WebSocket.CONNECTING) {
          console.error("❌ WebSocket timeout - cerrando conexión");
          socket.close();
          setErrorMatch("Error de conexión. Por favor, intenta nuevamente.");
        }
      }, 10000);

    } catch (err) {
      console.error("❌ Error iniciando chat automático:", err);
      setErrorMatch("Error al iniciar el chat. Por favor, intenta nuevamente.");
    }
  };

  if (!dog) return null;

  if (verificandoMatch) {
    return (
      <>
        <Navbar />
        <main className="bg-[#FFF1DC] min-h-screen flex items-center justify-center p-6">
          <div className="bg-[#ee9c70] rounded-2xl p-6 max-w-sm w-full text-center text-white">
            <p>Verificando match...</p>
          </div>
        </main>
      </>
    );
  }

  // Pantalla de error por match duplicado
  if (errorMatch) {
    return (
      <>
        <Navbar />
        <main className="bg-[#FFF1DC] min-h-screen flex items-center justify-center p-6">
          <div className="bg-[#ee9c70] rounded-2xl p-6 max-w-sm w-full text-center text-white">
            <h1 className="text-2xl font-bold mb-4">¡Ups!</h1>

            <div className="bg-white rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
              <img
                src={`${API_URL}/imagenes/${dog.imagen_id}`}
                alt={dog.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mb-6 font-medium">
              {errorMatch}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBack}
                className="flex-1 bg-[#4FB286] text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
              >
                Regresar
              </button>

              <button
                onClick={irAlChat}
                className="flex-1 bg-[#4FB286] text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
              >
                Ir al Chat
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Si ya existe un match, mostrar pantalla diferente
  if (matchExistente) {
    return (
      <>
        <Navbar />
        <main className="bg-[#FFF1DC] min-h-screen flex items-center justify-center p-6">
          <div className="bg-[#ee9c70] rounded-2xl p-6 max-w-sm w-full text-center text-white">
            <h1 className="text-2xl font-bold mb-4">¡Ya tienes un Match!</h1>

            <div className="bg-white rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
              <img
                src={`${API_URL}/imagenes/${dog.imagen_id}`}
                alt={dog.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mb-6">
              Ya tienes un match con <span className="font-semibold">{dog.nombre}</span>.
            </p>

            <p className="mb-6 font-medium">
              Puedes continuar la conversación en el chat.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBack}
                className="flex-1 bg-[#4FB286] text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
              >
                Regresar
              </button>

              <button
                onClick={irAlChat}
                className="flex-1 bg-[#4FB286] text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
              >
                Ir al Chat
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

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