import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';

const RegisterUser = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías agregar lógica de validación o API
    navigate('/cuestionario'); // Cambia esta ruta según necesites
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">Regístrate como Usuario</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombres</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Apellidos</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu apellido"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu correo"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Celular</label>
              <input
                type="phone"
                id="phone"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="+51"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Crear cuenta
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            ¿Ya tienes cuenta? <a href="/login" className="text-orange-500 hover:underline">Inicia sesión</a>
          </p>
          <p className="mt-4 text-sm text-center text-gray-600">
          ¿Eres empresa? <a href="/register/company" className="text-orange-500 hover:underline">Registro empresa</a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterUser;
