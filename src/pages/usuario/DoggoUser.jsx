import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import axios from "axios";

export default function DoggoUser() {
  const navigate = useNavigate();
  const { dogId } = useParams();
  const location = useLocation();
  const fromIndex = location.state?.fromIndex ?? 0;

  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationAmount, setDonationAmount] = useState(500); // Monto por defecto
  const [isProcessingDonation, setIsProcessingDonation] = useState(false);

  // Cargar el SDK de MercadoPago
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remover el script cuando el componente se desmonte
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/usuario/mascotas/${dogId}`, {
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

  // Función para procesar la donación
  const handleDonation = async () => {
    const token = localStorage.getItem("token"); // ✅ Declarar token aquí
    setIsProcessingDonation(true);
    try {
      const response = await axios.post("http://localhost:8000/crear-donacion", {
        amount: donationAmount,
        dogId: dog.id,
        dogName: dog.nombre,
        description: "Donación para " + dog.nombre,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Redirigir al usuario a la página de pago
      window.location.href = response.data.initPoint;
  
    } catch (error) {
      console.error("Error al procesar donación:", error);
      alert("Ocurrió un error al procesar la donación.");
    } finally {
      setIsProcessingDonation(false);
    }
  };
  
  

  // Montos predefinidos
  const predefinedAmounts = [500, 1000, 2000, 5000];

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
              src={`http://localhost:8000/imagenes/${dog.imagen_id}`}
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

              {/* Sección de donación */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border">
                <h3 className="font-semibold text-lg mb-3">💝 Ayuda a {dog.nombre}</h3>
                
                {/* Montos predefinidos */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Selecciona un monto:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {predefinedAmounts.map(amount => (
                      <button
                        key={amount}
                        onClick={() => setDonationAmount(amount)}
                        className={`p-2 rounded border text-sm font-medium transition ${
                          donationAmount === amount 
                            ? 'bg-yellow-500 text-white border-yellow-500' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-yellow-400'
                        }`}
                      >
                        S/ {amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monto personalizado */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">O ingresa tu monto:</label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l text-sm">S/</span>
                    <input
                      type="number"
                      min="100"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border rounded-r focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Monto mínimo: S/ 100</p>
                </div>
              </div>
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
                onClick={handleDonation}
                disabled={isProcessingDonation || !donationAmount || donationAmount < 100}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
              >
                {isProcessingDonation ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  `Donar S/ ${donationAmount}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}