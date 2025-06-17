import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { UserContext } from "../../context/UserContext";

const Questionnaire = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Debes completar primero el registro.</p>
        {setTimeout(() => navigate("/register/user"), 1500)}
      </div>
    );
  }

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTemperamentoChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const current = prev.temperamento;
      if (checked) {
        if (current.length >= 3) return prev; // no más de 3
        return { ...prev, temperamento: [...current, value] };
      } else {
        return { ...prev, temperamento: current.filter((v) => v !== value) };
      }
    });
  };

  const handleOtrosAtributosChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const current = prev.otrosAtributos;
      if (checked) {
        if (current.length >= 2) return prev; // no más de 2
        return { ...prev, otrosAtributos: [...current, value] };
      } else {
        return { ...prev, otrosAtributos: current.filter((v) => v !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let etiquetasSeleccionadas = [];
    [
      "vivienda",
      "tieneJardin",
      "estiloVida",
      "experiencia",
      "tiempo",
      "convivencia",
      "otrasMascotas",
      "compromiso",
      "fuera",
      "energia",
    ].forEach((key) => {
      if (formData[key]) etiquetasSeleccionadas.push(formData[key]);
    });
    etiquetasSeleccionadas = etiquetasSeleccionadas
      .concat(formData.temperamento)
      .concat(formData.otrosAtributos);

    try {
      const payloadRegistro = {
        nombre: user.nombre,
        apellido: user.apellido,
        dni: user.dni,
        correo: user.correo,
        telefono: user.telefono,
        contrasena: user.contrasena,
        imagen_perfil_id: user.imagen_perfil_id,
        etiquetas: etiquetasSeleccionadas,
      };

      console.log("Payload que se enviará al backend:", payloadRegistro); // <-- AQUÍ

      const registerRes = await fetch("http://localhost:8000/register/adoptante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadRegistro),
      });
      if (!registerRes.ok) {
        const errData = await registerRes.json();
        throw new Error(errData.detail || "Error al registrar adoptante");
      }

      const loginRes = await fetch("http://localhost:8000/login/adoptante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: user.correo,
          contrasena: user.contrasena,
        }),
      });
      if (!loginRes.ok) {
        const errData2 = await loginRes.json();
        throw new Error(errData2.detail || "Error al iniciar sesión automáticamente");
      }
      const loginData = await loginRes.json();
      const token = loginData.access_token;
      console.log("Payload que se enviará al backend:", payloadRegistro); // <-- AQUÍ

      const perfilRes = await fetch("http://localhost:8000/adoptante/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!perfilRes.ok) {
        const perfilErr = await perfilRes.json();
        throw new Error(perfilErr.detail || "No se pudo obtener perfil");
      }
      const perfilData = await perfilRes.json();

      navigate("/home");
      setUser({
        name: `${perfilData.nombre} ${perfilData.apellido}`,
        email: perfilData.correo,
        token,
      });

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Cuestionario de Compatibilidad
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Vivienda{" "}
                <span className="text-gray-500 text-sm">
                  (¿En qué tipo de espacio habitas?)
                </span>
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="vivienda"
                    value="vive_en_casa"
                    checked={formData.vivienda === "vive_en_casa"}
                    onChange={handleRadioChange}
                  />
                  Vive en Casa
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="vivienda"
                    value="vive_en_apartamento"
                    checked={formData.vivienda === "vive_en_apartamento"}
                    onChange={handleRadioChange}
                  />
                  Vive en Apartamento
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                ¿Tiene Jardín?{" "}
                <span className="text-gray-500 text-sm">
                  (¿Tienes jardín en tu vivienda?)
                </span>
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tieneJardin"
                    value="si_jardin"
                    checked={formData.tieneJardin === "si_jardin"}
                    onChange={handleRadioChange}
                  />
                  Sí
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tieneJardin"
                    value="no_jardin"
                    checked={formData.tieneJardin === "no_jardin"}
                    onChange={handleRadioChange}
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Estilo de vida / Actividad{" "}
                <span className="text-gray-500 text-sm">
                  (¿Qué nivel de actividad llevas?)
                </span>
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="estiloVida"
                    value="muy_activo"
                    checked={formData.estiloVida === "muy_activo"}
                    onChange={handleRadioChange}
                  />
                  Muy Activo
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="estiloVida"
                    value="actividad_moderada"
                    checked={formData.estiloVida === "actividad_moderada"}
                    onChange={handleRadioChange}
                  />
                  Actividad Moderada
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="estiloVida"
                    value="tranquilo"
                    checked={formData.estiloVida === "tranquilo"}
                    onChange={handleRadioChange}
                  />
                  Tranquilo
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Experiencia con perros{" "}
                <span className="text-gray-500 text-sm">
                  (¿Has tenido mascotas antes?)
                </span>
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="experiencia"
                    value="primera_experiencia"
                    checked={formData.experiencia === "primera_experiencia"}
                    onChange={handleRadioChange}
                  />
                  Primera experiencia
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="experiencia"
                    value="poca_experiencia"
                    checked={formData.experiencia === "poca_experiencia"}
                    onChange={handleRadioChange}
                  />
                  Poca experiencia
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="experiencia"
                    value="mucha_experiencia"
                    checked={formData.experiencia === "mucha_experiencia"}
                    onChange={handleRadioChange}
                  />
                  Mucha experiencia
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Disponibilidad de tiempo{" "}
                <span className="text-gray-500 text-sm">
                  (¿Cuánto tiempo diario puedes dedicar a tu mascota?)
                </span>
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tiempo"
                    value="tiempo_completo"
                    checked={formData.tiempo === "tiempo_completo"}
                    onChange={handleRadioChange}
                  />
                  Tiempo completo
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tiempo"
                    value="medio_tiempo"
                    checked={formData.tiempo === "medio_tiempo"}
                    onChange={handleRadioChange}
                  />
                  Medio tiempo
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tiempo"
                    value="poco_tiempo"
                    checked={formData.tiempo === "poco_tiempo"}
                    onChange={handleRadioChange}
                  />
                  Poco tiempo
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tiempo"
                    value="viaja_frecuentemente"
                    checked={formData.tiempo === "viaja_frecuentemente"}
                    onChange={handleRadioChange}
                  />
                  Viaja frecuentemente
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Convivencia{" "}
                <span className="text-gray-500 text-sm">
                  (¿Tu hogar incluye niños?)
                </span>
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="convivencia"
                    value="familia_con_ninos"
                    checked={formData.convivencia === "familia_con_ninos"}
                    onChange={handleRadioChange}
                  />
                  Familia con niños
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="convivencia"
                    value="sin_ninos"
                    checked={formData.convivencia === "sin_ninos"}
                    onChange={handleRadioChange}
                  />
                  Sin niños
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Otras mascotas{" "}
                <span className="text-gray-500 text-sm">
                  (¿Hay otras mascotas en casa?)
                </span>
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="otrasMascotas"
                    value="si_mascotas"
                    checked={formData.otrasMascotas === "si_mascotas"}
                    onChange={handleRadioChange}
                  />
                  Sí
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="otrasMascotas"
                    value="no_mascotas"
                    checked={formData.otrasMascotas === "no_mascotas"}
                    onChange={handleRadioChange}
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Compromiso de cuidado{" "}
                <span className="text-gray-500 text-sm">
                  (¿Puedes cubrir gastos y adiestrar?)
                </span>
              </h3>
              <div className="flex flex-col gap-2 md:flex-row md:gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="compromiso"
                    value="dispuesto_adiestrar"
                    checked={formData.compromiso === "dispuesto_adiestrar"}
                    onChange={handleRadioChange}
                  />
                  Dispuesto a adiestrar
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="compromiso"
                    value="puede_costear_veterinario"
                    checked={formData.compromiso === "puede_costear_veterinario"}
                    onChange={handleRadioChange}
                  />
                  Puede costear veterinario
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="compromiso"
                    value="cuidado_baja_mantenimiento"
                    checked={formData.compromiso === "cuidado_baja_mantenimiento"}
                    onChange={handleRadioChange}
                  />
                  Cuidado baja mantenimiento
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="compromiso"
                    value="cuidado_especial"
                    checked={formData.compromiso === "cuidado_especial"}
                    onChange={handleRadioChange}
                  />
                  Cuidado especial
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Tiempo fuera de casa{" "}
                <span className="text-gray-500 text-sm">
                  (¿Cuánto tiempo pasará solo tu perro?)
                </span>
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fuera"
                    value="mucho_tiempo_fuera"
                    checked={formData.fuera === "mucho_tiempo_fuera"}
                    onChange={handleRadioChange}
                  />
                  Mucho tiempo fuera
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fuera"
                    value="tiempo_moderado_fuera"
                    checked={formData.fuera === "tiempo_moderado_fuera"}
                    onChange={handleRadioChange}
                  />
                  Tiempo moderado fuera
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fuera"
                    value="poco_tiempo_fuera"
                    checked={formData.fuera === "poco_tiempo_fuera"}
                    onChange={handleRadioChange}
                  />
                  Poco tiempo fuera
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Nivel de energía deseado{" "}
                <span className="text-gray-500 text-sm">
                  (¿Qué nivel de energía deseas en tu mascota?)
                </span>
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="energia"
                    value="energia_baja"
                    checked={formData.energia === "energia_baja"}
                    onChange={handleRadioChange}
                  />
                  Energía baja
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="energia"
                    value="energia_media"
                    checked={formData.energia === "energia_media"}
                    onChange={handleRadioChange}
                  />
                  Energía media
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="energia"
                    value="energia_alta"
                    checked={formData.energia === "energia_alta"}
                    onChange={handleRadioChange}
                  />
                  Energía alta
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Temperamento{" "}
                <span className="text-gray-500 text-sm">
                  (Máx. 3, elige las características que prefieras)
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "jugueton",
                  "calmado",
                  "reservado",
                  "sociable",
                  "curioso",
                  "protectivo",
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
                    {val
                      .split("_")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {formData.temperamento.length} / 3 seleccionados
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Otros atributos{" "}
                <span className="text-gray-500 text-sm">
                  (Máx. 2, elige hasta dos características)
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["ladra_mucho", "silencioso", "afectuoso", "independiente"].map(
                  (val) => (
                    <label key={val} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="otrosAtributos"
                        value={val}
                        checked={formData.otrosAtributos.includes(val)}
                        onChange={handleOtrosAtributosChange}
                      />
                      {val
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </label>
                  )
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {formData.otrosAtributos.length} / 2 seleccionados
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Enviar respuestas y finalizar registro
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Questionnaire;
