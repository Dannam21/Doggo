import React, { useState, useEffect, useContext } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import { UserContext } from "../../context/UserContext";

const Tags = ({ etiquetas, id, expandedTags, toggleTags }) => {
  return (
    <div className="mt-3">
      {(expandedTags[id] ? etiquetas : etiquetas.slice(0, 5)).map((tag, index) => (
        <span
          key={index}
          className="inline-block bg-[#f77534] text-white text-xs px-2 py-1 rounded-full mr-2 mb-2"
        >
          {tag}
        </span>
      ))}

      {etiquetas.length > 5 && (
        <button
          onClick={() => toggleTags(id)}
          className="bg-[#f77534] text-white rounded-full mr-1 mb-2 hover:bg-[#e76628] transition duration-300 ease-in-out"
          style={{
            fontSize: "10px",
            padding: "4px 8px",
            lineHeight: "1rem",
            fontFamily: "inherit",
            border: "1px solid transparent",
            cursor: "pointer",
          }}
        >
          {expandedTags[id] ? "ver menos" : "ver más"}
        </button>
      )}
    </div>
  );
};

export default function EditDoggo() {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const albergueId = user?.albergue_id;
  const [expandedTags, setExpandedTags] = useState({});
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editDog, setEditDog] = useState(null);

  const toggleTags = (id) => {
    setExpandedTags((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    if (!token || !albergueId) return;

    setLoading(true);
    setError(null);

    fetch(`http://34.195.195.173:8000/mascotas/albergue/${albergueId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar mascotas");
        return res.json();
      })
      .then((data) => {
        const enriched = data.map((m) => ({
          id: m.id,
          nombre: m.nombre,
          edad: m.edad,
          especie: m.especie,
          descripcion: m.descripcion || "",
          etiquetas: m.etiquetas || [],
          imageUrl: `http://34.195.195.173:8000/imagenes/${m.imagen_id}`,
        }));
        setDogs(enriched);
      })
      .catch((err) => {
        setError("Error al cargar los perros. Intenta nuevamente más tarde.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, albergueId]);

  const handleEditClick = (dog) => {
    setEditDog({
      ...dog,
      etiquetas: dog.etiquetas || [],
      descripcion: dog.descripcion || "",
    });
    setShowModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editDog || !token) return;

    fetch(`http://34.195.195.173:8000/mascotas/${editDog.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: editDog.nombre,
        edad: editDog.edad,
        especie: editDog.especie,
        descripcion: editDog.descripcion || "",
        etiquetas: editDog.etiquetas || [],
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar mascota");
        return res.json();
      })
      .then((updatedDog) => {
        setDogs((prev) =>
          prev.map((dog) =>
            dog.id === updatedDog.id
              ? {
                  ...dog,
                  nombre: updatedDog.nombre,
                  edad: updatedDog.edad,
                  especie: updatedDog.especie,
                  descripcion: updatedDog.descripcion,
                  etiquetas: updatedDog.etiquetas || [],
                }
              : dog
          )
        );
        setShowModal(false);
        setEditDog(null);
      })
      .catch((err) => {
        alert("Error al actualizar la mascota");
        console.error(err);
      });
  };

  const handleCheckboxChange = (event) => {
  const { name, value, checked } = event.target;

  // Actualiza el estado de acuerdo al nombre del grupo y el valor de la casilla
  setFormData((prevState) => {
    const newValue = checked
      ? [...prevState[name], value]
      : prevState[name].filter((item) => item !== value);

    return { ...prevState, [name]: newValue };
  });
};


  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />

      <main className="flex-1 px-8 py-8 space-y-12">
        <h1 className="text-4xl font-extrabold text-[#2e2e2e]">🐶 Lista de Doggos</h1>

        <section>
          <h2 className="text-2xl font-semibold mb-6">🐾 Perritos Registrados</h2>

          {loading && <div className="text-center text-gray-500">Cargando perros...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {dogs.map((dog) => (
              <div key={dog.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
                <img
                  src={dog.imageUrl}
                  alt={dog.nombre}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#333]">{dog.nombre}</h3>
                  <p className="text-sm text-gray-600">Edad: {dog.edad} años</p>
                  <p className="text-sm text-gray-600">Especie: {dog.especie}</p>
                  <Tags
                    etiquetas={dog.etiquetas || []}
                    id={dog.id}
                    expandedTags={expandedTags}
                    toggleTags={toggleTags}
                  />
                  <button
                    onClick={() => handleEditClick(dog)}
                    className="mt-4 text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal para editar */}
      {showModal && (
        <div className="fixed inset-0 bg-[#FFE5B4]/60 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Editar mascota</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  value={editDog.nombre}
                  onChange={(e) => setEditDog({ ...editDog, nombre: e.target.value })}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f77534]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Edad</label>
                <input
                  type="number"
                  value={editDog.edad}
                  onChange={(e) => setEditDog({ ...editDog, edad: Number(e.target.value) })}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f77534]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Especie</label>
                <input
                  type="text"
                  value={editDog.especie}
                  onChange={(e) => setEditDog({ ...editDog, especie: e.target.value })}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f77534]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Descripción</label>
                <textarea
                  value={editDog.descripcion || ""}
                  onChange={(e) => setEditDog({ ...editDog, descripcion: e.target.value })}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f77534]"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-300 text-white rounded-md hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
