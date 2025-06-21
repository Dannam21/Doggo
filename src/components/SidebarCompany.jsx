import {
  FaHome,
  FaDog,
  FaHeart,
  FaEnvelope,
  FaChartBar,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import doggoLogo from "../assets/doggo-logo.png";

export default function SidebarCompany() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setUser({
      name: null,
      email: null,
      token: null,
      albergue_id: null,
    });
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen fixed top-0 left-0 flex flex-col justify-between border-r border-gray-300 bg-[#FFF9F2] z-50">
      <div>
        {/* Logo */}
        <div
          className="flex items-center gap-2 px-6 py-4 cursor-pointer"
          onClick={() => navigate("/home")}
        >
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
              isActive("/company/doggos")
                ? "bg-[#FFF6D8] border-l-4 border-yellow-300 font-semibold"
                : "hover:bg-[#FFF6D8] hover:font-semibold"
            }`}
          >
            <FaDog /> Doggos
          </div>
          
          <div
            role="button"
            onClick={() => navigate("/company/matches")}
            className={`flex items-center gap-2 text-black px-3 py-2 rounded-lg transition-all ${
              isActive("/company/matches")
                ? "bg-[#FFF6D8] border-l-4 border-yellow-300 font-semibold"
                : "hover:bg-[#FFF6D8] hover:font-semibold"
            }`}
          >
            <FaHeart /> Matches
          </div>

          <div
            role="button"
            onClick={() => navigate("/company/messages")}
            className={`flex items-center gap-2 text-black px-3 py-2 rounded-lg transition-all ${
              isActive("/company/messages")
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
              isActive("/company/statistics")
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
              isActive("/company/calendar")
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
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full bg-red-500 hover:bg-red-700 text-white py-2 px-3 rounded transition"
        >
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
