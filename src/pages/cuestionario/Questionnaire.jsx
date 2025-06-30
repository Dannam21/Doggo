import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { UserContext } from "../../context/UserContext";

const Questionnaire = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user?.nombre) {
      navigate("/register/user");
    }
  }, [user, navigate]);

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

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemperamentoChange = (e) => {
    const { value, checked } = e.target;
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

  const handleOtrosAtributosChange = (e) => {
    const { value, checked } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const fields = [
    {
      name: "vivienda",
      label: "¿Dónde vives?",
      hint: "",
      options: [
        { value: "vive_en_casa", label: "Casa" },
        { value: "vive_en_apartamento", label: "Departamento" }
      ]
    },
    {
      name: "tieneJardin",
      label: "¿Tienes jardín?",
      hint: "",
      options: [
        { value: "si_jardin", label: "Sí" },
        { value: "no_jardin", label: "No" }
      ]
    },
    {
      name: "estiloVida",
      label: "¿Cómo describirías tu ritmo de vida?",
      hint: "(Actividad)",
      options: [
        { value: "muy_activo", label: "Muy activo (me muevo mucho, hago ejercicio o actividades frecuentes)" },
        { value: "actividad_moderada", label: "Moderado (me gusta salir y moverme, pero también descansar)" },
        { value: "tranquilo", label: "Tranquilo (prefiero estar en casa y llevar un ritmo calmado)" }
      ]
    },
    {
      name: "experiencia",
      label: "¿Qué tanta experiencia tienes cuidando perros?",
      hint: "",
      options: [
        { value: "primera_experiencia", label: "Nunca he tenido, soy primerizo(a)" },
        { value: "poca_experiencia", label: "He tenido alguno antes " },
        { value: "mucha_experiencia", label: "He tenido varios o sé mucho" }
      ]
    },
    {
      name: "tiempo",
      label: "¿Qué tanto tiempo diario tienes disponible para cuidar a tu perrito?",
      hint: "",
      options: [
        { value: "tiempo_completo", label: "Mucho tiempo (disponibilidad completa)" },
        { value: "medio_tiempo", label: "Tiempo medio (algunas horas al día)" },
        { value: "poco_tiempo", label: "Poco tiempo (muy limitado)" },
        { value: "viaja_frecuentemente", label: "Viajo con frecuencia" }
      ]
    },
    {
      name: "convivencia",
      label: "¿Hay niños en tu hogar?",
      hint: "",
      options: [
        { value: "familia_con_ninos", label: "Sí, hay niños en casa" },
        { value: "sin_ninos", label: "No, no hay niños" }
      ]
    },
    {
      name: "otrasMascotas",
      label: "¿Tienes otras mascotas?",
      options: [
        { value: "si_mascotas", label: "Sí" },
        { value: "no_mascotas", label: "No" }
      ]
    },
    {
      name: "compromiso",
      label: "¿Qué nivel de compromiso estás dispuesto(a) a asumir con tu futuro perrito?",
      hint: " (Considera el tiempo, los cuidados, los gastos y la paciencia para entrenarlo)",
      options: [
        { value: "adiestrar", label: "Estoy dispuesta/o a entrenarlo (adiestrar)" },
        { value: "costear_veterinario", label: "Puedo cubrir gastos veterinarios y cuidados" },
        { value: "baja_mantenimiento", label: "Prefiero un perrito de bajo mantenimiento" },
        { value: "cuidado_especial", label: "Estoy dispuesta/o a cuidar un caso especial" }
      ]
    },
    {
      name: "fuera",
      label: "¿Cuánto tiempo al día puedes dedicar a sacar a pasear a tu perrito?",
      hint: " (Actividad al aire libre)",
      options: [
        { value: "mucho_fuera", label: "Mucho, varias salidas largas" },
        { value: "moderado_fuera", label: "Moderado, 1 o 2 paseos diarios" },
        { value: "poco_fuera", label: "Poco, salidas muy cortas o esporádicas" }
      ]
    },
    {
      name: "energia",
      label: "¿Qué nivel de energía te gustaría que tenga tu perrito?",
      hint: " (Piensa en cuánto te gustaría que sea activo o tranquilo) ",
      options: [
        { value: "baja", label: "Baja - más tranquilo y relajado" },
        { value: "media", label: "Media - equilibrado, con actividad moderada " },
        { value: "alta", label: "Alta - muy activo " }
      ]
    }
  ];

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-xl p-4 sm:p-8 lg:p-16 w-full max-w-5xl">
          <button2
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-gray-500 hover:text-gray-700 transition self-start"
          >
            ← Atrás
          </button2>
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Cuestionario de Compatibilidad
          </h2>
          <h2 className="text-2xl font-bold mt-6 mb-4 text-orange-500 border-t border-gray-300 pt-4">
                    Sobre ti
                  </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {fields.map((field) => (
              <React.Fragment key={field.name}>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold mb-2 break-words">
                    {field.label}{" "}
                    {field.hint && (
                      <span className="text-gray-500 text-sm">{field.hint}</span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {field.options.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name={field.name}
                          value={opt.value}
                          checked={formData[field.name] === opt.value}
                          onChange={handleRadioChange}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {field.name === "fuera" && (
                  <h2 className="text-2xl font-bold mt-6 mb-4 text-orange-500 border-t border-gray-300 pt-4">
                    Sobre tu perrito ideal
                  </h2>
                )}
              </React.Fragment>
            ))}

            <div>
              <h3 className="text-lg font-semibold mb-2 break-words">
              ¿Qué temperamento te gustaría que tenga tu perrito? <span className="text-gray-500 text-sm">(3 máx.)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {/* cambie miedoso por timido*/}
                {["juguetón", "calmado", "sociable", "curioso", "protector", "reservado", "tímido"].map((val) => (
                  <label key={val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="temperamento"
                      value={val}
                      checked={formData.temperamento.includes(val)}
                      onChange={handleTemperamentoChange}
                    />
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {formData.temperamento.length} / 3 seleccionados
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 break-words">
                Otros temperamentos <span className="text-gray-500 text-sm">(2 máx.)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* cambie ladra mucho por expresivo*/}
                {["Expresivo", "silencioso", "afectuoso", "independiente"].map((val) => (
                  <label key={val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="otrosAtributos"
                      value={val}
                      checked={formData.otrosAtributos.includes(val)}
                      onChange={handleOtrosAtributosChange}
                    />
                    {val.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {formData.otrosAtributos.length} / 2 seleccionados
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Continuar a Preferencias
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Questionnaire;
