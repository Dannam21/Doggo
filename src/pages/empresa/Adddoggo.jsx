import React, { useState, useEffect, useContext } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import AddDoggoForm from "../../components/AddDoggoForm";
import { UserContext } from "../../context/UserContext";

export default function Adddoggo() {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const albergueId = user?.albergue_id;

  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    if (!token || !albergueId) return;

    fetch(`http://localhost:8000/mascotas/albergue/${albergueId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar mascotas");
        return res.json();
      })
      .then((data) => {
        const enriched = data
          .map((m) => ({
            id: m.id,
            nombre: m.nombre,
            edad: m.edad,
            especie: m.especie,
            imageUrl: `http://localhost:8000/imagenes/${m.imagen_id}`,
            etiquetas: m.etiquetas || [],
          }))
          .sort((a, b) => b.id - a.id) // Orden descendente por ID
          .slice(0, 4); // Solo las 4 más recientes
        setDogs(enriched);
      })      
      .catch((err) => console.error("Fetch mascotas:", err.message));
  }, [token, albergueId]);

  const handleNewDog = (createdDog) => {
    setDogs((prev) => [createdDog, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-[#fdf0df] ml-64">
  <div className="sticky top-0 h-screen">
    <SidebarCompany />
  </div>
      <main className="flex-1 px-10 py-10 space-y-10">
        <h1 className="text-3xl font-extrabold text-[#2e2e2e]">🐶 Añadir Doggos</h1>

        <section>
          <h2 className="text-xl font-semibold mb-4">🐾 Perritos Registrados</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dogs
            .slice() // para no mutar el estado original
            .sort((a, b) => b.id - a.id) // ordena por ID descendente
            .slice(0, 4) // toma las 4 más recientes
            .map((dog) => (

              <div
                key={dog.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <img
                  src={dog.imageUrl}
                  alt={dog.nombre}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold">{dog.nombre}</h4>
                  <p className="text-sm text-gray-600">
                    {dog.edad} — {dog.especie}
                  </p>
                  {dog.etiquetas.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1">
                      {dog.etiquetas.slice(0, 5).map((tag) => (
                        <li
                          key={tag}
                          className="text-xs bg-orange-200 text-orange-800 rounded-full px-2 py-1"
                        >
                          {tag.replace(/_/g, " ")}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">➕ Registrar Nuevo Doggo</h2>
          <AddDoggoForm onDogCreated={handleNewDog} />
        </section>
      </main>
    </div>
  );
}
