import SidebarCompany from "../../components/SidebarCompany";
import AddDoggoForm from "../../components/AddDoggoForm";
import { useState } from "react";

const dummyDogs = [
  {
    id: 1,
    name: "Luna",
    age: "2 años",
    size: "Mediano",
    image: "https://placedog.net/400/300?id=1",
  },
  {
    id: 2,
    name: "Rocky",
    age: "1 año",
    size: "Grande",
    image: "https://placedog.net/400/300?id=2",
  },
];

export default function DashboardCompany() {
  const [dogs] = useState(dummyDogs);

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

        {/* Formulario */}
        <section>
          <h2 className="text-xl font-semibold mb-4">➕ Registrar Nuevo Doggo</h2>
          <AddDoggoForm />
        </section>
      </main>
    </div>
  );
}
