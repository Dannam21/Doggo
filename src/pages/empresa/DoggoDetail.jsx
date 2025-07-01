import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";

export default function DoggoDetail() {
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener detalles");
        return res.json();
      })
      .then(setDog)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dogId]);

  if (loading || error || !dog) {
    return (
      <>
        <Navbar />
        <main className="p-6 bg-orange-50 min-h-screen flex items-center justify-center">
          <p className={error ? "text-red-600" : ""}>
            {error || "Cargando..."}
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-orange-50 min-h-screen pt-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row gap-6 p-4 md:p-6">
          {/* Imagen */}
          <div className="w-full md:w-1/2 aspect-video md:aspect-auto">
            <img
              src={`http://34.195.195.173:8000/imagenes/${dog.imagen_id}`}
              alt={dog.nombre}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{dog.nombre}</h2>
              <p className="text-gray-700 mb-1">
              <span className="font-semibold">Edad:</span> {dog.edad_valor} {dog.edad_unidad}

              </p>
              <p className="text-gray-700 mb-3">
                <span className="font-semibold">Tamaño:</span> {dog.especie}
              </p>
              {dog.descripcion && (
                <p className="text-gray-800 mb-4">{dog.descripcion}</p>
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
                onClick={() => navigate("/", { state: { restoreIndex: fromIndex } })}
                className="w-full sm:w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
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
