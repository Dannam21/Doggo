import React from 'react'

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center p-4 bg-[#fff6eb]">
          <div className="flex items-center gap-2 font-bold text-xl">
            <img src="/logo.png" alt="Doggo" className="h-8" />
            Doggo
          </div>
          <div className="space-x-6">
            <a href="#">Adopta</a>
            <a href="#">Iniciar sesión</a>
            <a href="#">Regístrate</a>
          </div>
        </nav>
      );
}

export default Navbar


