import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { UserContext } from "../context/UserContext";
import { useLocation } from "react-router-dom";

const RegisterUser = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromPending) {
      sessionStorage.setItem("postAuthRedirect", location.state.fromPending);
    }
  }, [location]);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: "",
    imagenFile: null,
  });
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const defaultProfileImageId = 1;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrores({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setForm((prev) => ({ ...prev, imagenFile: file }));
    setErrores({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
    setLoading(true);

    const contraseñaSegura = (password) => /^.{7,}$/.test(password);
    if (!contraseñaSegura(form.contrasena)) {
      setErrores({ contrasena: "La contraseña debe tener al menos 7 caracteres." });
      setLoading(false);
      return;
    }
    if (form.contrasena !== form.confirmarContrasena) {
      setErrores({ confirmarContrasena: "Las contraseñas no coinciden." });
      setLoading(false);
      return;
    }
    if (!/^\d{9}$/.test(form.telefono)) {
      setErrores({ telefono: "El número de celular debe tener exactamente 9 dígitos." });
      setLoading(false);
      return;
    }
    if (!/^\d{8}$/.test(form.dni)) {
      setErrores({ dni: "El DNI debe tener exactamente 8 dígitos." });
      setLoading(false);
      return;
    }

      try {
    // 1) Subir imagen igual que antes...
    let imagenPerfilId = defaultProfileImageId;
    if (form.imagenFile) {
      // subir perfil
      const imagePayload = new FormData();
      imagePayload.append("image", form.imagenFile);
      const imgRes = await fetch("http://localhost:8000/imagenesProfile", {
        method: "POST",
        body: imagePayload,
      });
      if (!imgRes.ok) throw new Error((await imgRes.json()).detail);
      imagenPerfilId = (await imgRes.json()).id;
    } else {
      // subir default
      const blob = await (await fetch("/avatar-default.png")).blob();
      const archivo = new File([blob], "avatar-default.png", { type: blob.type });
      const imagePayload = new FormData();
      imagePayload.append("image", archivo);
      const imgRes = await fetch("http://localhost:8000/imagenesProfile", {
        method: "POST",
        body: imagePayload,
      });
      if (!imgRes.ok) throw new Error((await imgRes.json()).detail);
      imagenPerfilId = (await imgRes.json()).id;
    }

    // 2) Registrar adoptante (etiquetas y pesos en null)
    const registerPayload = {
      nombre: form.nombre,
      apellido: form.apellido,
      dni: form.dni,
      correo: form.correo,
      telefono: form.telefono,
      contrasena: form.contrasena,
      imagen_perfil_id: imagenPerfilId,
      etiquetas: null,
      pesos: null,
    };
    const res = await fetch("http://localhost:8000/register/adoptante", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerPayload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Error al registrar adoptante");
    }
    const { access_token, id } = await res.json();

    // 3) Obtener perfil completo
    const perfilRes = await fetch("http://localhost:8000/adoptante/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (!perfilRes.ok) throw new Error("No autorizado al obtener perfil");
    const perfil = await perfilRes.json();
      
    const fullName = `${perfil.nombre} ${perfil.apellido}`;
    const newUser = {
      name: fullName,
      email: perfil.correo,
      token: access_token,
      adoptante_id: perfil.id,       // <- aquí
      albergue_id: null, // no es albergue
      imagen_perfil_id: perfil.imagen_perfil_id,
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

      // Redirigir al cuestionario
      navigate("/home");
    } catch (err) {
      setErrores({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Regístrate como Usuario
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombres <span className="text-red-500">*</span>
              </label>
              <input
                name="nombre"
                autoComplete="given-name"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu nombre"
                required
              />
              {errores.nombre && <p className="text-sm text-red-600 mt-1">{errores.nombre}</p>}
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                name="apellido"
                autoComplete="family-name"
                type="text"
                value={form.apellido}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu apellido"
                required
              />
              {errores.apellido && <p className="text-sm text-red-600 mt-1">{errores.apellido}</p>}
            </div>

            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                DNI <span className="text-red-500">*</span>
              </label>
              <input
                name="dni"
                type="text"
                value={form.dni}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, "").slice(0, 8);
                  setForm((prev) => ({ ...prev, dni: valor }));
                  setErrores({});
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: 12345678"
                required
              />
              {errores.dni && <p className="text-sm text-red-600 mt-1">{errores.dni}</p>}
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                id="correo"
                name="correo"
                autoComplete="username"
                type="email"
                value={form.correo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa tu correo"
                required
              />
              {errores.correo && <p className="text-sm text-red-600 mt-1">{errores.correo}</p>}
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                Celular <span className="text-red-500">*</span>
              </label>
              <input
                name="telefono"
                autoComplete="off"
                type="text"
                value={form.telefono}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, "").slice(0, 9);
                  setForm((prev) => ({ ...prev, telefono: valor }));
                  setErrores({});
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: 987654321"
                required
              />
              {errores.telefono && <p className="text-sm text-red-600 mt-1">{errores.telefono}</p>}
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="contrasena"
                  autoComplete="new-password"
                  type={mostrarContrasena ? "text" : "password"}
                  value={form.contrasena}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                >
                  {mostrarContrasena ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errores.contrasena && <p className="text-sm text-red-600 mt-1">{errores.contrasena}</p>}
            </div>

            <div>
              <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña <span className="text-red-500">*</span>
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
              {errores.confirmarContrasena && <p className="text-sm text-red-600 mt-1">{errores.confirmarContrasena}</p>}
            </div>

            <div className="flex flex-col items-center">
              <label htmlFor="imagenFile" className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de Perfil (OPCIONAL)
              </label>
              <input
                type="file"
                id="imagenFile"
                name="imagenFile"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="imagenFile"
                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg inline-flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  ></path>
                </svg>
                {form.imagenFile ? form.imagenFile.name : "Seleccionar imagen"}
              </label>
              <p className="mt-2 text-xs text-gray-500">
                Si no subes una imagen, se usará una por defecto.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
            {errores.general && (
              <p className="text-sm text-red-600 text-center mt-2">{errores.general}</p>
            )}
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