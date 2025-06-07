import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';

const RegisterUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    correo: '',
    contrasena: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8000/register/adoptante', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni,
          correo: formData.correo,
          contrasena: formData.contrasena,
        }),
      });
  
      if (response.ok) {
        navigate('/cuestionario');
      } else {
        const errorData = await response.json();
        console.error('Error detallado:', errorData);
        alert(`Error: ${errorData.message || 'Algo salió mal. Intenta nuevamente.'}`);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Hubo un error al registrar al usuario. Intenta nuevamente.');
    }
  };
  

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">Regístrate como Usuario</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombres</label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellidos</label>
              <input
                type="text"
                id="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu apellido"
                required
              />
            </div>

            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
              <input
                type="text"
                id="dni"
                value={formData.dni}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu DNI"
                required
              />
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                value={formData.correo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu correo"
                required
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                id="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
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
