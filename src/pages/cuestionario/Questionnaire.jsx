import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { UserContext } from "../../context/UserContext";

const Questionnaire = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  // Si no hay usuario (registro inicial), redirigir
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

    // Construimos un objeto JSON de respuestas (key → respuesta o array)
    const etiquetasObj = { ...formData };

    // Payload completo para el registro
    const payloadRegistro = {
      nombre: user.nombre,
      apellido: user.apellido,
      dni: user.dni,
      correo: user.correo,
      telefono: user.telefono,
      contrasena: user.contrasena,
      imagen_perfil_id: user.imagen_perfil_id,
      etiquetas: etiquetasObj,    // Ahora un objeto con todas las respuestas
    };

    // Guardamos en contexto y navegamos a preferencias
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
      <div className="bg-white shadow-xl rounded-xl p-16 w-full max-w-5xl">
      <button3
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-gray-500 hover:text-gray-700 transition self-start"
          >
            ← Atrás
          </button3>
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Cuestionario de Compatibilidad
          </h2>
         
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Vivienda */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Vivienda{" "}
                <span className="text-gray-500 text-sm">(¿Dónde vives?)</span>
              </h3>
              <div className="flex gap-6">
                {[
                  { value: "vive_en_casa", label: "Casa" },
                  { value: "vive_en_apartamento", label: "Apartamento" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="vivienda"
                      value={opt.value}
                      checked={formData.vivienda === opt.value}
                      onChange={handleRadioChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* ¿Tiene jardín? */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                ¿Tiene jardín?{" "}
                <span className="text-gray-500 text-sm">(Sí o No)</span>
              </h3>
              <div className="flex gap-6">
                {[
                  { value: "si_jardin", label: "Sí" },
                  { value: "no_jardin", label: "No" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tieneJardin"
                      value={opt.value}
                      checked={formData.tieneJardin === opt.value}
                      onChange={handleRadioChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Estilo de vida */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Estilo de vida{" "}
                <span className="text-gray-500 text-sm">(Actividad)</span>
              </h3>
              <div className="flex gap-6">
                {[
                  { value: "muy_activo", label: "Muy Activo" },
                  { value: "actividad_moderada", label: "Moderada" },
                  { value: "tranquilo", label: "Tranquilo" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="estiloVida"
                      value={opt.value}
                      checked={formData.estiloVida === opt.value}
                      onChange={handleRadioChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Experiencia */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Experiencia{" "}
                <span className="text-gray-500 text-sm">(Con perros)</span>
              </h3>
              <div className="flex gap-6">
                {[
                  { value: "primera_experiencia", label: "Primera vez" },
                  { value: "poca_experiencia", label: "Poca" },
                  { value: "mucha_experiencia", label: "Mucha" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="experiencia"
                      value={opt.value}
                      checked={formData.experiencia === opt.value}
                      onChange={handleRadioChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Disponibilidad de tiempo */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Tiempo{" "}
                <span className="text-gray-500 text-sm">(Diario)</span>
              </h3>
              <div className="flex gap-6">
                {[
                  { value: "tiempo_completo", label: "Completo" },
                  { value: "medio_tiempo", label: "Medio" },
                  { value: "poco_tiempo", label: "Poco" },
                  { value: "viaja_frecuentemente", label: "Viaja" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tiempo"
                      value={opt.value}
                      checked={formData.tiempo === opt.value}
                      onChange={handleRadioChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Convivencia */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Convivencia{" "}
                <span className="text-gray-500 text-sm">(¿Niños?)</span>
              </h3>
              <div className="flex gap-6">
                {[
                  { value: "familia_con_ninos", label: "Con niños" },
                  { value: "sin_ninos", label: "Sin niños" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="convivencia"
                      value={opt.value}
                      checked={formData.convivencia === opt.value}
                      onChange={handleRadioChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Otras mascotas */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Otras mascotas
              </h3>
              <div className="flex gap-6">
                {[
                  { value: "si_mascotas", label: "Sí" },
                  { value: "no_mascotas", label: "No" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="otrasMascotas"
                      value={opt.value}
                      checked={formData.otrasMascotas === opt.value}
                      onChange={handleRadioChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Compromiso de cuidado */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Compromiso{" "}
                <span className="text-gray-500 text-sm">(Gastos / Adiestrar)</span>
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                {[
                  { value: "adiestrar", label: "Adiestrar" },
                  { value: "costear_veterinario", label: "Costear vet" },
                  { value: "baja_mantenimiento", label: "Bajo mant." },
                  { value: "cuidado_especial", label: "Especial" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="compromiso"
                      value={opt.value}
                      checked={formData.compromiso === opt.value}
                      onChange={handleRadioChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Tiempo fuera */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Tiempo fuera{" "}
                <span className="text-gray-500 text-sm">(Solo)</span>
              </h3>
              <div className="flex gap-6">
                {[
                  { value: "mucho_fuera", label: "Mucho" },
                  { value: "moderado_fuera", label: "Moderado" },
                  { value: "poco_fuera", label: "Poco" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="fuera"
                      value={opt.value}
                      checked={formData.fuera === opt.value}
                      onChange={handleRadioChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Energía */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Energía{" "}
                <span className="text-gray-500 text-sm">(Deseada)</span>
              </h3>
              <div className="flex gap-6">
                {[
                  { value: "baja", label: "Baja" },
                  { value: "media", label: "Media" },
                  { value: "alta", label: "Alta" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="energia"
                      value={opt.value}
                      checked={formData.energia === opt.value}
                      onChange={handleRadioChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Temperamento (máx 3) */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Temperamento <span className="text-gray-500 text-sm">(3 máx.)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "jugueton",
                  "calmado",
                  "sociable",
                  "curioso",
                  "protectivo",
                  "reservado",
                  "miedoso",
                ].map((val) => (
                  <label key={val} className="flex items-center gap-2">
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

            {/* Otros atributos (máx 2) */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Otros atributos <span className="text-gray-500 text-sm">(2 máx.)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "ladra_mucho",
                  "silencioso",
                  "afectuoso",
                  "independiente",
                ].map((val) => (
                  <label key={val} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="otrosAtributos"
                      value={val}
                      checked={formData.otrosAtributos.includes(val)}
                      onChange={handleOtrosAtributosChange}
                    />
                    {val.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {formData.otrosAtributos.length} / 2 seleccionados
              </p>
            </div>

            <button
              type="submit"
              className="col-span-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
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
