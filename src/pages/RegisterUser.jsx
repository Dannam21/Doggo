import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { UserContext } from "../context/UserContext";

const RegisterUser = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const defaultProfileImageId = 1; 

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setForm((prev) => ({ ...prev, imagenFile: file }));
    setError("");
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (form.contrasena !== form.confirmarContrasena) {
    setError("Las contraseñas no coinciden.");
    setLoading(false);
    return;
  }

  try {
    let imagenPerfilId = defaultProfileImageId; // <--- DECLARACIÓN INICIAL

    if (form.imagenFile) {
      // Si el usuario subió una imagen, la subimos primero
      const imagePayload = new FormData();
      imagePayload.append("image", form.imagenFile);

      const imgRes = await fetch("http://localhost:8000/imagenesProfile", {
        method: "POST",
        body: imagePayload,
      });

      if (!imgRes.ok) {
        const errJson = await imgRes.json();
        console.error("Error al subir la imagen:", errJson);
        throw new Error(errJson.detail || "Error al subir la imagen de perfil.");
      }
      const imgData = await imgRes.json();
      console.log("Datos de la imagen subida:", imgData);
      imagenPerfilId = imgData.id; // <--- ASIGNACIÓN A LA VARIABLE YA DECLARADA
    }

    // AHORA ESTA LÍNEA DEBERÍA ESTAR FUERA DEL BLOQUE IF PARA ACCEDER A imagenPerfilId
    const registerPayload = {
      nombre: form.nombre,
      apellido: form.apellido,
      dni: form.dni,
      correo: form.correo,
      telefono: form.telefono,
      contrasena: form.contrasena,
      imagen_perfil_id: imagenPerfilId, // <--- USO DE LA VARIABLE
    };

    console.log("Payload de registro del adoptante:", registerPayload); // Esto también es útil

    // Guardamos los datos en el contexto sin registrar todavía
setUser({
  nombre: form.nombre,
  apellido: form.apellido,
  dni: form.dni,
  correo: form.correo,
  telefono: form.telefono,
  contrasena: form.contrasena,
  imagen_perfil_id: imagenPerfilId,
});

    navigate("/cuestionario");
  } catch (err) {
    setError(err.message);
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

            {/* Campo para subir imagen de perfil */}
            <div className="flex flex-col items-center">
              <label htmlFor="imagenFile" className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de Perfil (opcional)
              </label>
              <input
                type="file"
                id="imagenFile"
                name="imagenFile"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" // Ocultamos el input original para estilizarlo
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
              disabled={loading} // Deshabilitar el botón mientras se procesa
            >
              {loading ? "Registrando..." : "Registrar"}
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