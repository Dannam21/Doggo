import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { UserContext } from "../../context/UserContext";

const questions = [
  { key: "vivienda", label: "¿Qué tan importante es para ti que el perrito se adapte bien a tu vivienda?" },
  { key: "tieneJardin", label: "¿Qué tan importante es para ti que tu perrito tenga un jardín en casa?" },
  { key: "estiloVida", label: "¿Qué tan importante es para ti que el perrito se adapte bien a tu estilo de vida/actividad?" },
  { key: "experiencia", label: "¿Qué tan importante es para ti tener experiencia cuidando mascotas?" },
  { key: "tiempo", label: "¿Qué tan importante es para ti tener tiempo para cuidar y compartir con tu perrito?" },
  { key: "convivencia", label: "¿Qué tan importante es que el perrito conviva bien con los niños en tu hogar? Si no tienes niños marca 1"},
  { key: "otrasMascotas", label: "¿Qué tan importante es que el perrito conviva bien con las otras mascotas en tu hogar? Si no tienes otras mascotas marca 1" },
  { key: "compromiso", label: "¿Qué importancia le das al compromiso en el cuidado y bienestar del perrito?" },
  { key: "fuera", label: "¿Qué tan importante es para ti que tu perrito no esté solo durante el día?" },
  { key: "energia", label: "¿Qué importancia le das al nivel de energía que tenga tu perrito?" },
];

const QuestionnairePreferences = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [registroFinalizado, setRegistroFinalizado] = useState(false);

  useEffect(() => {
    if (!registroFinalizado && !user?.payloadRegistro) {
      navigate("/cuestionario");
    }
  }, [user, navigate, registroFinalizado]);

  const [weights, setWeights] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.key]: 1 }), {})
  );

  const handleChange = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: parseInt(value, 10) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...user.payloadRegistro,
      etiquetas: user.questionnaire,
      pesos: weights,
    };
    console.log("Payload de registro:", payload);

    try {
      const regRes = await fetch("http://localhost:8000/register/adoptante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!regRes.ok) {
        const err = await regRes.json();
        throw new Error(err.detail || "Error en registro");
      }

      const { access_token, id } = await regRes.json();
      console.log("Registro exitoso:", { access_token, id });

      const perfilRes = await fetch(`http://localhost:8000/adoptante/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!perfilRes.ok) {
        const err2 = await perfilRes.json();
        throw new Error(err2.detail || "Error al obtener perfil");
      }

      const perfil = await perfilRes.json();
      const fullName = `${perfil.nombre} ${perfil.apellido}`;

      const newUser = {
        name: fullName,
        email: perfil.correo,
        token: access_token,
        id: perfil.id,
        pesos: weights,
      };

      setUser(null);
      localStorage.removeItem("user");

      setRegistroFinalizado(true);
      navigate("/login");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <main>
      <Navbar />

      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">
          <button3
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-gray-500 hover:text-gray-700 transition self-start"
          >
            ← Atrás
          </button3>
          <h2 className="text-3xl font-bold text-center mb-4 text-black">
          Indica a qué atributos les das más importancia
          </h2>
          <div className="mb-6">
            <p className="text-gray-600">
              <strong>Escala (1=No lo considero importante, 5= Es muy importante para mí):</strong>
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>
                <strong>1:</strong> No lo considero importante
              </li>
              <li>
                <strong>2:</strong> Poco importante
              </li>
              <li>
                <strong>3:</strong> Moderadamente importante
              </li>
              <li>
                <strong>4:</strong> Importante
              </li>
              <li>
                <strong>5:</strong> Muy importante
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {questions.map((q) => (
                <div key={q.key}>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    {q.label}
                  </h3>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <label key={val} className="flex flex-col items-center">
                        <input
                          type="radio"
                          name={q.key}
                          value={val}
                          checked={weights[q.key] === val}
                          onChange={(e) => handleChange(q.key, e.target.value)}
                        />
                        <span className="mt-1 text-sm text-gray-600">
                          {val}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
