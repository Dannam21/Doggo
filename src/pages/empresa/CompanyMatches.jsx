import { useState, useEffect, useContext } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import { UserContext } from "../../context/UserContext";
import { FaCalendarAlt, FaHeart } from "react-icons/fa";

export default function CompanyMatches() {
  const { user } = useContext(UserContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const token = localStorage.getItem("user")?.token;
        const res = await fetch(
          `http://34.195.195.173:8000/matches/albergue/${user.albergue_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch matches");
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, [user.albergue_id]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

const handleAdopt = async (m) => {
  if (!confirm(`¿Confirmas completar la adopción de ${m.mascota.nombre}?`)) return;

  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    if (!token) throw new Error("Token no encontrado");

    const res = await fetch(
      `http://34.195.195.173:8000/matches/${m.adoptante.id}/${m.mascota.id}/complete`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error("Error completando match");

    const patchRes = await fetch(
      `http://34.195.195.173:8000/mascotas/${m.mascota.id}/adoptar`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!patchRes.ok) {
      const err = await patchRes.json();
      throw new Error(err.detail || "Error al marcar como adoptado");
    }

    alert("Adopción completada");
    setMatches(matches.filter(
      x => !(x.adoptante.id === m.adoptante.id && x.mascota.id === m.mascota.id)
    ));
  } catch (err) {
    console.error(err);
    alert("Error al completar adopción");
  }
};



  const handleDeny = async (m) => {
    if (!confirm(`¿Confirmas denegar la adopción de ${m.mascota.nombre}?`)) return;
    try {
      const token = localStorage.getItem("user")?.token;
      const res = await fetch(
        `http://34.195.195.173:8000/matches/${m.adoptante.id}/${m.mascota.id}/deny`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      alert("Denegación registrada");
      setMatches(matches.filter(x => !(x.adoptante.id === m.adoptante.id && x.mascota.id === m.mascota.id)));
    } catch {
      alert("Error al registrar denegación");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="sm:fixed sm:top-0 sm:left-0 sm:h-full sm:w-64 z-10">
        <SidebarCompany />
      </div>
      
      <main className="flex-1 min-h-screen bg-[#FFF1DC] p-4 sm:p-6 sm:ml-64 mt-20 sm:mt-0">
        <h1 className="text-3xl font-bold mb-6">🧡 Matches</h1>
        {loading ? (
          <p className="text-lg text-gray-600">Cargando matches…</p>
        ) : matches.length === 0 ? (
          <p className="text-lg text-gray-600">No hay matches aún.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((m) => (
              <div
                key={`${m.adoptante.id}-${m.mascota.id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col items-center p-4"
              >
                <div className="flex flex-col xs:flex-row sm:flex-row items-center justify-center gap-4 mb-4">
                  <img
                    src={`http://34.195.195.173:8000/imagenesProfile/${m.adoptante.imagen_perfil_id}`}
                    alt={m.adoptante.nombre}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <FaHeart className="text-red-500 text-3xl" />
                  <img
                    src={`http://34.195.195.173:8000/imagenes/${m.mascota.imagen_id}`}
                    alt={m.mascota.nombre}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
                <p className="font-semibold text-lg mb-2">
                  {m.adoptante.nombre} &amp; {m.mascota.nombre}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button
                    onClick={() => handleAdopt(m)}
                    className="w-full sm:flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                  >
                    Adoptar
                  </button>
                  <button
                    onClick={() => handleDeny(m)}
                    className="w-full sm:flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                  >
                    Denegar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
