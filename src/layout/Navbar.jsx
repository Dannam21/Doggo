import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import LogoDoggo from "../assets/doggo-logo.png";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleGreetingClick = () => {
    if (user && user.albergue_id) {
      navigate("/company/doggos");
    } else {
      navigate("/user/home");
    }
  };

  return (
    <nav className="bg-[#fff6eb] shadow-md sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <img src={LogoDoggo} alt="Doggo logo" className="h-10 w-auto" />
        </Link>

        {/* Botón de hamburguesa */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Opciones en escritorio */}
        <div className="hidden md:flex space-x-4 font-semibold items-center">
          {user && user.token ? (
            <>
              <span
                onClick={handleGreetingClick}
                className="text-gray-700 cursor-pointer hover:text-orange-500 transition"
              >
                Hola, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#f77534] hover:bg-[#f77534] text-white py-1 px-3 rounded"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-black hover:text-orange-500 transition">
                Iniciar sesión
              </Link>
              <Link to="/register/user" className="text-black hover:text-orange-500 transition">
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menú desplegable en móviles */}
      {menuOpen && (
        <div className="mt-2 md:hidden flex flex-col space-y-2 font-semibold">
          {user && user.token ? (
            <>
              <span
                onClick={handleGreetingClick}
                className="text-gray-700 cursor-pointer hover:text-orange-500 transition"
              >
                Hola, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-sky-500 hover:bg-sky-700 text-white py-1 px-3 rounded w-full text-left"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-black hover:text-orange-500 transition">
                Iniciar sesión
              </Link>
              <Link to="/register/user" className="text-black hover:text-orange-500 transition">
                Regístrate
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;