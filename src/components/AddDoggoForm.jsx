import { useState, useRef, useContext } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function AddDoggoForm() {
  const [image, setImage] = useState(null);
  const [imagenId, setImagenId] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    especie: "",
    descripcion: "",
  });

  const { user } = useContext(UserContext);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      try {
        const imgData = new FormData();
        imgData.append("image", file);

        const imgRes = await axios.post("http://localhost:8000/imagenes", imgData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setImagenId(imgRes.data.id); // Guardamos el ID devuelto por el backend
        console.log("Imagen subida con ID:", imgRes.data.id);
      } catch (error) {
        console.error("Error al subir imagen:", error);
        alert("Error al subir la imagen");
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('http://localhost:8000/login/albergue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: form.email,
          ruc: form.ruc,
          contrasena: form.password,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error al iniciar sesión');
      }
  
      const data = await res.json();
      setUser({ email: form.email, token: data.access_token });
  
      //Para guardar el token del usuario logeado en el localStorage
      localStorage.setItem('token', data.access_token);
  
      navigate('/company/home');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  
  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <div
        onClick={handleImageClick}
        className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col justify-center items-center hover:border-orange-400 cursor-pointer mb-6"
      >
        <FaCloudUploadAlt className="text-4xl text-gray-400" />
        <p className="text-gray-500 text-sm mt-1">
          {image ? image.name : "Sube una imagen del doggo"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Ej. Luna"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Edad</label>
          <input
            type="text"
            name="edad"
            value={formData.edad}
            onChange={handleInputChange}
            placeholder="Ej. 2 años"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Especie</label>
          <select
            name="especie"
            value={formData.especie}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="">Selecciona un tamaño</option>
            <option value="Pequeño">Perro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Tamaño</label>
          <select
            name="tamaño"
            value={formData.tamaño}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="">Selecciona un tamaño</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Describe a tu doggo"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none h-24"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#f77534] hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition"
        >
          Registrar Doggo
        </button>
      </form>
    </section>
  );
}
