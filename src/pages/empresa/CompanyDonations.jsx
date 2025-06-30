import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaEdit } from "react-icons/fa";
import SidebarCompany from "../../components/SidebarCompany";

export default function CompanyDonations() {
  const [user, setUser] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [qrSavedUrl, setQrSavedUrl] = useState(null);

  // Siempre leer de localStorage (importante si se refresca la página)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log("✅ User recuperado de localStorage:", parsed);
      setUser(parsed);
    } else {
      console.log("⚠️ No hay user en localStorage");
    }
  }, []);

  const albergueId = user?.albergue_id;
  const token = user?.token;

  useEffect(() => {
    const fetchAlbergueQR = async () => {
      try {
        if (!albergueId) return;
        const res = await fetch(`http://localhost:8000/albergue/${albergueId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.qr_imagen_id) {
            setQrSavedUrl(`http://localhost:8000/imagenes/${data.qr_imagen_id}`);
          }
        } else {
          console.error("Error al obtener QR:", res.status);
        }
      } catch (err) {
        console.error("Error al traer QR existente:", err);
      }
    };

    fetchAlbergueQR();
  }, [albergueId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!qrFile || !albergueId || !token) {
      setError("Selecciona una imagen y asegúrate de estar logueado.");
      return;
    }

    console.log("🚀 Token que enviaré:", token);

    setSubmitting(true);
    setError("");

    try {
      // Subir imagen
      const formData = new FormData();
      formData.append("image", qrFile);

      const res = await fetch("http://localhost:8000/imagenes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al subir QR");
      }

      const data = await res.json();
      const qrImagenId = data.id;

      //  Actualizar albergue con qr_imagen_id
      const updateRes = await fetch(`http://localhost:8000/albergue/${albergueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ qr_imagen_id: qrImagenId }),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        throw new Error(errorData.detail || "Error al actualizar albergue");
      }

      setQrSavedUrl(`http://localhost:8000/imagenes/${qrImagenId}`);
      setPreviewUrl(null);
      setQrFile(null);
      setError("");
    } catch (err) {
      console.error("❌ Error en handleSubmit:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />

      <main className="flex-1 min-h-screen bg-[#FFF1DC] p-4 sm:p-6 sm:ml-64 mt-20 sm:mt-0">
        <h1 className="text-3xl font-bold mb-8 text-[#2e2e2e]">🐾 Donaciones</h1>

        <section className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Sube tu QR de Yape para donaciones</h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col justify-center items-center hover:border-orange-400 cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="QR Preview"
                  className="object-contain h-full rounded"
                />
              ) : (
                <>
                  <FaCloudUploadAlt className="text-4xl text-gray-400" />
                  <p className="text-gray-500 text-sm mt-1">Haz clic para subir imagen del QR</p>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full ${submitting ? "bg-gray-300" : "bg-orange-500 hover:bg-orange-600"} text-white font-semibold py-3 rounded-lg transition`}
            >
              {submitting ? "Guardando..." : "Guardar QR"}
            </button>

            {previewUrl && (
              <button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg flex justify-center items-center gap-2"
                onClick={() => alert("Función de edición aún no implementada")}
              >
                <FaEdit /> Editar QR
              </button>
            )}
          </form>

          {qrSavedUrl && (
            <div className="mt-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">QR guardado:</h3>
              <img
                src={qrSavedUrl}
                alt="QR guardado"
                className="mx-auto h-64 object-contain rounded"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
