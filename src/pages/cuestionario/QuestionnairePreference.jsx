import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { UserContext } from "../../context/UserContext";

const questions = [
  { 
    key: "vivienda", 
    label: "¿Qué tan importante es que el perrito se adapte a tu casa?",
    icon: "🏠"
  },
  { 
    key: "tieneJardin", 
    label: "¿Qué tan importante es tener jardín para tu perrito?",
    icon: "🌳"
  },
  { 
    key: "estiloVida", 
    label: "¿Qué tan importante es que el perrito combine con tu estilo de vida?",
    icon: "🚶"
  },
  { 
    key: "experiencia", 
    label: "¿Qué tan importante es tener experiencia con mascotas?",
    icon: "📚"
  },
  { 
    key: "tiempo", 
    label: "¿Qué tan importante es tener tiempo para cuidar al perrito?",
    icon: "⏰"
  },
  { 
    key: "convivencia", 
    label: "¿Qué tan importante es que el perrito se lleve bien con niños?",
    subtitle: "Si no hay niños en casa, marca 1",
    icon: "👶"
  },
  { 
    key: "otrasMascotas", 
    label: "¿Qué tan importante es que se lleve bien con otras mascotas?",
    subtitle: "Si no tienes otras mascotas, marca 1",
    icon: "🐱"
  },
  { 
    key: "compromiso", 
    label: "¿Qué tan importante es el compromiso de cuidar bien al perrito?",
    icon: "❤️"
  },
  { 
    key: "fuera", 
    label: "¿Qué tan importante es que el perrito no esté solo todo el día?",
    icon: "🏠"
  },
  { 
    key: "energia", 
    label: "¿Qué tan importante es el nivel de energía del perrito?",
    icon: "⚡"
  },
];

const QuestionnairePreferences = () => {
  

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [registroFinalizado, setRegistroFinalizado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (!registroFinalizado && !user?.questionnaire) {
      navigate("/cuestionario");
    }
  }, [user, navigate, registroFinalizado]);

  const [weights, setWeights] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.key]: 1 }), {})
  );

  const handleChange = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: parseInt(value, 10) }));
    setShowValidation(false);
  };

  const getAnsweredCount = () => {
    return questions.filter(q => weights[q.key] > 1).length;
  };

  const isFormValid = () => {
    return questions.every(q => weights[q.key] && weights[q.key] >= 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validaciones…
    setIsSubmitting(true);

    // 1) Montas sólo los dos campos que faltan
    const updatePayload = {
      etiquetas: user.questionnaire,  // vienen del paso anterior
      pesos:     weights,             // vendrán de este formulario
    };

    // 2) Haces el PATCH
    const res = await fetch(`http://localhost:8000/adoptante/${user.adoptante_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
      body: JSON.stringify(updatePayload),
    });
    if (!res.ok) throw new Error((await res.json()).detail);

    // 3) Actualizas el contexto UNIFICANDO las claves
    setUser(prev => {
    const next = {
      ...prev,
      etiquetas: user.questionnaire,
      pesos: weights,
    };
    localStorage.setItem("user", JSON.stringify(next));
    return next;
  });
    console.log("Stored user:", JSON.parse(localStorage.getItem("user")));

    // 5) Vas al dashboard directamente
    navigate("/dashboard/user");
  };

  const answeredCount = getAnsweredCount();

  return (
    <main className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 pt-24">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 text-lg text-gray-600 hover:text-gray-800"
            >
              <span className="text-xl">←</span> Regresar
            </button>
            
            <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
              ¿Qué es más importante para ti?
            </h1>
            
            <div className="text-center mb-6">
              <p className="text-lg text-gray-600 mb-2">
                Has respondido {answeredCount} de {questions.length} preguntas
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto">
                <div 
                  className="bg-orange-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              📝 Instrucciones simples:
            </h2>
            <div className="space-y-2 text-lg text-blue-700">
              <p><strong>1 = No es importante</strong></p>
              <p><strong>2 = Poco importante</strong></p>
              <p><strong>3 = Importante</strong></p>
              <p><strong>4 = Muy importante</strong></p>
              <p><strong>5 = Extremadamente importante</strong></p>
            </div>
          </div>

          {/* Validation Message */}
          {showValidation && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-red-700 text-lg font-semibold">
                ⚠️ Por favor, responde todas las preguntas antes de continuar.
              </p>
            </div>
          )}

          {/* Questions */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-8 mb-8">
              {questions.map((q, index) => (
                <div key={q.key} className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-4xl">{q.icon}</span>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Pregunta {index + 1}
                        </h3>
                        <p className="text-lg text-gray-700 mt-1">
                          {q.label}
                        </p>
                        {q.subtitle && (
                          <p className="text-base text-gray-600 mt-2 italic">
                            {q.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Simple Rating Buttons */}
                  <div className="flex justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <label 
                        key={val} 
                        className={`flex flex-col items-center p-4 rounded-lg cursor-pointer border-2 transition-all ${
                          weights[q.key] === val
                            ? 'bg-orange-500 text-white border-orange-500 transform scale-105'
                            : 'bg-white border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.key}
                          value={val}
                          checked={weights[q.key] === val}
                          onChange={(e) => handleChange(q.key, e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-3xl font-bold mb-2">{val}</span>
                        <span className="text-sm text-center font-medium">
                          {val === 1 && "No importante"}
                          {val === 2 && "Poco"}
                          {val === 3 && "Importante"}
                          {val === 4 && "Muy importante"}
                          {val === 5 && "Extremadamente"}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Show selection */}
                  {weights[q.key] > 1 && (
                    <div className="mt-4 text-center">
                      <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                        ✓ Seleccionaste: {weights[q.key]}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-12 py-4 text-xl font-bold rounded-lg transition-all ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Enviando respuestas...
                  </span>
                ) : (
                  `Completar registro (${answeredCount}/${questions.length})`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default QuestionnairePreferences;