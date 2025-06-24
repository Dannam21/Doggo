import React, { useState, useContext } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { UserContext } from "../context/UserContext";

export default function AddDoggoForm({ onDogCreated }) {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const albergueId = user?.albergue_id;

  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    tamaño: "",
    genero:"",
    vacunas: [],
    descripcion: "",
    imagenFile: null,
    vivienda: [],               
    jardin: [],                 
    estilo_vida: [],            
    experiencia: [],           
    disponibilidad_tiempo: [],  
    ninos: [],                 
    otrasMascotas: [],          
    compromiso: [],             
    tiempoSolo: [],             
    energia: [],                
    temperamento: [],           
    otrosAtributos: [],         
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData((prev) => ({ ...prev, imagenFile: file }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;

    setFormData((prev) => {
      const actuales = prev[name];
      const limite =
        name === "temperamento" ? 3 :
        name === "jardin" ? 1 :
        name === "vacunas" ? 5:
        2;

      if (checked) {
        if (actuales.length < limite) {
          return { ...prev, [name]: [...actuales, value] };
        }
        return prev;
      } else {
        return { ...prev, [name]: actuales.filter((v) => v !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token || !albergueId) {
      setError("Debes iniciar sesión como albergue para registrar mascotas.");
      return;
    }
    if (
      !formData.nombre.trim() ||
      !formData.edad.trim() ||
      !formData.tamaño.trim()
    ) {
      setError("Nombre, Edad y Tamaño son obligatorios.");
      return;
    }
    if (!formData.imagenFile) {
      setError("Debes subir una imagen del doggo.");
      return;
    }

    // Validar que cada categoría tenga al menos 1 selección
    const categoriasRequeridas = [
      "vivienda",
      "jardin",
      "estilo_vida",
      "experiencia",
      "disponibilidad_tiempo",
      "ninos",
      "otrasMascotas",
      "compromiso",
      "tiempoSolo",
      "energia",
      "temperamento",
      "otrosAtributos",
    ];
    for (let cat of categoriasRequeridas) {
      if (formData[cat].length === 0) {
        setError(`Debes seleccionar al menos una opción en "${cat}".`);
        return;
      }
    }

    setSubmitting(true);
    try {
      // 1) Subir imagen
      const imagePayload = new FormData();
      imagePayload.append("image", formData.imagenFile);

      const imgRes = await fetch("http://34.195.195.173:8000/imagenes", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: imagePayload,
      });
      if (!imgRes.ok) {
        const errJson = await imgRes.json();
        throw new Error(errJson.detail || "Error al subir la imagen");
      }
      const imgData = await imgRes.json();
      const imagen_id = imgData.id;

      // 2) Construir array de etiquetas (solo valores)
      const etiquetasParaAPI = [];
      categoriasRequeridas.forEach((cat) => {
        formData[cat].forEach((val) => {
          etiquetasParaAPI.push(val);
        });
      });

      // 3) Obtener timestamp actual en ISO
      const fechaCreacion = new Date().toISOString();

      // 4) Crear mascota, incluyendo la fecha de creación
      const payload = {
        nombre: formData.nombre.trim(),
        edad: formData.edad.trim(),
        especie: formData.tamaño.trim(),
        genero: formData.genero.trim(),
        vacunas: formData.vacunas,
        descripcion: formData.descripcion.trim(),
        imagen_id: imagen_id,
        etiquetas: etiquetasParaAPI,
        fecha_creacion: fechaCreacion, // se incluye el timestamp aquí
        estado: "En adopción",
      };
      const res = await fetch("http://34.195.195.173:8000/mascotas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || "Error al registrar la mascota");
      }
      const newDog = await res.json();
      newDog.imageUrl = `http://34.195.195.173:8000/imagenes/${imagen_id}`;
      newDog.etiquetas = etiquetasParaAPI;
      newDog.fecha_creacion = fechaCreacion;

      if (onDogCreated) onDogCreated(newDog);

      // 5) Resetear formulario completo
      setFormData({
        nombre: "",
        edad: "",
        tamaño: "",
        genero: "",
        vacunas: [],
        descripcion: "",
        imagenFile: null,
        vivienda: [],
        jardin: [],
        estilo_vida: [],
        experiencia: [],
        disponibilidad_tiempo: [],
        ninos: [],
        otrasMascotas: [],
        compromiso: [],
        tiempoSolo: [],
        energia: [],
        temperamento: [],
        otrosAtributos: [],
      });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="screen bg-gray-50">
      <section className="bg-white rounded-xl shadow-lg p-6 max-w-screen-5xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start"
        >
          <div className="space-y-5">
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col justify-center items-center hover:border-orange-400 cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              <FaCloudUploadAlt className="text-4xl text-gray-400" />
              <p className="text-gray-500 text-sm mt-1">
                {formData.imagenFile
                  ? formData.imagenFile.name
                  : "Haz clic para subir imagen"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Nombre
              </label>
              <input
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                placeholder="Ej. Luna"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Edad
              </label>
              <input
                name="edad"
                type="text"
                value={formData.edad}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                placeholder="Ej. 2 "
                required
              />
            </div>


            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Genero
              </label>
              <input
                name="genero"
                type="text"
                value={formData.genero}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                placeholder="Hembra o Macho"
                required
              />
            </div>


            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Vacunas:{" "}
                <span className="text-gray-500 text-sm">(Máx. 5)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "Vacuna 1", label: "v1" },
                  { val: "Vacuna 2", label: "v2" },
                  { val: "Vacuna 3", label: "v3" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="vacunas"
                      value={op.val}
                      checked={formData.vacunas.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.vacunas.length} / 5 seleccionados
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Tamaño
              </label>
              <select
                name="tamaño"
                value={formData.tamaño}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                required
              >
                <option value="">Selecciona un tamaño</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Historia
              </label>
              <textarea
                name="descripcion"
                rows="4"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none min-h-[25rem] text-sm"
                placeholder="Describe a tu doggo (opcional)"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Se adapta a:{" "}
                <span className="text-gray-500 text-sm">(Máx. 2)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "casa", label: "Casa" },
                  { val: "departamento", label: "Departamento" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="vivienda"
                      value={op.val}
                      checked={formData.vivienda.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.vivienda.length} / 2 seleccionados
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                ¿Necesita Jardín?{" "}
                <span className="text-gray-500 text-sm">(Máx. 1)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "si_jardin", label: "Sí" },
                  { val: "no_jardin", label: "No" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="jardin"
                      value={op.val}
                      checked={formData.jardin.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.jardin.length} / 1 seleccionados
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Tengo un estilo de vida{" "}
                <span className="text-gray-500 text-sm">(Máx. 2)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "muy_activo", label: "Muy Activo" },
                  { val: "actividad_moderada", label: "Actividad Moderada" },
                  { val: "tranquilo", label: "Tranquilo" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="estilo_vida"
                      value={op.val}
                      checked={formData.estilo_vida.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.estilo_vida.length} / 2 seleccionados
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Ideal para dueños con{" "}
                <span className="text-gray-500 text-sm">(Máx. 2)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "primera_experiencia", label: "Primera experiencia" },
                  { val: "poca_experiencia", label: "Poca experiencia" },
                  { val: "mucha_experiencia", label: "Mucha experiencia" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="experiencia"
                      value={op.val}
                      checked={formData.experiencia.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.experiencia.length} / 2 seleccionados
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Necesita disponibilidad de tiempo{" "}
                <span className="text-gray-500 text-sm">(Máx. 2)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "tiempo_completo", label: "Tiempo completo" },
                  { val: "medio_tiempo", label: "Medio tiempo" },
                  { val: "poco_tiempo", label: "Poco tiempo" },
                  { val: "viaja_frecuentemente", label: "Viaja frecuentemente" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="disponibilidad_tiempo"
                      value={op.val}
                      checked={formData.disponibilidad_tiempo.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.disponibilidad_tiempo.length} / 2 seleccionados
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Ideal para convivir con niños{" "}
                <span className="text-gray-500 text-sm">(Máx. 2)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "familia_con_ninos", label: "Familia con niños" },
                  { val: "sin_ninos", label: "Sin niños" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="ninos"
                      value={op.val}
                      checked={formData.ninos.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.ninos.length} / 2 seleccionados
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Ideal para convivir con otras mascotas{" "}
                <span className="text-gray-500 text-sm">(Máx. 2)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "si_mascotas", label: "Sí" },
                  { val: "no_mascotas", label: "No" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="otrasMascotas"
                      value={op.val}
                      checked={formData.otrasMascotas.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.otrasMascotas.length} / 2 seleccionados
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Compromiso de cuidado{" "}
                <span className="text-gray-500 text-sm">(Máx. 2)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "dispuesto_adiestrar", label: "Dispuesto a adiestrar" },
                  { val: "puede_costear_veterinario", label: "Puede costear veterinario" },
                  { val: "cuidado_baja_mantenimiento", label: "Cuidado baja mantenimiento" },
                  { val: "cuidado_especial", label: "Cuidado especial" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="compromiso"
                      value={op.val}
                      checked={formData.compromiso.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.compromiso.length} / 2 seleccionados
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Ideal para dueños con{" "}
                <span className="text-gray-500 text-sm">(Máx. 2)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "mucho_tiempo_fuera", label: "Mucho tiempo en casa" },
                  { val: "tiempo_moderado_fuera", label: "Tiempo moderado fuera" },
                  { val: "poco_tiempo_fuera", label: "Poco tiempo en casa" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="tiempoSolo"
                      value={op.val}
                      checked={formData.tiempoSolo.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.tiempoSolo.length} / 2 seleccionados
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Nivel de energía{" "}
                <span className="text-gray-500 text-sm">(Máx. 2)</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { val: "energia_baja", label: "Energía baja" },
                  { val: "energia_media", label: "Energía media" },
                  { val: "energia_alta", label: "Energía alta" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="energia"
                      value={op.val}
                      checked={formData.energia.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.energia.length} / 2 seleccionados
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Temperamento{" "}
                <span className="text-gray-500 text-sm">(Máx. 3)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {[
                  { val: "jugueton", label: "Juguetón" },
                  { val: "calmado", label: "Calmado" },
                  { val: "reservado", label: "Reservado" },
                  { val: "sociable", label: "Sociable" },
                  { val: "curioso", label: "Curioso" },
                  { val: "protectivo", label: "Protector" },
                  { val: "miedoso", label: "Miedoso" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="temperamento"
                      value={op.val}
                      checked={formData.temperamento.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.temperamento.length} / 3 seleccionados
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Otros Atributos{" "}
                <span className="text-gray-500 text-sm">(Máx. 2)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {[
                  { val: "ladra_mucho", label: "Ladra mucho" },
                  { val: "silencioso", label: "Silencioso" },
                  { val: "afectuoso", label: "Afectuoso" },
                  { val: "independiente", label: "Independiente" },
                  { val: "protector", label: "Protector" },
                  { val: "inquieto", label: "Inquieto" },
                ].map((op) => (
                  <label key={op.val} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="otrosAtributos"
                      value={op.val}
                      checked={formData.otrosAtributos.includes(op.val)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span className="text-gray-700">{op.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formData.otrosAtributos.length} / 2 seleccionados
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full ${
                submitting ? "bg-gray-300" : "bg-orange-500 hover:bg-orange-600"
              } text-white font-semibold py-3 rounded-lg transition`}
            >
              {submitting ? "Registrando..." : "Registrar Doggo"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
