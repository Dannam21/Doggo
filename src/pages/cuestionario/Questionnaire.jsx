import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, Home, Heart, CheckCircle } from "lucide-react";
import { UserContext } from "../../context/UserContext";

const Questionnaire = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user?.nombre) {
      navigate("/register/user");
    }
  }, [user, navigate]);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    vivienda: "",
    tieneJardin: "",
    estiloVida: "",
    experiencia: "",
    tiempo: "",
    convivencia: "",
    otrasMascotas: "",
    compromiso: "",
    fuera: "",
    energia: "",
    temperamento: [],
    otrosAtributos: [],
  });

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemperamentoChange = (value, checked) => {
    setFormData((prev) => {
      const list = prev.temperamento;
      if (checked) {
        if (list.length >= 3) return prev;
        return { ...prev, temperamento: [...list, value] };
      } else {
        return { ...prev, temperamento: list.filter((v) => v !== value) };
      }
    });
  };

  const handleOtrosAtributosChange = (value, checked) => {
    setFormData((prev) => {
      const list = prev.otrosAtributos;
      if (checked) {
        if (list.length >= 2) return prev;
        return { ...prev, otrosAtributos: [...list, value] };
      } else {
        return { ...prev, otrosAtributos: list.filter((v) => v !== value) };
      }
    });
  };

  const handleSubmit = () => {
    const etiquetasObj = { ...formData };
    const payloadRegistro = {
      nombre: user.nombre,
      apellido: user.apellido,
      dni: user.dni,
      correo: user.correo,
      telefono: user.telefono,
      contrasena: user.contrasena,
      imagen_perfil_id: user.imagen_perfil_id,
      etiquetas: etiquetasObj,
    };
    setUser((prev) => ({
      ...prev,
      payloadRegistro,
      questionnaire: etiquetasObj,
    }));
    navigate("/preferences");
  };

  const questions = [
    {
      id: "vivienda",
      category: "Sobre ti",
      icon: <Home className="w-6 h-6" />,
      title: "¿Dónde vives?",
      type: "radio",
      options: [
        { value: "vive_en_casa", label: "Casa", emoji: "🏠" },
        { value: "vive_en_apartamento", label: "Departamento", emoji: "🏢" }
      ]
    },
    {
      id: "tieneJardin",
      category: "Sobre ti",
      icon: <Home className="w-6 h-6" />,
      title: "¿Tienes jardín?",
      type: "radio",
      options: [
        { value: "si_jardin", label: "Sí, tengo jardín", emoji: "🌳" },
        { value: "no_jardin", label: "No tengo jardín", emoji: "🚫" }
      ]
    },
    {
      id: "estiloVida",
      category: "Sobre ti",
      icon: <User className="w-6 h-6" />,
      title: "¿Cómo describirías tu ritmo de vida?",
      subtitle: "Actividad",
      type: "radio",
      options: [
        { value: "muy_activo", label: "Muy activo", description: "Me muevo mucho, hago ejercicio frecuente", emoji: "🏃‍♂️" },
        { value: "actividad_moderada", label: "Moderado", description: "Me gusta salir pero también descansar", emoji: "🚶‍♂️" },
        { value: "tranquilo", label: "Tranquilo", description: "Prefiero estar en casa y llevar un ritmo calmado", emoji: "🧘‍♂️" }
      ]
    },
    {
      id: "experiencia",
      category: "Sobre ti",
      icon: <User className="w-6 h-6" />,
      title: "¿Qué tanta experiencia tienes cuidando perros?",
      type: "radio",
      options: [
        { value: "primera_experiencia", label: "Soy primerizo(a)", description: "Nunca he tenido perro", emoji: "🐕" },
        { value: "poca_experiencia", label: "Poca experiencia", description: "He tenido alguno antes", emoji: "🐕‍🦺" },
        { value: "mucha_experiencia", label: "Mucha experiencia", description: "He tenido varios o sé mucho", emoji: "🏆" }
      ]
    },
    {
      id: "tiempo",
      category: "Sobre ti",
      icon: <User className="w-6 h-6" />,
      title: "¿Qué tanto tiempo diario tienes disponible?",
      subtitle: "Para cuidar a tu perrito",
      type: "radio",
      options: [
        { value: "tiempo_completo", label: "Mucho tiempo", description: "Disponibilidad completa", emoji: "⏰" },
        { value: "medio_tiempo", label: "Tiempo medio", description: "Algunas horas al día", emoji: "🕐" },
        { value: "poco_tiempo", label: "Poco tiempo", description: "Muy limitado", emoji: "⏳" },
        { value: "viaja_frecuentemente", label: "Viajo frecuentemente", description: "No siempre estoy disponible", emoji: "✈️" }
      ]
    },
    {
      id: "convivencia",
      category: "Sobre ti",
      icon: <User className="w-6 h-6" />,
      title: "¿Hay niños en tu hogar?",
      type: "radio",
      options: [
        { value: "familia_con_ninos", label: "Sí, hay niños", emoji: "👨‍👩‍👧‍👦" },
        { value: "sin_ninos", label: "No hay niños", emoji: "👫" }
      ]
    },
    {
      id: "otrasMascotas",
      category: "Sobre ti",
      icon: <User className="w-6 h-6" />,
      title: "¿Tienes otras mascotas?",
      type: "radio",
      options: [
        { value: "si_mascotas", label: "Sí tengo", emoji: "🐱" },
        { value: "no_mascotas", label: "No tengo", emoji: "🚫" }
      ]
    },
    {
      id: "compromiso",
      category: "Sobre ti",
      icon: <Heart className="w-6 h-6" />,
      title: "¿Qué nivel de compromiso estás dispuesto(a) a asumir?",
      subtitle: "Considera tiempo, cuidados, gastos y paciencia",
      type: "radio",
      options: [
        { value: "adiestrar", label: "Entrenamiento", description: "Estoy dispuesta/o a entrenarlo", emoji: "🎓" },
        { value: "costear_veterinario", label: "Cuidados completos", description: "Puedo cubrir gastos veterinarios", emoji: "💰" },
        { value: "baja_mantenimiento", label: "Bajo mantenimiento", description: "Prefiero un perrito fácil de cuidar", emoji: "😌" },
        { value: "cuidado_especial", label: "Cuidado especial", description: "Estoy dispuesta/o a casos especiales", emoji: "💖" }
      ]
    },
    {
      id: "fuera",
      category: "Sobre ti",
      icon: <User className="w-6 h-6" />,
      title: "¿Cuánto tiempo puedes dedicar a pasear?",
      subtitle: "Actividad al aire libre",
      type: "radio",
      options: [
        { value: "mucho_fuera", label: "Mucho tiempo", description: "Varias salidas largas", emoji: "🚶‍♀️" },
        { value: "moderado_fuera", label: "Tiempo moderado", description: "1 o 2 paseos diarios", emoji: "🚶" },
        { value: "poco_fuera", label: "Poco tiempo", description: "Salidas cortas o esporádicas", emoji: "⏱️" }
      ]
    },
    {
      id: "energia",
      category: "Sobre tu perrito ideal",
      icon: <Heart className="w-6 h-6" />,
      title: "¿Qué nivel de energía te gustaría?",
      subtitle: "Para tu perrito ideal",
      type: "radio",
      options: [
        { value: "baja", label: "Baja energía", description: "Más tranquilo y relajado", emoji: "😴" },
        { value: "media", label: "Energía media", description: "Equilibrado, actividad moderada", emoji: "🐕" },
        { value: "alta", label: "Alta energía", description: "Muy activo y juguetón", emoji: "⚡" }
      ]
    },
    {
      id: "temperamento",
      category: "Sobre tu perrito ideal",
      icon: <Heart className="w-6 h-6" />,
      title: "¿Qué temperamento te gustaría?",
      subtitle: "Máximo 3 opciones",
      type: "checkbox",
      maxSelections: 3,
      options: [
        { value: "juguetón", label: "Juguetón", emoji: "🎾" },
        { value: "calmado", label: "Calmado", emoji: "😌" },
        { value: "sociable", label: "Sociable", emoji: "🤝" },
        { value: "curioso", label: "Curioso", emoji: "🔍" },
        { value: "protector", label: "Protector", emoji: "🛡️" },
        { value: "reservado", label: "Reservado", emoji: "🤐" },
        { value: "tímido", label: "Tímido", emoji: "😊" }
      ]
    },
    {
      id: "otrosAtributos",
      category: "Sobre tu perrito ideal",
      icon: <Heart className="w-6 h-6" />,
      title: "Otros temperamentos",
      subtitle: "Máximo 2 opciones",
      type: "checkbox",
      maxSelections: 2,
      options: [
        { value: "Expresivo", label: "Expresivo", emoji: "🗣️" },
        { value: "silencioso", label: "Silencioso", emoji: "🤫" },
        { value: "afectuoso", label: "Afectuoso", emoji: "💕" },
        { value: "independiente", label: "Independiente", emoji: "🦅" }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const totalSteps = questions.length;

  const canProceed = () => {
    if (currentQuestion.type === "radio") {
      return formData[currentQuestion.id] !== "";
    } else if (currentQuestion.type === "checkbox") {
      return formData[currentQuestion.id].length > 0;
    }
    return true;
  };

  const nextStep = () => {
    if (isLastStep) {
      handleSubmit();
    } else if (canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Cuestionario de Compatibilidad
          </h1>
          <p className="text-gray-600">
            Encuentra tu compañero perfecto
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Pregunta {currentStep + 1} de {totalSteps}
            </span>
            <span className="text-sm text-orange-600 font-semibold">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 min-h-[500px]">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-orange-100 p-2 rounded-full">
              {currentQuestion.icon}
            </div>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {currentQuestion.category}
            </span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentQuestion.title}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-gray-600">
                {currentQuestion.subtitle}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.type === "radio" && (
              <div className="grid gap-4">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData[currentQuestion.id] === option.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                    onClick={() => handleRadioChange(currentQuestion.id, option.value)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{option.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {option.label}
                        </h3>
                        {option.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {option.description}
                          </p>
                        )}
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData[currentQuestion.id] === option.value
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-300"
                      }`}>
                        {formData[currentQuestion.id] === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === "checkbox" && (
              <div className="grid gap-4">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData[currentQuestion.id].includes(option.value)
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                    onClick={() => {
                      const isChecked = formData[currentQuestion.id].includes(option.value);
                      if (currentQuestion.id === "temperamento") {
                        handleTemperamentoChange(option.value, !isChecked);
                      } else {
                        handleOtrosAtributosChange(option.value, !isChecked);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{option.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {option.label}
                        </h3>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData[currentQuestion.id].includes(option.value)
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-300"
                      }`}>
                        {formData[currentQuestion.id].includes(option.value) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-gray-500 text-center">
                  {formData[currentQuestion.id].length} / {currentQuestion.maxSelections} seleccionados
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-orange-500"
                    : index < currentStep
                    ? "bg-orange-300"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              canProceed()
                ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLastStep ? "Finalizar" : "Siguiente"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;