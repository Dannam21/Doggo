// src/pages/usuario/DashboardUser.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { FaHeart, FaTimes } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

export default function DashboardUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialIndex = location.state?.restoreIndex ?? 0;

  const { user } = useContext(UserContext);

  const [mascotas, setMascotas] = useState([]);
  const [index, setIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(true);
  const [citas, setCitas] = useState([]);
  const [animationDirection, setAnimationDirection] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  /* ───────── FETCH DE DATOS ───────── */
  useEffect(() => {
    const token = user.token;
    const adoptanteId = user.adoptante_id;

    if (!token || !adoptanteId) {
      setLoading(false);
      return;
    }

    fetch("http://34.195.195.173:8000/adoptante/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(async perfil => {
        // Recomendaciones
        const recRes = await fetch(
          `http://34.195.195.173:8000/recomendaciones/${perfil.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const recomendaciones = await recRes.json();
        setMascotas(recomendaciones);

        // Citas de hoy
        const today = new Date().toISOString().split("T")[0];
        const citasRes = await fetch(
          `http://34.195.195.173:8000/calendario/dia/${today}`
        );
        const todas = await citasRes.json();
        setCitas(todas.filter(c => c.adoptante_id === perfil.id));
      })
      .catch(() => {
        setMascotas([]);
        setCitas([]);
      })
      .finally(() => setLoading(false));
  }, [user.token, user.adoptante_id]);

  /* ───────── LÓGICA DE SWIPE ───────── */
  const currentDog = mascotas[index];
  const nextDog =
    mascotas.length > 1 ? mascotas[(index + 1) % mascotas.length] : null;

  const handleSwipe = dir => {
    if (isAnimating) return;
    setAnimationDirection(dir);
    setIsAnimating(true);

    setTimeout(() => {
      if (dir === "right" && currentDog) {
        navigate(`/doggoMatch/${currentDog.id}`, {
          state: {
            dog: currentDog,
            fromIndex: index,
            origin: location.pathname,
          },
        });
      } else {
        setIndex(i => i + 1);
      }
      setAnimationDirection("");
      setIsAnimating(false);
    }, 400);
  };

  const cardClasses = dog => {
    if (dog === currentDog) {
      if (animationDirection === "left")
        return "translate-x-[-120%] -rotate-12 opacity-0";
      if (animationDirection === "right")
        return "translate-x-[120%] rotate-12 opacity-0";
      return "translate-x-0 rotate-0 opacity-100";
    }
    return "scale-[0.95] translate-y-3 opacity-80";
  };

  /* ───────── ESTADOS DE CARGA ───────── */
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="p-6 bg-[#ffe4c4] min-h-screen flex items-center justify-center">
          <p className="text-xl font-semibold">Cargando recomendaciones…</p>
        </main>
      </>
    );
  }
  if (!user?.adoptante_id) {
    return (
      <>
        <Navbar />
        <main className="p-6 bg-[#ffe4c4] min-h-screen flex items-center justify-center">
          <p className="text-xl font-bold">Inicia sesión como adoptante</p>
        </main>
      </>
    );
  }
  if (mascotas.length === 0) {
    return (
      <>
        <Navbar />
        <main className="p-6 bg-[#ffe4c4] min-h-screen flex items-center justify-center">
          <p className="text-xl">No hay mascotas para recomendar</p>
        </main>
      </>
    );
  }
  if (index >= mascotas.length) {
    return (
      <>
        <Navbar />
        <main className="p-6 bg-[#FFF1DC] min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl font-semibold mb-4">Ya no hay más matches</p>
          <button
            onClick={() => navigate("/home")}
            className="bg-[#4FB286] text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Regresar
          </button>
        </main>
      </>
    );
  }

  /* ───────── UI PRINCIPAL ───────── */
  return (
    <main className="min-h-screen bg-[#FFF1DC]">
      <Navbar />
      <div className="flex flex-col items-center px-4 py-10 text-[#2e2e2e]">
        <p className="text-lg font-semibold">
          Tienes {mascotas.length} {mascotas.length === 1 ? "match" : "matches"}
        </p>
        <p className="text-sm mb-8">
          Haz clic en el corazón (match) o en “More info”
        </p>

        <div className="relative w-[320px] h-[500px] mb-10">
          {/* Carta siguiente */}
          {nextDog && (
            <div
              className={`absolute inset-0 z-0 bg-[#ee9c70] text-white rounded-2xl shadow-2xl p-6 transition-all duration-400 ease-in-out transform ${cardClasses(
                nextDog
              )}`}
            >
              <img
                src={`http://34.195.195.173:8000/imagenes/${nextDog.imagen_id}`}
                alt={nextDog.nombre}
                className="max-h-60 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-center mb-2">
                {nextDog.nombre}
              </h3>
              <p className="text-sm text-center italic">Esperando...</p>
            </div>
          )}

          {/* Carta actual */}
          <div
            className={`absolute inset-0 z-10 bg-[#ee9c70] text-white rounded-2xl shadow-2xl p-6 transition-all duration-400 ease-in-out transform ${cardClasses(
              currentDog
            )}`}
          >
            <img
              src={`http://34.195.195.173:8000/imagenes/${currentDog.imagen_id}`}
              alt={currentDog.nombre}
              className="max-h-60 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-center mb-2">
              {currentDog.nombre}
            </h3>
            <ul className="text-sm leading-snug space-y-1 px-2 mb-4">
              <li>
                <strong>Edad:</strong> {currentDog.edad_valor}{" "}
                {currentDog.edad_unidad}
              </li>
              <li>
                <strong>Tamaño:</strong> {currentDog.especie}
              </li>
              <li>
                <strong>Descripción:</strong>{" "}
                {currentDog.descripcion?.slice(0, 200)}…
              </li>
            </ul>
            <button
              onClick={() =>
                navigate(`/doggoUser/${currentDog.id}`, {
                  state: {
                    fromIndex: index,
                    origin: location.pathname,
                  },
                })
              }
              className="block mx-auto mb-2 border-2 border-white text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white hover:text-[#EE9C70] transition"
            >
              More info
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="flex gap-10">
          <button
            onClick={() => handleSwipe("left")}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-[#ffe4c4] border-2 border-[#F25C5C] text-[#F25C5C] shadow hover:scale-110 transition"
            aria-label="No me interesa"
          >
            <FaTimes size={20} />
          </button>

          <button
            onClick={() => handleSwipe("right")}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-[#ffe4c4] border-2 border-[#4FB286] text-[#4FB286] shadow hover:scale-110 transition"
            aria-label="Me interesa"
          >
            <FaHeart size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
