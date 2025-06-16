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
    role: "user", // "user" = adoptante, "company" = albergue
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    const endpoint =
      form.role === "user"
        ? "http://localhost:8000/login/adoptante"
        : "http://localhost:8000/login/albergue";

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
        const errData = await res.json();
        throw new Error(errData.detail || "Credenciales inválidas");
      }
      const data = await res.json();
      const token = data.access_token;
      const adoptanteId = data.id; 

      // **Guardar token en localStorage** para que persista entre recargas
      localStorage.setItem("token", token);

      if (form.role === "user") {
        // --- Perfil de adoptante ---
        const profileRes = await fetch("http://localhost:8000/adoptante/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!profileRes.ok) {
          const errProf = await profileRes.json();
          throw new Error(errProf.detail || "No se pudo obtener perfil de adoptante");
        }
        const perfil = await profileRes.json();
        setUser({
          name: `${perfil.nombre} ${perfil.apellido}`,
          email: perfil.correo,
          token,
          adoptante_id: adoptanteId
        });
        navigate("/home");
      } else {
        // --- Perfil de albergue ---
        const profileRes = await fetch("http://localhost:8000/albergue/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!profileRes.ok) {
          const errProf = await profileRes.json();
          throw new Error(errProf.detail || "No se pudo obtener perfil de albergue");
        }
        const perfilAlbergue = await profileRes.json();
        setUser({
          name: perfilAlbergue.nombre,
          email: perfilAlbergue.correo,
          token,
          albergue_id: perfilAlbergue.id,
        });
        navigate("/company/home");
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
            {/* email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="tuemail@ejemplo.com"
                required
              />
            </div>

            {/* password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            {/* role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de cuenta
              </label>
              <select
                name="role"
                id="role"
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
            <span className="block mt-1">
              <a
                href="/register/user"
                className="text-orange-500 hover:underline"
              >
                Registrarme como usuario
              </a>{" "}
              |{" "}
              <a
                href="/register/company"
                className="text-orange-500 hover:underline ml-2"
              >
                como empresa
              </a>
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;