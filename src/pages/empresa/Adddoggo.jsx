import SidebarCompany from "../../components/SidebarCompany";
import AddDoggoForm from "../../components/AddDoggoForm";
import { useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "../../context/UserContext";

export default function DashboardCompany() {
  const [dogs, setDogs] = useState([]);
  const { user } = useContext(UserContext);

  const fetchDogs = useCallback(async () => {
    if (!user.albergueId) return;

    try {
      const response = await fetch(`http://localhost:8000/mascotas/albergue/${user.albergueId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener mascotas");
      }

      const data = await response.json();

      const formattedDogs = data.map((dog) => ({
        id: dog.id,
        name: dog.nombre,
        age: `${dog.edad} años`,
        size: dog.tamano || "Tamaño desconocido",
        image: `http://localhost:8000/imagenes/${dog.imagen_id}`,
      }));

      setDogs(formattedDogs);
    } catch (error) {
      console.error("Error cargando mascotas:", error);
    }
  }, [user.token, user.albergueId]);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  const handleDogAdded = () => {
    fetchDogs(); // Actualiza la lista de perros
    window.location.reload(); // Recarga la página
  };

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />

      <main className="flex-1 px-10 py-10 space-y-10">
        <h1 className="text-3xl font-extrabold text-[#2e2e2e]">🐶 Añadir Doggos</h1>

        {/* Perritos Registrados */}
        <section>
          <h2 className="text-xl font-semibold mb-4">🐾 Perritos Registrados</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dogs.map((dog) => (
              <div key={dog.id} className="bg-white rounded-lg shadow hover:shadow-md transition">
                <img src={dog.image} alt={dog.name} className="w-full h-40 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h4 className="text-lg font-bold">{dog.name}</h4>
                  <p className="text-sm text-gray-600">{dog.age} — {dog.size}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mostrar el token y albergueId */}
        {/* <section>
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            Token y Albergue ID Recibidos
          </h2>
          <div className="bg-white p-4 rounded shadow mb-6">
            <p><strong>Token:</strong> {user.token}</p>
            <p><strong>Albergue ID:</strong> {user.albergueId}</p>
          </div>
        </section> */}

        {/* Formulario para agregar perritos */}
        <section>
          <h2 className="text-xl font-semibold mb-4">➕ Registrar Nuevo Doggo</h2>
          <AddDoggoForm onDogAdded={handleDogAdded} />
        </section>
      </main>
    </div>
  );
}
