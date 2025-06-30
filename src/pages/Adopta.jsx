import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Adopta = () => {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    // Configurar headers básicos
    const headers = {
      "Content-Type": "application/json",
    };
  
    // Si existe token, agregar Authorization
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  
    fetch("http://localhost:8000/mascotas", {
      headers,
    })
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
        setPets([]);
      });
  }, []);


  const [filtros, setFiltros] = useState({
    genero: [],
    edad: [],
    especie: [],
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

  const limpiarFiltros = () => {
    setFiltros({ genero: [], edad: [], especie: [] });
  };

  const obtenerGrupoEdad = (valor, unidad) => {
    let edadEnAnios = 0;
    if (unidad === "meses") {
      edadEnAnios = valor / 12;
    } else {
      edadEnAnios = valor;
    }

    if (edadEnAnios < 1) return "Cachorro";
    if (edadEnAnios >= 1 && edadEnAnios < 3) return "Joven";
    if (edadEnAnios >= 3 && edadEnAnios < 7) return "Adulto";
    return "Adulto Mayor";
  };

  const mascotasFiltradas = pets.filter((pet) => {
    const { genero, edad, especie } = filtros;

    const coincideGenero = genero.length === 0 || genero.includes(pet.genero);
    const grupoEdad = obtenerGrupoEdad(pet.edad_valor, pet.edad_unidad);
    const coincideEdad = edad.length === 0 || edad.includes(grupoEdad);

    const coincideEspecie =
      especie.length === 0 || especie.includes(pet.especie);

    return coincideGenero && coincideEdad && coincideEspecie;
  });

  return (
    <nav>
      <section className="relative w-full px-4 md:px-20 py-12">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-center mb-8">🐾 Adopta</h2>

          {/* Contenedor principal responsive con flex en md */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filtros */}
            <aside className="bg-white rounded-lg p-6 shadow-sm space-y-6 md:w-1/4">
              <div>
                <p className="font-bold mb-2">Género</p>
                {["Macho", "Hembra"].map((genero) => (
                  <label key={genero} className="block">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filtros.genero.includes(genero)}
                      onChange={() => toggleFiltro("genero", genero)}
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

              <div>
                <p className="font-bold mb-2">Especie</p>
                {["Pequeño", "Grande", "Mediano"].map((especie) => (
                  <label key={especie} className="block">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filtros.especie.includes(especie)}
                      onChange={() => toggleFiltro("especie", especie)}
                    />
                    {especie}
                  </label>
                ))}
              </div>
            </aside>

            {/* Tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:w-3/4">
              {mascotasFiltradas.length === 0 ? (
                <p className="text-center text-gray-600 col-span-full">
                  No hay mascotas que coincidan con los filtros seleccionados.
                </p>
              ) : (
                mascotasFiltradas.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-orange-300 text-white rounded-xl shadow-md p-6 text-center hover:scale-105 transition-transform duration-300 ease-in-out w-full"
                  >
                    <img
                      src={`http://localhost:8000/imagenes/${pet.imagen_id}`}
                      alt={pet.nombre}
                      className="max-h-40 w-full object-contain mb-2"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=Sin+Imagen";
                      }}
                    />
                    <h3 className="font-bold text-xl">{pet.nombre}</h3>
                    <div className="text-white space-y-1 text-sm mt-1">
                      <div>
                        Edad: {pet.edad_valor} {pet.edad_unidad}
                      </div>
                      <div>Tamaño: {pet.especie}</div>
                      <div>Género: {pet.genero || "No especificado"}</div>
                    </div>
                    <button
                      onClick={() => navigate(`/detail/${pet.id}`)}
                      className="mt-3 text-sm bg-white text-white hover:bg-orange-100 font-semibold py-1 px-4 rounded transition"
                    >
                      Más info
                    </button>
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
