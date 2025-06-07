import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";

const RegisterCompany = () => {
  const navigate = useNavigate();

  // Estados para cada campo
  const [nombre, setNombre] = useState("");
  const [ruc, setRuc] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validar que contraseñas coincidan
    if (contrasena !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Payload según AlbergueRegister: { nombre, ruc, correo, contrasena, telefono }
    const payload = {
      nombre: nombre.trim(),
      ruc: ruc.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      contrasena: contrasena,
    };

    try {
      const res = await fetch("http://localhost:8000/register/albergue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error al registrar el albergue");
      }

      // Registro exitoso: redirigir al login o dashboard
      navigate("/company/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Regístrate como Empresa
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre del refugio o empresa
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nombre de la organización"
                required
              />
            </div>

            <div>
              <label
                htmlFor="ruc"
                className="block text-sm font-medium text-gray-700"
              >
                RUC
              </label>
              <input
                type="text"
                id="ruc"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Número de RUC"
                required
              />
            </div>

            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-gray-700"
              >
                Correo de contacto
              </label>
              <input
                type="email"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="contacto@refugio.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-gray-700"
              >
                Celular (teléfono)
              </label>
              <input
                type="tel"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="+51987654321"
                required
              />
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-orange-500 hover:underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterCompany;
