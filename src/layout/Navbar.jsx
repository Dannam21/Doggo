import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import LogoDoggo from "../assets/doggo-logo.png";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); 
    navigate('/home'); 
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-[#fff6eb] shadow-md sticky top-0 z-50">
      <Link to="/home" className="flex items-center gap-3 font-bold text-xl ">
        <img src={LogoDoggo} alt="Doggo logo" className="h-12 w-auto" />        
      </Link>

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
