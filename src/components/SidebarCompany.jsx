import {
  FaHome,
  FaDog,
  FaEnvelope,
  FaChartBar,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import doggoLogo from "../assets/doggo-logo.png";

export default function SidebarCompany() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 flex flex-col justify-between border-r border-gray-300 bg-[#FFF9F2]">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-4">
          <img src={doggoLogo} alt="Doggo Logo" className="w-42 h-12" />
        </div>

        {/* Menú */}
        <nav className="mt-4 space-y-2 px-6 text-sm">
          <div
            role="button"
            onClick={() => navigate("/company/home")}
            className={`flex items-center gap-2 text-black px-3 py-2 rounded-lg transition-all ${
              isActive("/company/home")
                ? "bg-[#FFF6D8] border-l-4 border-yellow-300 font-semibold"
                : "hover:bg-[#FFF6D8] hover:font-semibold"
            }`}
          >
            <FaHome /> Home
          </div>

          <div
            role="button"
            onClick={() => navigate("/company/doggos")}
            className={`flex items-center gap-2 text-black px-3 py-2 rounded-lg transition-all ${
              isActive("/dashboard/doggos")
                ? "bg-[#FFF6D8] border-l-4 border-yellow-300 font-semibold"
                : "hover:bg-[#FFF6D8] hover:font-semibold"
            }`}
          >
            <FaDog /> Doggos
          </div>

          <div
            role="button"
            onClick={() => navigate("/company/messages")}
            className={`flex items-center gap-2 text-black px-3 py-2 rounded-lg transition-all ${
              isActive("/dashboard/mensajes")
                ? "bg-[#FFF6D8] border-l-4 border-yellow-300 font-semibold"
                : "hover:bg-[#FFF6D8] hover:font-semibold"
            }`}
          >
            <FaEnvelope /> Mensajes
          </div>

          <div
            role="button"
            onClick={() => navigate("/company/statistics")}
            className={`flex items-center gap-2 text-black px-3 py-2 rounded-lg transition-all ${
              isActive("/dashboard/estadisticas")
                ? "bg-[#FFF6D8] border-l-4 border-yellow-300 font-semibold"
                : "hover:bg-[#FFF6D8] hover:font-semibold"
            }`}
          >
            <FaChartBar /> Estadísticas
          </div>

          <div
            role="button"
            onClick={() => navigate("/company/calendar")}
            className={`flex items-center gap-2 text-black px-3 py-2 rounded-lg transition-all ${
              isActive("/dashboard/calendario")
                ? "bg-[#FFF6D8] border-l-4 border-yellow-300 font-semibold"
                : "hover:bg-[#FFF6D8] hover:font-semibold"
            }`}
          >
            <FaCalendarAlt /> Calendario
          </div>
        </nav>
      </div>

      {/* Cerrar sesión */}
      <div className="px-6 py-4">
        <div
          role="button"
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-black hover:font-semibold cursor-pointer"
        >
          <FaSignOutAlt /> Cerrar sesión
        </div>
      </div>
    </div>
  );
}
