// Sidebar para usuario (solo con perfil, mensajes, calendario)
import {
    FaUser,
    FaEnvelope,
    FaCalendarAlt,
    FaSignOutAlt,
  } from "react-icons/fa";
  import { useNavigate, useLocation } from "react-router-dom";
  import { useContext } from "react";
  import { UserContext } from "../context/UserContext";
  import doggoLogo from "../assets/doggo-logo.png";
  
  export default function SidebarUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useContext(UserContext);
  
    const isActive = (path) => location.pathname === path;
  
    const handleLogout = () => {
      setUser({ name: null, email: null, token: null, adoptante_id: null });
      localStorage.removeItem("user");
      navigate("/login");
    };
  
    return (
      <div className="w-64 h-screen flex flex-col justify-between border-r border-gray-300 bg-[#FFF9F2]">
        <div>
          <div
            className="flex items-center gap-2 px-6 py-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={doggoLogo} alt="Doggo Logo" className="w-42 h-12" />
          </div>
  
          <nav className="mt-4 space-y-2 px-6 text-sm">
            <div
              role="button"
              onClick={() => navigate("/user/profile")}
              className={`flex items-center gap-2 text-black px-3 py-2 rounded-lg transition-all ${
                isActive("/user/profile")
                  ? "bg-[#FFF6D8] border-l-4 border-yellow-300 font-semibold"
                  : "hover:bg-[#FFF6D8] hover:font-semibold"
              }`}
            >
              <FaUser /> Perfil
            </div>
  
            <div
              role="button"
              onClick={() => navigate("/user/messages")}
              className={`flex items-center gap-2 text-black px-3 py-2 rounded-lg transition-all ${
                isActive("/user/messages")
                  ? "bg-[#FFF6D8] border-l-4 border-yellow-300 font-semibold"
                  : "hover:bg-[#FFF6D8] hover:font-semibold"
              }`}
            >
              <FaEnvelope /> Mensajes
            </div>
  
          </nav>
        </div>
  
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
  