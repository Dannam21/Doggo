import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import LocationPicker from "./LocationPicker";

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

  // Estados para mapa
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [direccion, setDireccion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!direccion || !latitud || !longitud) {
      setError("Selecciona una ubicación en el mapa.");
      return;
    }

    if (!/^\d{11}$/.test(ruc)) {
      setError("El RUC debe tener exactamente 11 dígitos.");
      return;
    }
    if (!/^\d{9}$/.test(telefono)) {
      setError("El número de celular debe tener exactamente 9 dígitos.");
      return;
    }
        
    const contraseñaSegura = (password) => {
      const regex = /^(?=.*\d)[A-Za-z\d]{6,}$/;
      return regex.test(password);
    };
    
    if (!contraseñaSegura(contrasena)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
      return;
    }
    
    if (contrasena !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }    


    const payload = {
      nombre: nombre.trim(),
      ruc: ruc.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      contrasena: contrasena,
      direccion: direccion ? direccion.toString() : null,
      latitud: latitud !== null ? latitud.toString() : null,
      longitud: longitud !== null ? longitud.toString() : null,
    };
    

    console.log(payload);

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
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre del refugio o empresa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                placeholder="Nombre de la organización"
                required
              />
            </div>

            {/* RUC */}
            <div>
              <label htmlFor="ruc" className="block text-sm font-medium text-gray-700">
                RUC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ruc"
                value={ruc}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setRuc(valor);
                  setError("");
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                placeholder="Número de RUC"
                required
              />
            </div>

            {/* Correo */}
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                Correo de contacto <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                placeholder="contacto@refugio.com"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                Celular (teléfono) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="telefono"
                value={telefono}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, "").slice(0, 9);
                  setTelefono(valor);
                  setError("");
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                placeholder="Ej: 987654321"
                required
              />
            </div>

            {/* Ubicación en el mapa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación en el mapa <span className="text-red-500">*</span>
              </label>
              <LocationPicker
                setLatitud={setLatitud}
                setLongitud={setLongitud}
                setDireccion={setDireccion}
              />
              {direccion && (
                <p className="text-xs text-gray-600 mt-2">
                  Dirección seleccionada: <span className="font-semibold">{direccion}</span>
                </p>
              )}
            </div>

            {/* Lat / Lng */}
            <div className="flex gap-4 mt-2">
              <div className="w-1/2">
                <label className="text-xs font-medium">
                  Latitud <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={latitud || ""}
                  readOnly
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                />
              </div>

              <div className="w-1/2">
                <label className="text-xs font-medium">
                  Longitud <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={longitud || ""}
                  readOnly
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.
              </p>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
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
