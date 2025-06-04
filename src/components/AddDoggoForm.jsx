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
    tamaño: "",        // “Pequeño” | “Mediano” | “Grande”
    descripcion: "",
    imagenFile: null,  // File
    etiquetas: [],     // Lista de strings
  });
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Actualiza inputs de texto/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Carga el archivo en estado
  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData(prev => ({ ...prev, imagenFile: file }));
  };

  // Añadir etiqueta si no existe
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.etiquetas.includes(tag)) {
      setFormData(prev => ({ ...prev, etiquetas: [...prev.etiquetas, tag] }));
    }
    setTagInput("");
  };

  // Quitar etiqueta
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      etiquetas: prev.etiquetas.filter(t => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones mínimas
    if (!token || !albergueId) {
      setError("Debes iniciar sesión como albergue para registrar mascotas.");
      return;
    }
    if (!formData.nombre.trim() || !formData.edad.trim() || !formData.tamaño.trim()) {
      setError("Nombre, Edad y Tamaño son obligatorios.");
      return;
    }
    if (!formData.imagenFile) {
      setError("Debes subir una imagen del doggo.");
      return;
    }

    setSubmitting(true);
    try {
      // 1) Subir imagen a /imagenes
      const imagePayload = new FormData();
      imagePayload.append("image", formData.imagenFile);

      const imgRes = await fetch("http://localhost:8000/imagenes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imagePayload,
      });
      if (!imgRes.ok) {
        const errJson = await imgRes.json();
        throw new Error(errJson.detail || "Error al subir la imagen");
      }
      const imgData = await imgRes.json();
      const imagen_id = imgData.id;

      // 2) Crear mascota con /mascotas
      const payload = {
        nombre: formData.nombre.trim(),
        edad: formData.edad.trim(),
        especie: formData.tamaño.trim(),
        descripcion: formData.descripcion.trim(),
        imagen_id: imagen_id,
        etiquetas: formData.etiquetas,
      };
      const res = await fetch("http://localhost:8000/mascotas", {
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

      // 3) Enriquecer con imageUrl y etiquetas
      newDog.imageUrl = `http://localhost:8000/imagenes/${imagen_id}`;
      newDog.etiquetas = formData.etiquetas;

      // 4) Notificar al padre para que actualice la lista
      if (onDogCreated) onDogCreated(newDog);

      // 5) Reset de formulario
      setFormData({
        nombre: "",
        edad: "",
        tamaño: "",
        descripcion: "",
        imagenFile: null,
        etiquetas: [],
      });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md p-6 max-w-md">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Área de carga de imagen */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col justify-center items-center hover:border-orange-400 cursor-pointer mb-4 relative">
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

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="Ej. Luna"
            required
          />
        </div>

        {/* Edad */}
        <div>
          <label className="block text-sm font-semibold mb-1">Edad</label>
          <input
            name="edad"
            type="text"
            value={formData.edad}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="Ej. 2 años"
            required
          />
        </div>

        {/* Tamaño */}
        <div>
          <label className="block text-sm font-semibold mb-1">Tamaño</label>
          <select
            name="tamaño"
            value={formData.tamaño}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
          >
            <option value="">Selecciona un tamaño</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold mb-1">Descripción</label>
          <textarea
            name="descripcion"
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none h-24"
            placeholder="Describe a tu doggo (opcional)"
          />
        </div>

        {/* Etiquetas */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Etiquetas (presiona “Añadir”)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Ej. jugueton"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
            >
              Añadir
            </button>
          </div>
          {formData.etiquetas.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1">
              {formData.etiquetas.map((t) => (
                <li
                  key={t}
                  className="bg-orange-200 text-orange-800 rounded-full px-2 py-1 text-xs flex items-center gap-1"
                >
                  {t}{" "}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full ${
            submitting ? "bg-gray-300" : "bg-orange-500 hover:bg-orange-600"
          } text-white font-semibold py-3 rounded-lg transition`}
        >
          {submitting ? "Registrando..." : "Registrar Doggo"}
        </button>
      </form>
    </section>
  );
}
