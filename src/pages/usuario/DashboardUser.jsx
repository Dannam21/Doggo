import { useState } from 'react'
import Navbar from "../../layout/Navbar";

const dogMatches = [
  {
    id: 1,
    name: 'Max',
    age: '3 años',
    size: 'Pequeño',
    image: 'https://placedog.net/400/300?id=3',
    personality: 'Tranquilo y cariñoso',
  },
  {
    id: 2,
    name: 'Canela',
    age: '4 años',
    size: 'Mediano',
    image: 'https://placedog.net/400/300?id=4',
    personality: 'Juguetona y sociable',
  },
]

function DashboardUser() {
  const [index, setIndex] = useState(0)

  const handleLike = () => {
    alert(`¡Has dado like a ${dogMatches[index].name}!`)
    setIndex(prev => (prev + 1) % dogMatches.length)
  }

  const handleNope = () => {
    setIndex(prev => (prev + 1) % dogMatches.length)
  }

  const dog = dogMatches[index]

  return (
    <main>
    <Navbar />
    <div className="p-6 bg-orange-50 min-h-screen flex flex-col items-center">
        
      <h2 className="text-3xl font-bold mb-4">🐾 Panel del Adoptante</h2>

      <div className="bg-white p-6 rounded shadow max-w-sm w-full text-center">
        <img src={dog.image} alt={dog.name} className="w-full h-60 object-cover rounded mb-4" />
        <h3 className="text-xl font-bold">{dog.name}</h3>
        <p className="text-gray-600">{dog.age} — {dog.size}</p>
        <p className="mt-2 text-sm italic">{dog.personality}</p>

        <div className="flex justify-around mt-4">
          <button onClick={handleNope} className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500">
            No
          </button>
          <button onClick={handleLike} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Adopta
          </button>
        </div>
      </div>
    </div>
    </main>
  )
}

export default DashboardUser
