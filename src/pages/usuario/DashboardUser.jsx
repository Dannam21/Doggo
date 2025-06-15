import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { FaHeart, FaTimes } from "react-icons/fa";

export default function DashboardUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialIndex = location.state?.restoreIndex ?? 0;

  const [mascotas, setMascotas] = useState([]);
  const [index, setIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(true);
  const [adoptanteId, setAdoptanteId] = useState(null);
  const [animationDirection, setAnimationDirection] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("http://localhost:8000/adoptante/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((perfil) => {
        setAdoptanteId(perfil.id);
        return fetch(`http://localhost:8000/recomendaciones/${perfil.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setMascotas)
      .catch(() => setMascotas([]))
      .finally(() => setLoading(false));
  }, []);

  const currentDog = mascotas[index];
  const nextDog = mascotas[(index + 1) % mascotas.length];

  const handleSwipe = (dir) => {
    if (isAnimating) return;
    setAnimationDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      if (dir === "right" && currentDog) {
        navigate(`/doggoMatch/${currentDog.id}`, {
          state: { fromIndex: index, dog: currentDog },
        });
      } else {
        setIndex((i) => i + 1);
      }
      setAnimationDirection("");
      setIsAnimating(false);
    }, 400);
  };

  const cardClasses = (dog) => {
    if (dog === currentDog) {
      if (animationDirection === "left")
        return "translate-x-[-120%] -rotate-6 opacity-0 transition-transform duration-500 ease-in-out z-20";
      
      if (animationDirection === "right")
        return "translate-x-[150%] opacity-0 transition-transform duration-500 ease-in"; // si decides mantenerlo
      return "translate-x-0 translate-y-0 rotate-0 opacity-100 z-10 transition-transform duration-300 ease-in-out";
    }
  
    return "scale-[0.95] translate-y-2 opacity-90 z-0";
  };
  
  
  
  
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

  if (!adoptanteId) {
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

  return (
    <main className="min-h-screen bg-[#FFF1DC]">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-10 text-[#2e2e2e]">
        <p className="text-2xl font-semibold">
          Tienes {mascotas.length} matches
        </p>
        <p className="text-md mb-8">
          Haz click en el corazón (match) o en (detalle)
        </p>

        <div className="relative w-[320px] h-[500px] mb-10">
          {/* Carta siguiente */}
          <div
            className={`absolute inset-0 z-0 w-72 h-[480px] bg-orange-300 text-white rounded-xl shadow-md p-3 text-center hover:scale-105 transition-transform duration-300 ease-in-out w-56 mx-auto ${cardClasses(
              nextDog
            )}`}
          >
            <img
              src={`http://localhost:8000/imagenes/${nextDog.imagen_id}`}
              alt={nextDog.nombre}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/400x300?text=Sin+Imagen";
              }}
            />
            <h3 className="font-bold text-xl">{nextDog.nombre}</h3>
            <p className="text-lg leading-relaxed text-white">
              {nextDog.edad} {nextDog.edad === 1 ? "año" : "años"} <br />
              {nextDog.especie} <br />
              <span className="italic text-md text-white/90">
                Albergue: {nextDog.albergue_nombre}
              </span>
            </p>
          </div>

          {/* Carta actual */}
          <div
  className={`absolute inset-x-0 top-0 bottom-0 z-10 w-72 h-[480px] bg-orange-300 text-white rounded-xl shadow-md p-5 text-center hover:scale-105 transition-transform duration-300 ease-in-out ${cardClasses(
    currentDog
  )}`}
>
            <img
              src={`http://localhost:8000/imagenes/${currentDog.imagen_id}`}
              alt={currentDog.nombre}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/400x300?text=Sin+Imagen";
              }}
            />
            <h3 className="font-bold text-xl">{currentDog.nombre}</h3>
            <p className="text-lg leading-relaxed text-white mb-4">
              {currentDog.edad} año{currentDog.edad !== 1 && "s"} <br />
              {currentDog.especie} <br />
              <span className="italic text-md text-white/90">
                Albergue: {currentDog.albergue_nombre}
              </span>
            </p>
          </div>
        </div>

        {/* Botones X y ❤️ */}
        <div className="flex gap-10">
          <button-match
            onClick={() => handleSwipe("left")}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-[#ffe4c4] border-2 border-[#F25C5C] text-[#F25C5C] shadow hover:scale-110 transition"
            aria-label="No me interesa"
          >
            <FaTimes size={35} />
          </button-match>
          <button-match
            onClick={() => handleSwipe("right")}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-[#ffe4c4] border-2 border-[#4FB286] text-[#4FB286] shadow hover:scale-110 transition"
            aria-label="Me interesa"
          >
            <FaHeart size={35} />
          </button-match>
        </div>
      </div>
    </main>
  );
}

