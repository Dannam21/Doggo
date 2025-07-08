// src/pages/user/UserProfile.jsx
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import SidebarUser from "../../components/SidebarUser";

export default function UserProfile() {
  const { user } = useContext(UserContext);
  const [adoptante, setAdoptante] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.token) return;
    (async () => {
      try {
        const res = await fetch("http://34.195.195.173:8000/adoptante/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setAdoptante(data);
        setForm({
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          telefono: data.telefono || "",
        });
        setImagenUrl(
          data.imagen_perfil_id
            ? `http://34.195.195.173:8000/imagenesProfile/${data.imagen_perfil_id}`
            : null
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `http://34.195.195.173:8000/adoptante/${adoptante.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Error al guardar");
      const updated = await res.json();
      setAdoptante(updated);
      setEditMode(false);
      alert("Perfil actualizado con éxito");
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  if (!user?.token) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        No tienes acceso a esta página. Por favor, inicia sesión.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 font-medium">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdf0df] pt-14 md:pt-0">
      <SidebarUser />
      <div className="flex-1 px-4 py-6 sm:px-6 md:px-8">
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-8 text-center sm:text-left">Mi Perfil</h1>

          <div className="flex flex-col md:flex-row items-start gap-8 sm:gap-10 mb-10">
            <div className="flex flex-col items-center w-full sm:w-40">
              {imagenUrl ? (
                <img
                  src={imagenUrl}
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 mb-4" />
              )}
              <button className="bg-orange-500 text-white text-sm px-4 py-2 rounded hover:bg-orange-600 w-full sm:w-auto">
                Cambiar foto
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-500">Nombres</p>
                {editMode ? (
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                ) : (
                  <p className="text-lg">{adoptante.nombre}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Apellidos</p>
                {editMode ? (
                  <input
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                ) : (
                  <p className="text-lg">{adoptante.apellido}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Correo electrónico</p>
                {editMode ? (
                  <input
                    name="correo"
                    type="email"
                    value={form.correo}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                ) : (
                  <p className="text-lg break-words">{adoptante.correo}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Teléfono</p>
                {editMode ? (
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                ) : (
                  <p className="text-lg">{adoptante.telefono || "—"}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm font-semibold text-gray-500">DNI</p>
                <input
                  type="text"
                  value={adoptante.dni}
                  disabled
                  className="w-full sm:w-60 mt-1 px-3 py-2 bg-gray-100 rounded border border-gray-300 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                  className="bg-gray-300 text-gray-600 px-5 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600 transition"
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
