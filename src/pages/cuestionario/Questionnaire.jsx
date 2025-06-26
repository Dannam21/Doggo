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

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-xl p-4 sm:p-8 lg:p-16 w-full max-w-5xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-gray-500 hover:text-gray-700 transition self-start"
          >
            ← Atrás
          </button>
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Cuestionario de Compatibilidad
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {[{
              name: "vivienda",
              label: "Vivienda",
              hint: "(¿Dónde vives?)",
              options: [
                { value: "vive_en_casa", label: "Casa" },
                { value: "vive_en_apartamento", label: "Apartamento" }
              ]
            }, {
              name: "tieneJardin",
              label: "¿Tiene jardín?",
              hint: "(Sí o No)",
              options: [
                { value: "si_jardin", label: "Sí" },
                { value: "no_jardin", label: "No" }
              ]
            }, {
              name: "estiloVida",
              label: "Estilo de vida",
              hint: "(Actividad)",
              options: [
                { value: "muy_activo", label: "Muy Activo" },
                { value: "actividad_moderada", label: "Moderada" },
                { value: "tranquilo", label: "Tranquilo" }
              ]
            }, {
              name: "experiencia",
              label: "Experiencia",
              hint: "(Con perros)",
              options: [
                { value: "primera_experiencia", label: "Primera vez" },
                { value: "poca_experiencia", label: "Poca" },
                { value: "mucha_experiencia", label: "Mucha" }
              ]
            }, {
              name: "tiempo",
              label: "Tiempo",
              hint: "(Diario)",
              options: [
                { value: "tiempo_completo", label: "Completo" },
                { value: "medio_tiempo", label: "Medio" },
                { value: "poco_tiempo", label: "Poco" },
                { value: "viaja_frecuentemente", label: "Viaja" }
              ]
            }, {
              name: "convivencia",
              label: "Convivencia",
              hint: "(¿Niños?)",
              options: [
                { value: "familia_con_ninos", label: "Con niños" },
                { value: "sin_ninos", label: "Sin niños" }
              ]
            }, {
              name: "otrasMascotas",
              label: "Otras mascotas",
              options: [
                { value: "si_mascotas", label: "Sí" },
                { value: "no_mascotas", label: "No" }
              ]
            }, {
              name: "compromiso",
              label: "Compromiso",
              hint: "(Gastos / Adiestrar)",
              options: [
                { value: "adiestrar", label: "Adiestrar" },
                { value: "costear_veterinario", label: "Costear vet" },
                { value: "baja_mantenimiento", label: "Bajo mant." },
                { value: "cuidado_especial", label: "Especial" }
              ]
            }, {
              name: "fuera",
              label: "Tiempo fuera",
              hint: "(Solo)",
              options: [
                { value: "mucho_fuera", label: "Mucho" },
                { value: "moderado_fuera", label: "Moderado" },
                { value: "poco_fuera", label: "Poco" }
              ]
            }, {
              name: "energia",
              label: "Energía",
              hint: "(Deseada)",
              options: [
                { value: "baja", label: "Baja" },
                { value: "media", label: "Media" },
                { value: "alta", label: "Alta" }
              ]
            }].map((field) => (
              <div key={field.name} className="min-w-0">
                <h3 className="text-lg font-semibold mb-2 break-words">
                  {field.label} {field.hint && (
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
            ))}

            {/* Temperamento */}
            <div>
              <h3 className="text-lg font-semibold mb-2 break-words">
                Temperamento <span className="text-gray-500 text-sm">(3 máx.)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {["jugueton", "calmado", "sociable", "curioso", "protectivo", "reservado", "miedoso"].map((val) => (
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

            {/* Otros atributos */}
            <div>
              <h3 className="text-lg font-semibold mb-2 break-words">
                Otros atributos <span className="text-gray-500 text-sm">(2 máx.)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {["ladra_mucho", "silencioso", "afectuoso", "independiente"].map((val) => (
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
