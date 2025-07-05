// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Navbar from "../layout/Navbar";

const API_URL = "http://34.195.195.173:8000";      // cambia si tu backend vive en otro host

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { setUser } = useContext(UserContext);

  /* ---------- estado del formulario ---------- */
  const [form, setForm] = useState({
    email:    "",
    password: "",
    role:     "user",      // "user" = adoptante, "company" = albergue
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const loginUrl =
      form.role === "user"
        ? `${API_URL}/login/adoptante`
        : `${API_URL}/login/albergue`;

    const payload = { correo: form.email, contrasena: form.password };

    try {
      /* 1️⃣  login */
      const res = await fetch(loginUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = (await res.json()).detail || "Credenciales inválidas";
        throw new Error(msg);
      }
      const { access_token: token, id } = await res.json();

      /* 2️⃣  token → localStorage */
      localStorage.setItem("token", token);

      /* 3️⃣  perfil */
      const headersAuth = {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${token}`,
      };

      let userObj;

      if (form.role === "user") {
        const pRes = await fetch(`${API_URL}/adoptante/me`, {
          headers: headersAuth,
        });
        if (!pRes.ok) throw new Error("No se pudo obtener perfil");
        const p = await pRes.json();

        userObj = {
          name:          `${p.nombre} ${p.apellido}`,
          email:         p.correo,
          token,
          adoptante_id:  p.id,        // id devuelto por /login/adoptante
        };
      } else {
        const pRes = await fetch(`${API_URL}/albergue/me`, {
          headers: headersAuth,
        });
        if (!pRes.ok) throw new Error("No se pudo obtener perfil");
        const p = await pRes.json();

        userObj = {
          name:         p.nombre,
          email:        p.correo,
          token,
          albergue_id:  p.id,         // id devuelto por /login/albergue
        };
      }

      /* 4️⃣  guarda en contexto + localStorage (reemplaza cualquier valor anterior) */
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);

      /* 5️⃣  redirección inteligente */
      const fromSaved = sessionStorage.getItem("postAuthRedirect");
      let   redirect  = null;
      if (fromSaved) {
        redirect = JSON.parse(fromSaved);
        sessionStorage.removeItem("postAuthRedirect");
      }
      const fallback = form.role === "user" ? "/dashboard/user"
                                            : "/company/home";

      navigate(redirect?.pathname || fallback, {
        replace: true,
        state:   redirect?.state,       // conserva el state (dog, fromIndex…)
      });
    } catch (err) {
      setError(err.message);
    }
  };

  /* ---------- ui ---------- */
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
              <Link
                to="/register/user"
                state={{ fromPending: sessionStorage.getItem("postAuthRedirect") }}
                className="text-orange-500 hover:underline"
              >
                Registrarme como usuario
              </Link>{" "}
              |{" "}
              <Link
                to="/register/company"
                state={{ fromPending: sessionStorage.getItem("postAuthRedirect") }}
                className="text-orange-500 hover:underline ml-2"
              >
                como empresa
              </Link>
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
