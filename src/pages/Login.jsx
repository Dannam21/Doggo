import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Importar el contexto
import Navbar from '../layout/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Usar el contexto
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const endpoint = form.role === 'user' 
      ? 'http://localhost:8000/login/adoptante' 
      : 'http://localhost:8000/login/albergue';
  
    const payload = form.role === 'user'
      ? {
          correo: form.email,
          contrasena: form.password
        }
      : {
          correo: form.email,
          contrasena: form.password,
          ruc: "12345678901"
        };
  
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error al iniciar sesión');
      }
  
      const data = await res.json();
      setUser({ email: form.email, token: data.access_token });
  
      if (form.role === 'user') {
        navigate('/dashboard/user');
      } else {
        navigate('/dashboard/company');
      }
  
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  

  return (
    <main>
      <Navbar />

      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="tuemail@ejemplo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Tipo de cuenta
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="user">Usuario que quiere adoptar</option>
                <option value="company">Empresa o refugio</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="text-orange-500 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            ¿No tienes cuenta?{' '}
            <span className="block mt-1">
              <a href="/register/user" className="text-orange-500 hover:underline">Registrarme como usuario</a> |
              <a href="/register/company" className="text-orange-500 hover:underline ml-2">como empresa</a>
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
