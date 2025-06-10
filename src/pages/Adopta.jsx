import React, { useState, useEffect } from "react";

const Adopta = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetch("http://34.195.195.173:8000/mascotas")
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudieron obtener las mascotas");
        }
        return res.json();
      })
      .then((data) => {
        setPets(data);
      })
      .catch((err) => {
        console.error("Error al cargar mascotas:", err);
        setPets([]); // dejamos el array vacío si hay error
      });
  }, []);

  return (
    <nav>
      {/* Contenedor relativo para que absolute funcione dentro */}
      <section className="relative w-full px-4 md:px-20 py-12">
        {/* Círculo decorativo (fondo) */}
        {/*
        <div className="absolute top-[130px] left-[-100px] w-[400px] h-[400px] bg-[#9cdcd4] rounded-full opacity-40 blur-[100px] z-0"></div>
        <div className="absolute top-[130px] left-[-100px] w-[400px] h-[400px] bg-[#9cdcd4] rounded-full opacity-40 blur-[100px] z-0"></div>

        <div className="absolute top-[600px] left-[1200px] w-[400px] h-[400px] bg-[#9cdcd4] rounded-full opacity-40 blur-[100px] z-0"></div>
        <div className="absolute top-[600px] left-[1200px] w-[400px] h-[400px] bg-[#9cdcd4] rounded-full opacity-40 blur-[100px] z-0"></div>
        */}

        {/* Contenido con z-index alto para estar delante */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-center mb-8">🐾 Adopta</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filtros (sin lógica por ahora, solo UI) */}
            <aside className="bg-white rounded-lg p-6 shadow-sm space-y-6">
              <div>
                <p className="font-bold mb-2">Género</p>
                <label className="block">
                  <input type="checkbox" className="mr-2" /> Macho
                </label>
                <label className="block">
                  <input type="checkbox" className="mr-2" /> Hembra
                </label>
              </div>
              <div>
                <p className="font-bold mb-2">Edad</p>
                {["Cachorro", "Joven", "Adulto", "Adulto Mayor"].map((age) => (
                  <label key={age} className="block">
                    <input type="checkbox" className="mr-2" /> {age}
                  </label>
                ))}
              </div>
              <div>
                <p className="font-bold mb-2">Salud</p>
                {["Esterilizado", "Vacunas completas", "Desparasitado"].map((item) => (
                  <label key={item} className="block">
                    <input type="checkbox" className="mr-2" /> {item}
                  </label>
                ))}
              </div>
            </aside>

            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.length === 0 ? (
                <p className="text-center text-gray-600 col-span-full">
                  No hay mascotas registradas por el momento.
                </p>
              ) : (
                pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-orange-300 text-white rounded-lg p-4 text-center shadow-md hover:scale-105 transition"
                  >
                    <img
                      src={`http://34.195.195.173:8000/imagenes/${pet.imagen_id}`}
                      alt={pet.nombre}
                      className="w-full h-36 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=Sin+Imagen";
                      }}
                    />
                    <h3 className="font-bold text-lg">{pet.nombre}</h3>
                    <p className="text-sm">
                      {pet.edad} {pet.edad === 1 ? "año" : ""} <br />
                      {pet.especie}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </nav>
  );
};

export default Adopta;
