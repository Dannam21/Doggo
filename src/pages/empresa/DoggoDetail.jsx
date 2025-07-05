// src/pages/usuario/DoggoDetail.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";

export default function DoggoDetail() {
  const navigate   = useNavigate();
  const { dogId }  = useParams();
  const location   = useLocation();
  const fromIndex  = location.state?.fromIndex ?? 0;

  const [dog, setDog]       = useState(null);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState("");

  /* ───────── FETCH (público o con token) ───────── */
  useEffect(() => {
  const fetchDog = async () => {
    try {
      const token   = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      // 1) intenta primero la ruta pública
      let res = await fetch(
        `http://34.195.195.173:8000/mascotas/${dogId}/`, // ← nota la barra final
        { headers }
      );

      // 2) Si la pública responde 401, reintenta la privada
      if (res.status === 401) {
        res = await fetch(
          `http://34.195.195.173:8000/usuario/mascotas/${dogId}/`,
          { headers }
        );
      }

      if (!res.ok) throw new Error("Mascota no encontrada");

      const data = await res.json();
      setDog(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoad(false);
    }
  };

  fetchDog();
}, [dogId]);

  /* ───────── MENSAJES DE CARGA / ERROR ───────── */
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="p-6 bg-orange-50 min-h-screen flex items-center justify-center">
          <p>Cargando…</p>
        </main>
      </>
    );
  }
  if (error || !dog) {
    return (
      <>
        <Navbar />
        <main className="p-6 bg-orange-50 min-h-screen flex items-center justify-center">
          <p className="text-red-600">{error || "Mascota no encontrada"}</p>
        </main>
      </>
    );
  }

  /* ───────── UI ───────── */
  return (
    <>
      <Navbar />
      <div className="bg-orange-50 min-h-screen pt-8">
        <div className="container mx-auto p-6 flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Imagen */}
          <div className="md:w-1/2 w-full h-64 md:h-auto">
            <img
              src={`http://34.195.195.173:8000/imagenes/${dog.imagen_id}`}
              alt={dog.nombre}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Info */}
          <div className="md:w-1/2 w-full p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-4">{dog.nombre}</h2>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Edad:</span> {dog.edad_valor} {dog.edad_unidad}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Tamaño:</span> {dog.especie}
              </p>
              {dog.descripcion && (
                <p className="text-gray-800 mb-6 leading-relaxed">{dog.descripcion}</p>
              )}

              {/* Etiquetas */}
              {dog.etiquetas?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {dog.etiquetas.map((tag) => (
                    <span
                      key={tag}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() =>
                  navigate(`/doggoMatch/${dog.id}`, {
                    state: { dog, fromIndex, origin: location.pathname },
                  })
                }
                className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Adoptar
              </button>

              <button
                onClick={() =>
                  navigate("/donations", {
                    state: { restoreIndex: fromIndex, albergueId: dog.albergue_id },
                  })
                }
                className="w-full sm:w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Donar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
