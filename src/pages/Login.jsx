import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Navbar from "../layout/Navbar";

const API_URL = "http://localhost:8000"; // ajusta si tu backend está en otro host

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext);

  /* ---------- estado del formulario ---------- */
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

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Iniciando login con rol:", form.role); // Debug

    const loginUrl =
      form.role === "user"
        ? `${API_URL}/login/adoptante`
        : `${API_URL}/login/albergue`;

    console.log("URL de login:", loginUrl); // Debug

    const payload = { correo: form.email, contrasena: form.password };

    try {
      /* 1️⃣  login */
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        switch (res.status) {
          case 400:
            throw new Error(errBody.detail || "Solicitud inválida");
          case 401:
            throw new Error("Correo o contraseña incorrecta");
          case 404:
            throw new Error("Usuario no encontrado");
          case 422:
            throw new Error("Cuenta no creada. Verifica tus datos");
          default:
            throw new Error(errBody.detail || "Error desconocido al iniciar sesión");
        }
      }
      const { access_token: token, id } = await res.json();

      /* 2️⃣  token → localStorage */
      localStorage.setItem("token", token);

      /* 3️⃣  perfil */
      const headersAuth = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      let userObj;
      if (form.role === "user") {
        const pRes = await fetch(`${API_URL}/adoptante/me`, {
          headers: headersAuth,
        });
        if (!pRes.ok) {
          if (pRes.status === 401)
            throw new Error("Sesión expirada, por favor inicia sesión de nuevo");
          throw new Error("No se pudo obtener perfil de adoptante");
        }
        const p = await pRes.json();
        userObj = {
          name: `${p.nombre} ${p.apellido}`,
          email: p.correo,
          token,
          adoptante_id: p.id,
          etiquetas: p.etiquetas,
          pesos: p.pesos,
          role: "user" // Agregar rol para claridad
        };
      } else {
        const pRes = await fetch(`${API_URL}/albergue/me`, {
          headers: headersAuth,
        });
        if (!pRes.ok) {
          if (pRes.status === 401)
            throw new Error("Sesión expirada, por favor inicia sesión de nuevo");
          throw new Error("No se pudo obtener perfil de albergue");
        }
        const p = await pRes.json();
        userObj = {
          name: p.nombre,
          email: p.correo,
          token,
          albergue_id: p.id,
          role: "company" // Agregar rol para claridad
        };
      }

      /* 4️⃣  guarda en contexto + localStorage */
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);

      /* 5️⃣  redirección mejorada */
      console.log("Usuario logueado exitosamente:", userObj); // Debug
      
      // Primero intentar obtener la ruta guardada
      const fromSaved = sessionStorage.getItem("postAuthRedirect");
      let redirectPath = null;
      let redirectState = null;

      if (fromSaved) {
        try {
          const parsed = JSON.parse(fromSaved);
          const savedPath = parsed.pathname;
          console.log("Ruta guardada encontrada:", savedPath); // Debug
          
          // Validar que la ruta guardada sea compatible con el rol del usuario
          const isUserPath = savedPath.startsWith('/home') || savedPath === '/';
          const isCompanyPath = savedPath.startsWith('/company');
          
          if (form.role === "user" && isUserPath) {
            // Usuario adoptante con ruta de usuario - OK
            redirectPath = savedPath;
            redirectState = parsed.state;
          } else if (form.role === "company" && isCompanyPath) {
            // Empresa con ruta de empresa - OK
            redirectPath = savedPath;
            redirectState = parsed.state;
          } else {
            // Incompatibilidad: usar ruta por defecto
            console.log("Ruta guardada incompatible con el rol, usando por defecto"); // Debug
            redirectPath = null;
          }
          
          sessionStorage.removeItem("postAuthRedirect");
        } catch (e) {
          console.warn("Error parsing saved redirect:", e);
        }
      }

      // Si no hay ruta guardada o es incompatible, usar la ruta por defecto según el rol
      if (!redirectPath) {
        redirectPath = form.role === "user" ? "/home" : "/company/home";
        console.log("Usando ruta por defecto:", redirectPath, "para rol:", form.role); // Debug
      }

      console.log("Navegando a:", redirectPath); // Debug

      // Forzar la navegación de forma más robusta
      const performNavigation = () => {
        try {
          navigate(redirectPath, {
            replace: true,
            state: redirectState,
          });
          console.log("Navegación ejecutada"); // Debug
        } catch (navError) {
          console.error("Error en navegación:", navError);
          // Fallback: usar window.location si navigate falla
          window.location.href = redirectPath;
        }
      };

      // Intentar navegación inmediata y con timeout como respaldo
      performNavigation();
      setTimeout(performNavigation, 50);

    } catch (err) {
      console.error("Login error:", err); // Debug
      setError(err.message || "Ha ocurrido un error inesperado");
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
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
                autoComplete="current-password"
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