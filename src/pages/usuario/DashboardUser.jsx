import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { FaHeart, FaTimes } from "react-icons/fa";

const dogMatches = [
  {
    id: 1,
    name: "Max ♂",
    age: "5 años",
    size: "Grande",
    breed: "Golden Retriever",
    health: "Todas las vacunas",
    social: "Se lleva bien con niños, perros y gatos",
    personality: "Juguetón, cariñoso y protector",
    image: "https://placedog.net/600/400?id=1",
  },
  {
    id: 2,
    name: "Canela ♀",
    age: "3 años",
    size: "Mediano",
    breed: "Labrador",
    health: "Desparasitada y vacunada",
    social: "Ideal para familias activas",
    personality: "Curiosa, energética y leal",
    image: "https://placedog.net/600/400?id=2",
  },
];

export default function DashboardUser() {
  const [index, setIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState(""); // 'left' | 'right'
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const currentDog = dogMatches[index];
  const nextDog = dogMatches[(index + 1) % dogMatches.length];

  const handleAction = (dir) => {
    if (isAnimating) return;
    setAnimationDirection(dir);
    setIsAnimating(true);

    setTimeout(() => {
      if (dir === "right") {
        navigate("/home");
      } else {
        setIndex((prev) => (prev + 1) % dogMatches.length);
        setAnimationDirection("");
        setIsAnimating(false);
      }
    }, 500);
  };

  const getCurrentCardClasses = () => {
    if (animationDirection === "left") {
      return "translate-x-[-120%] translate-y-16 -rotate-12 opacity-0";
    }
    if (animationDirection === "right") {
      return "translate-x-[120%] translate-y-16 rotate-12 opacity-0";
    }
    return "translate-x-0 translate-y-0 rotate-0 opacity-100";
  };

  return (
    <main className="min-h-screen bg-[#FFF1DC]">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-10 text-[#2e2e2e]">
        <p className="text-lg font-semibold">Tienes {dogMatches.length} matches</p>
        <p className="text-sm mb-8">
          Dale click al botón del corazón si deseas conocer más sobre el doggo
        </p>

        <div className="relative w-[320px] h-[500px] mb-10">
          {/* Carta siguiente (esperando debajo) */}
          <div className="absolute inset-0 z-0 bg-[#ee9c70] text-white rounded-[28px] shadow-md p-4 
            scale-[0.95] translate-y-3 opacity-80 transition-all duration-300">
            <img src={nextDog.image} alt={nextDog.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold text-center mb-2">{nextDog.name}</h3>
            <p className="text-sm text-center italic">Esperando para ser el siguiente 🐶</p>
          </div>

          {/* Carta actual con animación */}
          <div
            className={`absolute inset-0 z-10 bg-[#ee9c70] text-white rounded-[28px] shadow-xl p-4
              transition-all duration-500 ease-in-out transform ${getCurrentCardClasses()}`}
          >
            <img src={currentDog.image} alt={currentDog.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold text-center mb-2">{currentDog.name}</h3>
            <ul className="text-sm leading-snug space-y-1 px-2">
              <li><strong>Edad:</strong> {currentDog.age}</li>
              <li><strong>Tamaño:</strong> {currentDog.size}</li>
              <li><strong>Raza:</strong> {currentDog.breed}</li>
              <li><strong>Salud:</strong> {currentDog.health}</li>
              <li>{currentDog.social}</li>
              <li>{currentDog.personality}</li>
            </ul>
            <button className="mt-4 bg-white text-[#EE9C70] font-semibold px-4 py-2 rounded-full w-full text-sm hover:bg-[#fdf0df]">
              More info
            </button>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-10">
          <button
            onClick={() => handleAction("left")}
            className="bg-[#FFE9DD] w-14 h-14 flex items-center justify-center rounded-full text-2xl text-[#F25C5C] hover:scale-110 transition"
            aria-label="No me interesa"
          >
            <FaTimes />
          </button>
          <button
            onClick={() => handleAction("right")}
            className="bg-[#D9F5ED] w-14 h-14 flex items-center justify-center rounded-full text-2xl text-[#4FB286] hover:scale-110 transition"
            aria-label="Me interesa"
          >
            <FaHeart />
          </button>
        </div>
      </div>
    </main>
  );
}
