import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Donations = () => {
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [albergueId, setAlbergueId] = useState(null);

  // ⚡ Cargar el user del localStorage y obtener albergue_id
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.albergue_id) {
        setAlbergueId(parsedUser.albergue_id);
      }
    }
  }, []);

  useEffect(() => {
    const fetchQR = async () => {
      if (!albergueId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:8000/albergue/${albergueId}`);
        if (res.ok) {
          const data = await res.json();

          if (data.qr_imagen_id) {
            setQrUrl(`http://localhost:8000/imagenes/${data.qr_imagen_id}`);

          }
        } else {
          console.error("Error al obtener albergue");
        }
      } catch (error) {
        console.error("Error al traer QR:", error);
      } finally {
        setLoading(false);
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
          <p className="text-gray-500">Cargando QR...</p>
        ) : qrUrl ? (
          <img
            src={qrUrl}
            alt="QR para donar"
            className="w-full object-contain rounded mb-4"
          />
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
