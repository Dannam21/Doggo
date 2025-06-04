import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { UserContext } from "../context/UserContext";

const RegisterUser = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Guardamos provisionalmente los datos de registro
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.contrasena !== form.confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Guardamos los datos básicos en el contexto, sin token
    setUser({
      nombre: form.nombre,
      apellido: form.apellido,
      dni: form.dni,
      correo: form.correo,
      telefono: form.telefono,
      contrasena: form.contrasena,
    });

    // Redirigimos a llenar el cuestionario
    navigate("/cuestionario");
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Regístrate como Usuario
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombres
              </label>
              <input
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                Apellidos
              </label>
              <input
                name="apellido"
                type="text"
                value={form.apellido}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu apellido"
                required
              />
            </div>

            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                DNI
              </label>
              <input
                name="dni"
                type="text"
                value={form.dni}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu DNI"
                required
              />
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                name="correo"
                type="email"
                value={form.correo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu correo"
                required
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                Celular
              </label>
              <input
                name="telefono"
                type="text"
                value={form.telefono}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="+51"
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                name="contrasena"
                type="password"
                value={form.contrasena}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                name="confirmarContrasena"
                type="password"
                value={form.confirmarContrasena}
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
              Continuar al cuestionario
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            ¿Eres Albergue?{" "}
            <Link to="/register/company" className="text-orange-500 hover:underline">
              Regístrate
            </Link>
          </p>

          <p className="mt-2 text-sm text-center text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterUser;
