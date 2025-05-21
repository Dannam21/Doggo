import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Importar el contexto
import LogoDoggo from "../assets/doggo-logo.png";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext); // Usar el contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Limpiar el usuario del contexto
    navigate('/home'); // Redirigir al usuario a la página de inicio
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-[#fff6eb] shadow-md sticky top-0 z-50">
      {/* Logo + texto */}
      <Link to="/home" className="flex items-center gap-3 font-bold text-xl ">
        <img src={LogoDoggo} alt="Doggo logo" className="h-8 w-auto" />        
      </Link>

      {/* Enlaces */}
      <div className="space-x-4 font-semibold">
        {user ? (
          <>
            <span className="text-gray-700">Hola, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-sky-500 hover:bg-sky-700"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <a href="#" className="text-[#6366f1] hover:text-orange-500 transition">Adopta</a>
            <a href="/login" className="text-[#6366f1] hover:text-orange-500 transition">Iniciar sesión</a>
            <a href="/register/user" className="text-[#6366f1] hover:text-orange-500 transition">Regístrate</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
