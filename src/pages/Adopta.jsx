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

  const [filtros, setFiltros] = useState({
    genero: [],
    edad: [],
  });

  const toggleFiltro = (categoria, valor) => {
    setFiltros((prev) => {
      const yaSeleccionado = prev[categoria].includes(valor);
      return {
        ...prev,
        [categoria]: yaSeleccionado
          ? prev[categoria].filter((v) => v !== valor)
          : [...prev[categoria], valor],
      };
    });
  };

  return (
    <nav>
      {/* Contenedor relativo para que absolute funcione dentro */}
      <section className="relative w-full px-4 md:px-20 py-12">
        {/* Círculo decorativo (fondo) */}

        {/* Contenido con z-index alto para estar delante */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-center mb-8">🐾 Adopta</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filtros (ahora con lógica) */}
            <aside className="bg-white rounded-lg p-6 shadow-sm space-y-6">
              <div>
                <p className="font-bold mb-2">Género</p>
                {["Macho", "Hembra"].map((genero) => (
                  <label key={genero} className="block">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filtros.genero.includes(genero)}
                      onChange={() => toggleFiltro("genero", genero)} // ✅ corregido
                    />
                    {genero}
                  </label>
                ))}
              </div>

              <div>
                <p className="font-bold mb-2">Edad</p>
                {["Cachorro", "Joven", "Adulto", "Adulto Mayor"].map((age) => (
                  <label key={age} className="block">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filtros.edad.includes(age)}
                      onChange={() => toggleFiltro("edad", age)}
                    />
                    {age}
                  </label>
                ))}
              </div>
            </aside>

            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols- lg:grid-cols-3 xl:grid-cols-4 gap-x-1 gap-y-6">
              {pets.length === 0 ? (
                <p className="text-center text-gray-600 col-span-full">
                  No hay mascotas registradas por el momento.
                </p>
              ) : (
                pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-orange-300 text-white rounded-xl shadow-md p-3 text-center hover:scale-105 transition-transform duration-300 ease-in-out w-56 mx-auto"
                  >
                    <img
                      src={`http://34.195.195.173:8000/imagenes/${pet.imagen_id}`}
                      alt={pet.nombre}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=Sin+Imagen";
                      }}
                    />
                    <h3 className="font-bold text-xl">{pet.nombre}</h3>
                    <div className="text-lg leading-relaxed text-white space-y-1">
                      <div>
                        Edad: {pet.edad} {pet.edad === 1 ? "año" : "años"}
                      </div>
                      <div>Especie: {pet.especie}</div>
                      <div>Género: {pet.genero || "No especificado"}</div>
                      <div className="italic text-white/90">
                        Albergue: {pet.albergue_nombre}
                      </div>
                    </div>
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
