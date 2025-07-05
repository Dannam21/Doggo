import React from "react";
import { useNavigate } from "react-router-dom";
import doggoDonation from "../assets/Donacion Doggo.jpg";

export default function DonationDoggo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf0df] p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold text-[#2e2e2e] mb-4">
          ☕ ¡Invítanos un cafecito!
        </h1>

        <p className="text-gray-700 mb-6">
          Con tu donación ayudas a mantener la plataforma activa y a seguir
          conectando corazones perrunos con nuevos hogares.
        </p>

        <img
          src={doggoDonation}
          alt="Código QR para donaciones"
          className="mx-auto rounded-lg shadow-lg object-contain max-h-96"
        />

        <p className="text-sm text-gray-500 mt-4">
          Escanea el QR con Yape o Plin y ayúdanos a seguir haciendo match 🐶💖
        </p>

        {/* 🔙 Botón para volver al home */}
        <button
          onClick={() => navigate("/home")}
          className="mt-6 inline-block bg-[#f77534] hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded-2xl transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
