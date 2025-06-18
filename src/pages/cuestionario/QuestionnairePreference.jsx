import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { UserContext } from "../../context/UserContext";

const questions = [
  { key: "vivienda", label: "Tipo de vivienda" },
  { key: "tieneJardin", label: "¿Tiene jardín?" },
  { key: "estiloVida", label: "Estilo de vida / actividad" },
  { key: "experiencia", label: "Experiencia con perros" },
  { key: "tiempo", label: "Disponibilidad de tiempo" },
  { key: "convivencia", label: "Convivencia (¿Niños en casa?)" },
  { key: "otrasMascotas", label: "Otras mascotas en casa" },
  { key: "compromiso", label: "Compromiso de cuidado" },
  { key: "fuera", label: "Tiempo fuera de casa" },
  { key: "energia", label: "Nivel de energía deseado" }
];

const QuestionnairePreferences = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  // Redirigir si no existe payload de registro previo
  useEffect(() => {
    if (!user?.payloadRegistro) {
      navigate("/cuestionario");
    }
  }, [user, navigate]);

  // Estado inicial de pesos: todos en 3 (medio)
  const [weights, setWeights] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.key]: 3 }), {})
  );

  const handleChange = (key, value) => {
    setWeights(prev => ({ ...prev, [key]: parseInt(value, 10) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparamos payload de registro con etiquetas (dict) y pesos
    const payload = {
      ...user.payloadRegistro,
      etiquetas: user.questionnaire,
      pesos: weights,
    };

    try {
      // 1) Registro
      const regRes = await fetch("http://localhost:8000/register/adoptante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!regRes.ok) {
        const err = await regRes.json();
        throw new Error(err.detail || "Error en registro");
      }
      const { token, id } = await regRes.json();

      // 2) Obtener perfil
      const perfilRes = await fetch("http://localhost:8000/adoptante/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!perfilRes.ok) {
        const err2 = await perfilRes.json();
        throw new Error(err2.detail || "Error al obtener perfil");
      }
      const perfil = await perfilRes.json();
      const fullName = `${perfil.nombre} ${perfil.apellido}`;

      // 3) Guardar en contexto y localStorage
      const newUser = {
        name: fullName,
        email: perfil.correo,
        token,
        id: perfil.id,
        pesos: weights,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      // 4) Redirigir a home
      navigate("/home");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-black">
            Ajusta tus preferencias de peso
          </h2>
          {/* Leyenda de escala */}
          <div className="mb-6">
            <p className="text-gray-600"><strong>Escala (1=No importa, 5=Muy importante):</strong></p>
            <ul className="list-disc list-inside text-gray-600">
              <li><strong>1:</strong> No importa</li>
              <li><strong>2:</strong> Poco importante</li>
              <li><strong>3:</strong> Moderado</li>
              <li><strong>4:</strong> Importante</li>
              <li><strong>5:</strong> Muy importante</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map(q => (
              <div key={q.key}>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  {q.label}
                </h3>
                <div className="flex gap-6">
                  {[1,2,3,4,5].map(val => (
                    <label key={val} className="flex flex-col items-center">
                      <input
                        type="radio"
                        name={q.key}
                        value={val}
                        checked={weights[q.key] === val}
                        onChange={e => handleChange(q.key, e.target.value)}
                      />
                      <span className="mt-1 text-sm text-gray-600">{val}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Completar registro
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default QuestionnairePreferences;
