import doggoLogo from "../assets/doggo-logo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-[#91ceb7] text-sm text-gray-800">
      <div className="w-full px-6 py-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo y frase */}
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <a href="/" className="flex items-center space-x-2">
              <img src={doggoLogo} alt="Doggo" className="h-40 w-40 object-contain" />
              <h1 className="text-2xl font-bold text-gray-900"></h1>
            </a>
          </div>
          <p className="text-base mt-2">
            Conectando corazones, un match a la vez.
          </p>
        </div>

        {/* Organizaciones */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Organizaciones</h3>
          <ul className="space-y-1 text-white">
            <li><a href="#">Refugios</a></li>
            <li><a href="#">Albergues</a></li>
            <li><a href="#">Postula como refugio</a></li>
            <li><a href="#">Política para organizaciones</a></li>
          </ul>
        </div>

        {/* Recursos */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Recursos</h3>
          <ul className="space-y-1 text-white">
            <li><a href="#">Nosotros</a></li>
            <li><a href="#">Términos y condiciones</a></li>
          </ul>
        </div>
      </div>

      {/* Derechos reservados */}
      <div className="bg-[#6e9d8e] text-center py-3 text-gray-900 font-medium w-full">
        © 2025 Doggo. Todos los derechos reservados
      </div>
    </footer>
  );
}
