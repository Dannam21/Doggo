import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MatchIntroForm() {
  const [petType, setPetType] = useState("un perro");
  const [homeStatus, setHomeStatus] = useState("hay niños");
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");

  const navigate = useNavigate();

  const experienceOptions = [
    "Nunca he tenido",
    "Ya he sido dueño de",
    "Soy dueño de",
  ];

  const reasonOptions = [
    "Quiero compañía",
    "Me encantan los animales",
    "Quiero una mascota para mis hijos",
    // aqui reemplazar ocn lo del backend
  ];

  const handleViewPets = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF1DC] px-6 py-12">
      <div className="max-w-xl w-full space-y-10">
        <p className="text-sm text-gray-600 text-right">
          ¿Ya sabes lo que buscas?{" "}
          <a
            href="#"
            onClick={handleViewPets}
            className="text-[#f77534] font-semibold underline"
          >
            Ver mascotas
          </a>
        </p>

        <h1 className="text-3xl font-extrabold text-[#2e2e2e] text-left leading-snug">
          Encontremos el match perfecto.
          <br />
          Cuéntanos sobre ti.
        </h1>

        <div className="space-y-4 text-lg text-[#2e2e2e]">
          <p>
            Busco adoptar{" "}
            <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-md font-medium">
              {petType}
            </span>
            .
          </p>
          <p>
            En mi casa{" "}
            <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-md font-medium">
              {homeStatus}
            </span>
            .
          </p>
          <p>
            <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-md font-medium">
              {reason || "__________"}
            </span>{" "}
            una mascota.
          </p>
        </div>

        <div className="bg-[#fcfcfa] rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-3 font-medium">
              ¿Por qué quieres una mascota?
            </p>
            <div className="space-y-2">
              {reasonOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setReason(option)}
                  className={`button-company w-full text-left px-4 py-3 rounded-xl text-sm shadow-sm border transition ${
                    reason === option
                      ? "bg-[#f77534] text-white font-semibold shadow-md"
                      : "hover:bg-[#fceee3] text-[#2e2e2e] border border-[#eee]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

       
        </div>
      </div>
    </div>
  );
}
