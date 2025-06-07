import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';

const RegisterCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    correo: '',
    contrasena: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.contrasena !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/register/albergue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          ruc: formData.ruc,
          correo: formData.correo,
          contrasena: formData.contrasena
        })
      });

      if (response.ok) {
        navigate('/company/home');
      } else {
        const data = await response.json();
        setError(data.detail || 'Error al registrar');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">Regístrate como Empresa</h2>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del refugio o empresa</label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="ruc" className="block text-sm font-medium text-gray-700">RUC</label>
              <input
                type="text"
                id="ruc"
                value={formData.ruc}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo de contacto</label>
              <input
                type="email"
                id="correo"
                value={formData.correo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
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
        </div>
      </div>
    </main>
  );
};

export default RegisterCompany;
