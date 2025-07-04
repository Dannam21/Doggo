import {
  FaHome,
  FaDog,
  FaEnvelope,
  FaChartBar,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHeart,
  FaDonate,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react"; 
import { UserContext } from "../context/UserContext";
import doggoLogo from "../assets/doggo-logo.png";

export default function SidebarCompany() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false); 

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setUser({ name: null, email: null, token: null, adoptante_id: null });
    localStorage.removeItem("user");
    navigate("/login");
  };


  const menuItems = [
    { icon: <FaHome />, label: "Home", path: "/company/home" },
    { icon: <FaDog />, label: "Doggos", path: "/company/doggos" },
    { icon: <FaHeart />, label: "Matches", path: "/company/matches" },
    { icon: <FaEnvelope />, label: "Mensajes", path: "/company/messages" },
    { icon: <FaChartBar />, label: "Estadísticas", path: "/company/statistics" },
    { icon: <FaCalendarAlt />, label: "Calendario", path: "/company/calendar" },
    { icon: <FaDonate />, label: "Donaciones", path: "/company/donations" },
  ];

  return (
    <>
      {/* Navbar mobile */}
      <div className="md:hidden flex justify-between items-center bg-[#FFF9F2] px-4 py-3 border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <img src={doggoLogo} alt="Doggo Logo" className="w-36 h-10" />
        <button2 onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button2>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform fixed top-0 left-0 h-full w-64 bg-[#FFF9F2] border-r border-gray-300 z-40 md:z-50 flex flex-col`}
      >
        {/* Parte superior: logo y navegación */}
        <div>
          <div className="px-6 py-4 cursor-pointer flex items-center" onClick={() => navigate("/home")}>
            <img src={doggoLogo} alt="Doggo Logo" className="w-42 h-12" />
          </div>

          <nav className="mt-4 space-y-2 px-6 text-sm">
            {menuItems.map(({ icon, label, path }) => (
              <div
                key={path}
                role="button"
                onClick={() => {
                  navigate(path);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 text-black px-3 py-2 rounded-lg transition-all ${
                  isActive(path)
                    ? "bg-[#FFF6D8] border-l-4 border-yellow-300 font-semibold"
                    : "hover:bg-[#FFF6D8] hover:font-semibold"
                }`}
              >
                {icon} {label}
              </div>
            ))}
          </nav>
        </div>

        {/* Parte inferior: botón cerrar sesión */}
        <div className="px-6 py-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center bg-[#f77534] gap-2 w-full hover:bg-red-700 text-white py-2 px-3 rounded transition"
          >
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
}
