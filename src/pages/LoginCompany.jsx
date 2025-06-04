import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Navbar from '../layout/Navbar';

const LoginCompany = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [form, setForm] = useState({
    email: '',
    ruc: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:8000/login/albergue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: form.email,
          ruc: form.ruc,
          contrasena: form.password,
        })
      });
    
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error al iniciar sesión');
      }
    
      const data = await res.json();
      console.log("Token recibido:", data.access_token);  // Imprimir el token recibido
      console.log("Albergue ID recibido:", data.albergue_id);  // Imprimir el albergue_id recibido
  
      setUser({
        email: form.email,
        token: data.access_token,
        albergueId: data.albergue_id
      });
  
      navigate('/company/home');
    
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  
  
  
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">Iniciar sesión como Empresa</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="empresa@refugio.com"
                required
              />
            </div>

            <div>
              <label htmlFor="ruc" className="block text-sm font-medium text-gray-700">RUC</label>
              <input
                name="ruc"
                type="text"
                value={form.ruc}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="12345678901"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
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

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            ¿No tienes cuenta? <a href="/register/company" className="text-orange-500 hover:underline">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginCompany;
