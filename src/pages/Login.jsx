// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Navbar from "../layout/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user", // "user" para adoptante, "company" para albergue
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Elegimos endpoint según rol
    const endpoint =
      form.role === "user"
        ? "http://localhost:8000/login/adoptante"
        : "http://localhost:8000/login/albergue";

    // Payload siempre: { correo, contrasena }
    const payload = {
      correo: form.email,
      contrasena: form.password,
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || "Credenciales inválidas");
      }

      const data = await res.json();
      // data = { access_token, token_type, [albergue_id] }

      // Construimos el objeto usuario a guardar en el contexto
      if (form.role === "user") {
        // Para adoptante no hay albergue_id
        setUser({
          name: "Adoptante", // puedes personalizar según tu lógica
          email: form.email,
          token: data.access_token,
          // no incluimos albergue_id aquí
        });
        navigate("/dashboard/user"); // o a donde quieras
      } else {
        // Si es empresa/refugio, el backend devuelve también albergue_id
        setUser({
          name: "Albergue", // opcionalmente podrías pedirle al backend el nombre real
          email: form.email,
          token: data.access_token,
          albergue_id: data.albergue_id,
        });
        navigate("/company/adddoggo"); // la ruta donde esté Adddoggo.jsx
      }
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
            Iniciar sesión
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            ¿No tienes cuenta?{" "}
            {form.role === "user" ? (
              <>
                <a href="/register/user" className="text-orange-500 hover:underline">
                  Registrarme como usuario
                </a>{" "}
                |{" "}
                <a
                  href="/register/company"
                  className="text-orange-500 hover:underline ml-2"
                >
                  como empresa
                </a>
              </>
            ) : (
              <>
                <a href="/register/company" className="text-orange-500 hover:underline">
                  Registrarme como empresa
                </a>{" "}
                |{" "}
                <a
                  href="/register/user"
                  className="text-orange-500 hover:underline ml-2"
                >
                  como usuario
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
