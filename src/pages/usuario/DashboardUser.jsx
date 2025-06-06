import { useState, useEffect } from "react";
import Navbar from "../../layout/Navbar";

function DashboardUser() {
  const [mascotasOrdenadas, setMascotasOrdenadas] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adoptanteId, setAdoptanteId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/adoptante/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener perfil de adoptante");
        return res.json();
      })
      .then((perfil) => {
        setAdoptanteId(perfil.id);
        console.log("Perfil de adoptante:", perfil);
        return fetch(`http://localhost:8000/recomendaciones/${perfil.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener recomendaciones");
        return res.json();
      })
      .then((data) => {
        setMascotasOrdenadas(data);
      })
      .catch((err) => {
        console.error("Algún fetch falló:", err);
        setMascotasOrdenadas([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="p-6 bg-orange-50 min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Obteniendo datos del adoptante y recomendaciones...</h2>
        </div>
      </main>
    );
  }

  if (!adoptanteId) {
    return (
      <main>
        <Navbar />
        <div className="p-6 bg-orange-50 min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Debes iniciar sesión como adoptante</h2>
        </div>
      </main>
    );
  }

  if (mascotasOrdenadas.length === 0) {
    return (
      <main>
        <Navbar />
        <div className="p-6 bg-orange-50 min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">No hay mascotas para recomendar</h2>
        </div>
      </main>
    );
  }

  const dog = mascotasOrdenadas[index];
  if (!dog) {
    return (
      <main>
        <Navbar />
        <div className="p-6 bg-orange-50 min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">No hay más mascotas para mostrar</h2>
        </div>
      </main>
    );
  }

  const handleLike = () => {
    alert(`¡Has dado like a ${dog.nombre}! (similitud: ${(dog.similitud * 100).toFixed(0)}%)`);
    setIndex((prev) => Math.min(prev + 1, mascotasOrdenadas.length));
  };

  const handleNope = () => {
    setIndex((prev) => Math.min(prev + 1, mascotasOrdenadas.length));
  };

  return (
    <main>
      <Navbar />
      <div className="p-6 bg-orange-50 min-h-screen flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">🐾 Panel del Adoptante</h2>

        <div className="bg-white p-6 rounded shadow max-w-sm w-full text-center">
          <img
            src={`http://localhost:8000/imagenes/${dog.imagen_id}`}
            alt={dog.nombre}
            className="w-full h-60 object-cover rounded mb-4"
          />
          <h3 className="text-xl font-bold">{dog.nombre}</h3>
          <p className="text-gray-600">{dog.edad} — {dog.especie}</p>
          <p className="mt-2 text-sm italic">{dog.descripcion || "Sin descripción"}</p>
          <p className="mt-1 text-sm text-gray-500">
            Similitud: {(dog.similitud * 100).toFixed(0)}%
          </p>

          <div className="flex justify-around mt-4">
            <button
              onClick={handleNope}
              className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
            >
              No
            </button>
            <button
              onClick={handleLike}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Adoptar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardUser;
