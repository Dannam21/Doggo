import doggoLogo from "../assets/doggo-logo.png";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate(); // ✅ AHORA sí está dentro del componente

  return (
    <footer className="w-full bg-[#91ceb7] text-sm text-gray-800 relative">
      <div className="w-full px-6 py-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo y frase */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <a href="/" className="flex items-center space-x-2">
              <img
                src={doggoLogo}
                alt="Doggo"
                className="h-16 w-32 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900"></h1>
            </a>
          </div>
          <p className="text-base mt-2 leading-snug">
            Un match que
            <br />
            cambia dos vidas para siempre
          </p>
        </div>

        {/* Organizaciones */}
        <div>
          <h3 className="font-semibold text-gray-700 text-lg mb-4">
            Organizaciones
          </h3>
          <ul className="space-y-2 text-white">
            <li><a href="#">Refugios</a></li>
            <li><a href="#">Albergues</a></li>
            <li><a href="#">Postula como refugio</a></li>
            <li><a href="#">Política para organizaciones</a></li>
          </ul>
        </div>

        {/* Recursos */}
        <div>
          <h3 className="font-semibold text-gray-700 text-lg mb-4">Recursos</h3>
          <ul className="space-y-2 text-white">
            <li><a href="#">Nosotros</a></li>
            <li><a href="#">Términos y condiciones</a></li>
            <li><a href="#">Preguntas frecuentes</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>
      </div>

      {/* Buy me a coffee button */}
      <div className="w-full px-32 flex justify-left">
        <button
          onClick={() => navigate("/donacion")}
          className="bg-[#3c7966] hover:bg-[#28463d] text-white font-semibold py-2 px-4 rounded-lg transition mb-4"
        >
          Buy me a coffee ☕
        </button>
      </div>

      {/* Derechos reservados */}
      <div className="bg-[#6e9d8e] text-center py-4 text-gray-900 font-medium w-full">
        © 2025 Doggo. Todos los derechos reservados
      </div>
    </footer>
  );
}
