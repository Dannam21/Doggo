import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";

export default function MatchUser() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { dog, fromIndex } = state || {};

  if (!dog) {
    // si no tenemos datos, redirige de vuelta
    navigate("/dashboard/user");
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#FFF1DC] min-h-screen flex items-center justify-center p-6">
        <div className="bg-[#ee9c70] rounded-2xl p-6 max-w-sm w-full text-center text-white">
          <h1 className="text-2xl font-bold mb-4">It's a Match!</h1>
          <div className="bg-white rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
            <img
              src={`http://34.195.195.173:8000/imagenes/${dog.imagen_id}`}
              alt={dog.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mb-6">
            Has dado like a <span className="font-semibold">{dog.nombre}</span> y él también te ha dado like.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() =>
                navigate("/dashboard/user", { state: { restoreIndex: fromIndex } })
              }
              className="flex-1 bg-[#4FB286] text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
            >
              Regresar
            </button>
            <button
              onClick={() => {}}
              className="flex-1 bg-[#4FB286] text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
            >
              Continuar
            </button>
          </div>
        </div>
      </main>
    </>
  );
}