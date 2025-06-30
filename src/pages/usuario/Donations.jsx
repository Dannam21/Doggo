import React from "react";
import { useNavigate } from "react-router-dom";

const Donations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2e2e2e] text-center">¡Gracias por querer donar!</h1>
        <p className="text-gray-600 mt-2 text-center max-w-md">
          Tu apoyo ayuda a que nuestros perritos tengan un hogar más feliz y seguro. 
          Puedes realizar tu donación escaneando el QR.
        </p>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">QR para donar</h2>
       
        <p className="text-gray-500 mt-4 text-center">
          Escanea el código con Yape o tu app favorita.
        </p>
      </div>

      {/* Mensaje final */}
      <p className="text-sm text-gray-500 mt-6 text-center max-w-xs">
        Todo aporte, por pequeño que sea, suma muchísimo para cuidar a nuestros Doggos. 🧡🐶
      </p>

      {/* Botón regresar */}
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
