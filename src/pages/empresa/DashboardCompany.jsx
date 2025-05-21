import { useState } from 'react'

const dummyDogs = [
  {
    id: 1,
    name: 'Luna',
    age: '2 años',
    size: 'Mediano',
    image: 'https://placedog.net/400/300?id=1',
  },
  {
    id: 2,
    name: 'Rocky',
    age: '1 año',
    size: 'Grande',
    image: 'https://placedog.net/400/300?id=2',
  },
]

function DashboardCompany() {
  const [dogs, setDogs] = useState(dummyDogs)

  return (
    <main className="p-6 bg-orange-50 min-h-screen flex flex-col items-center">
    <div className="p-6 bg-orange-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">📋 Panel de Empresa</h2>

      <h3 className="text-xl font-semibold mb-2">🐕 Perritos Registrados:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {dogs.map(dog => (
          <div key={dog.id} className="bg-white rounded shadow p-4">
            <img src={dog.image} alt={dog.name} className="w-full h-40 object-cover rounded mb-2" />
            <h4 className="text-lg font-bold">{dog.name}</h4>
            <p>{dog.age} — {dog.size}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-2">➕ Registrar Nuevo Perrito</h3>
      <form className="bg-white p-4 rounded shadow max-w-md space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Edad"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Tamaño"
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          placeholder="URL de la imagen"
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Registrar
        </button>
      </form>
    </div>
    </main>
  )
}

export default DashboardCompany
