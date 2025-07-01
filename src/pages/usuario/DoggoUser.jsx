import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";

export default function DoggoUser() {
  const navigate = useNavigate();
  const { dogId } = useParams();
  const location = useLocation();
  const fromIndex = location.state?.fromIndex ?? 0;

  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://34.195.195.173:8000/usuario/mascotas/${dogId}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener detalles");
        return res.json();
      })
      .then(setDog)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [dogId]);

  if (loading) return <>
    <Navbar />
    <main className="p-6 bg-orange-50 min-h-screen flex items-center justify-center">
      <p>Cargando…</p>
    </main>
  </>;
  if (error)   return <>
    <Navbar />
    <main className="p-6 bg-orange-50 min-h-screen flex items-center justify-center">
      <p className="text-red-600">{error}</p>
    </main>
  </>;
  if (!dog)    return <>
    <Navbar />
    <main className="p-6 bg-orange-50 min-h-screen flex items-center justify-center">
      <p>Mascota no encontrada</p>
    </main>
  </>;

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
                <span className="font-semibold">Edad:</span> {dog.edad}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Tamaño:</span> {dog.especie}
              </p>
              {dog.descripcion && (
                <p className="text-gray-800 mb-6 leading-relaxed">
                  {dog.descripcion}
                </p>
              )}

              {/* Etiquetas en filas */}
              {dog.etiquetas?.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
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
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  navigate("/dashboard/user", { state: { restoreIndex: fromIndex } })
                }
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Regresar
              </button>
              <button
                onClick={() => navigate("/donations", { state: { restoreIndex: fromIndex } })}
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