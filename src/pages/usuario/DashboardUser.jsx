import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { FaHeart, FaTimes } from "react-icons/fa";

export default function DashboardUser() {
  const navigate = useNavigate();
  const location = useLocation();
  // Restauramos el índice si venimos de DoggoUser o MatchUser
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
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(perfil => {
        setAdoptanteId(perfil.id);
        return fetch(`http://localhost:8000/recomendaciones/${perfil.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setMascotas)
      .catch(() => setMascotas([]))
      .finally(() => setLoading(false));
  }, []);

  const currentDog = mascotas[index];
  const nextDog = mascotas[(index + 1) % mascotas.length];

  const handleSwipe = dir => {
    if (isAnimating) return;
    setAnimationDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      if (dir === "right" && currentDog) {
            navigate(`/doggoMatch/${currentDog.id}`, {
              state: { fromIndex: index, dog: currentDog },
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
      if (animationDirection === "left") return "translate-x-[-120%] -rotate-12 opacity-0";
      if (animationDirection === "right") return "translate-x-[120%] rotate-12 opacity-0";
      return "translate-x-0 rotate-0 opacity-100";
    }
    return "scale-[0.95] translate-y-3 opacity-80";
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
      <div className="flex flex-col items-center justify-center px-4 py-10 text-[#2e2e2e]" >
        <p className="text-lg font-semibold">Tienes {mascotas.length} matches</p>
        <p className="text-sm mb-8" >
          Haz click en el corazón (match) o en “More info” (detalle)
        </p>

        <div className="relative w-[320px] h-[500px] mb-10">
          {/* Carta siguiente */}
          <div
            className={`absolute inset-0 z-0 bg-[#ee9c70] text-white rounded-xl shadow-md p-4 transition-all duration-300 transform ${cardClasses(nextDog)}`}
          >
            <img
              src={`http://localhost:8000/imagenes/${nextDog.imagen_id}`}
              alt={nextDog.nombre}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-bold text-center mb-2">{nextDog.nombre}</h3>
            <p className="text-sm text-center italic">Esperando...</p>
          </div>

          {/* Carta actual */}
          <div
            className={`absolute inset-0 z-10 bg-[#ee9c70] text-white rounded-xl shadow-xl p-4 transition-all duration-400 ease-in-out transform ${cardClasses(currentDog)}`}
          >
            <img
              src={`http://localhost:8000/imagenes/${currentDog.imagen_id}`}
              alt={currentDog.nombre}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-bold text-center mb-2">{currentDog.nombre}</h3>
            <ul className="text-sm leading-snug space-y-1 px-2 mb-4">
              <li><strong>Edad:</strong> {currentDog.edad}</li>
              <li><strong>Tamaño:</strong> {currentDog.especie}</li>
              <li>
                <strong>Descripción:</strong>{" "}
                {currentDog.descripcion?.slice(0, 200)}...
              </li>
            </ul>
            {/* More info va a DoggoUser */}
            <button
              onClick={() =>
                navigate(
                  `/doggoUser/${currentDog.id}`,
                  { state: { fromIndex: index } }
                )
              }
              className="block mx-auto mb-2 border-2 border-white text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white hover:text-[#EE9C70] transition"
            >
              More info
            </button>
          </div>
        </div>

        {/* Botones X y ❤️ */}
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
