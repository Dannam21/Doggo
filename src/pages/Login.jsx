// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Navbar from "../layout/Navbar";

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();          // ← para leer `state.from`
  const { setUser } = useContext(UserContext);

  /* ───────── Estado del formulario ───────── */
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",          // "user" = adoptante, "company" = albergue
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  /* ───────── Submit ───────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    /* Endpoint según rol */
    const endpoint =
      form.role === "user"
        ? "http://34.195.195.173:8000/login/adoptante"
        : "http://34.195.195.173:8000/login/albergue";

    /* Credenciales */
    const payload = { correo: form.email, contrasena: form.password };

    try {
      /* 1️⃣  Login */
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = (await res.json()).detail || "Credenciales inválidas";
        throw new Error(msg);
      }
      const { access_token: token, id: identityId } = await res.json();

      /* 2️⃣  Persistir token */
      localStorage.setItem("token", token);

      /* 3️⃣  Obtener perfil */
      const headersAuth = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (form.role === "user") {
        const pRes = await fetch("http://34.195.195.173:8000/adoptante/me", {
          headers: headersAuth,
        });
        if (!pRes.ok) throw new Error("No se pudo obtener perfil");
        const p = await pRes.json();
        setUser({
          name:  `${p.nombre} ${p.apellido}`,
          email: p.correo,
          token,
          adoptante_id: identityId,
        });
      } else {
        const pRes = await fetch("http://34.195.195.173:8000/albergue/me", {
          headers: headersAuth,
        });
        if (!pRes.ok) throw new Error("No se pudo obtener perfil");
        const p = await pRes.json();
        setUser({
          name:  p.nombre,
          email: p.correo,
          token,
          albergue_id: identityId,
        });
      }

      /* 4️⃣  Redirección inteligente */
      const from   = location.state?.from;                      // { pathname, state }
      const fallback =
        form.role === "user" ? "/home" : "/company/home";

      navigate(from?.pathname || fallback, {
        replace: true,
        state:   from?.state,   // ← re-envía el mismo `state` (dog, fromIndex…)
      });
    } catch (err) {
      setError(err.message);
    }
  };

  /* ───────── UI ───────── */
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="tuemail@ejemplo.com"
                required
              />
            </div>

            {/* password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            {/* role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Tipo de cuenta
              </label>
              <select
                id="role"
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
            <span className="block mt-1">
              <a href="/register/user" className="text-orange-500 hover:underline">
                Registrarme como usuario
              </a>{" "}
              |{" "}
              <a href="/register/company" className="text-orange-500 hover:underline ml-2">
                como empresa
              </a>
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
