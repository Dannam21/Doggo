import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Donations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [albergueId, setAlbergueId] = useState(null);
  const [error, setError] = useState(null);

  // ⚡ Obtener albergue_id desde el estado de navegación o localStorage
  useEffect(() => {
    // Primero intentar obtener desde el estado de navegación
    const albergueIdFromNav = location.state?.albergueId;
    
    if (albergueIdFromNav) {
      console.log("✅ albergue_id obtenido desde navegación:", albergueIdFromNav);
      setAlbergueId(albergueIdFromNav);
      return;
    }

    // Si no está en navegación, intentar desde localStorage
    const storedUser = localStorage.getItem("user");
    console.log("🔍 Usuario almacenado:", storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("📋 Usuario parseado:", parsedUser);
        
        if (parsedUser.albergue_id) {
          setAlbergueId(parsedUser.albergue_id);
          console.log("✅ albergue_id encontrado en localStorage:", parsedUser.albergue_id);
        } else {
          console.log("❌ No se encontró albergue_id en el usuario");
          setError("No se encontró el ID del albergue en el usuario");
        }
      } catch (parseError) {
        console.error("❌ Error al parsear usuario:", parseError);
        setError("Error al leer datos del usuario");
      }
    } else {
      console.log("❌ No hay usuario en localStorage");
      setError("No hay usuario logueado");
    }
  }, [location.state]);

  useEffect(() => {
    const fetchQR = async () => {
      if (!albergueId) {
        console.log("⏳ No hay albergueId, saliendo del fetch");
        setLoading(false);
        return;
      }

      console.log("🚀 Iniciando fetch para albergue ID:", albergueId);
      
      try {
        const albergueUrl = `http://34.195.195.173:8000/albergue/${albergueId}`;
        console.log("📡 Fetching:", albergueUrl);
        
        const res = await fetch(albergueUrl);
        console.log("📥 Response status:", res.status, res.statusText);
        
        if (res.ok) {
          const data = await res.json();
          console.log("📊 Datos del albergue:", data);

          if (data.qr_imagen_id) {
            const imageUrl = `http://34.195.195.173:8000/imagenes/${data.qr_imagen_id}`;
            console.log("🖼️ URL de imagen QR:", imageUrl);
            
            // 🔥 NO hacer fetch de verificación, usar directamente la URL
            setQrUrl(imageUrl);
            console.log("✅ QR URL configurada directamente (sin verificación CORS)");
          } else {
            console.log("❌ No hay qr_imagen_id en los datos del albergue");
            setError("No hay QR configurado para este albergue");
          }
        } else {
          console.error("❌ Error en response del albergue:", res.status, res.statusText);
          setError(`Error al obtener albergue: ${res.status}`);
        }
      } catch (error) {
        console.error("❌ Error en fetch:", error);
        setError(`Error de conexión: ${error.message}`);
      } finally {
        setLoading(false);
        console.log("✅ Fetch completado");
      }
    };

    fetchQR();
  }, [albergueId]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2e2e2e] text-center">¡Gracias por querer donar!</h1>
        <p className="text-gray-600 mt-2 text-center max-w-md">
          Tu apoyo ayuda a que nuestros perritos tengan un hogar más feliz y seguro. 
          Puedes realizar tu donación escaneando el QR.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">QR para donar</h2>

        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
            <p className="text-gray-500">Cargando QR...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 mb-2">❌ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-orange-500 hover:text-orange-600 text-sm underline"
            >
              Reintentar
            </button>
          </div>
        ) : qrUrl ? (
          <div className="w-full">
            <img
              src={qrUrl}
              alt="QR para donar"
              className="w-full object-contain rounded mb-4"
              onLoad={() => console.log("✅ Imagen QR cargada exitosamente")}
              onError={(e) => {
                console.error("❌ Error al cargar imagen QR:", e);
                setError("Error al mostrar la imagen QR - Posible problema CORS");
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500">Aún no se ha subido un QR.</p>
        )}

        <p className="text-gray-500 mt-2 text-center">
          Escanea el código con Yape o tu app favorita.
        </p>
      </div>

      <p className="text-sm text-gray-500 mt-6 text-center max-w-xs">
        Todo aporte, por pequeño que sea, suma muchísimo para cuidar a nuestros Doggos. 🧡🐶
      </p>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        Volver
      </button>
    </div>
  );
};

export default Donations;