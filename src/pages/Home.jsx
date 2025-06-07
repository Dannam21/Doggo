import bannerDoggo from "../assets/banner-doggo.png";

export default function Home() {
  return (
    <main className="w-full bg-orange-50 text-gray-900 font-sans">
      
      {/* Banner principal extendido */}
      <section className="w-full bg-orange-100 py-10 px-4 md:px-20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-4xl font-black leading-tight mb-4">
            Un match que<br />cambia dos vidas<br />para siempre
          </h1>
          <p className="text-gray-700 mb-6">
            Explora mascotas recomendadas especialmente para ti.<br />
            ¡Haz match hoy mismo!<br />
            Solo toma 60 segundos.
          </p>
          <button className="px-6 py-2 bg-orange-400 text-white rounded-full font-bold hover:bg-orange-500 transition">
            Adopta
          </button>
        </div>
        <div className="w-64 md:w-72">
          <img src={bannerDoggo} alt="Hero" className="w-full object-contain" />
        </div>
      </section>

      {/* Contenido principal */}
      <section className="w-full px-4 md:px-20 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">🐾 Adopta</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Filtros */}
          <aside className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <div>
              <p className="font-bold mb-2">Género</p>
              <label className="block"><input type="checkbox" className="mr-2" /> Macho</label>
              <label className="block"><input type="checkbox" className="mr-2" /> Hembra</label>
            </div>
            <div>
              <p className="font-bold mb-2">Edad</p>
              {['Cachorro', 'Joven', 'Adulto', 'Adulto Mayor'].map((age) => (
                <label key={age} className="block">
                  <input type="checkbox" className="mr-2" /> {age}
                </label>
              ))}
            </div>
            <div>
              <p className="font-bold mb-2">Salud</p>
              {['Esterilizado', 'Vacunas completas', 'Desparasitado'].map((item) => (
                <label key={item} className="block">
                  <input type="checkbox" className="mr-2" /> {item}
                </label>
              ))}
            </div>
          </aside>

          {/* Cards de perritos */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Max ♂', size: 'Grande', age: 'Adulto', img: '/dog1.jpg' },
              { name: 'Sushi ♂', size: 'Pequeño', age: 'Adulto', img: '/dog2.jpg' },
              { name: 'Maki ♂', size: 'Mediano', age: 'Adulto', img: '/dog3.jpg' },
              { name: 'Rex ♂', size: 'Grande', age: 'Adulto', img: '/dog1.jpg' },
              { name: 'Galleta ♂', size: 'Pequeño', age: 'Adulto', img: '/dog2.jpg' },
              { name: 'Loko ♂', size: 'Mediano', age: 'Adulto', img: '/dog3.jpg' },
              { name: 'Loko ♂', size: 'Mediano', age: 'Adulto', img: '/dog3.jpg' },
              { name: 'Loko ♂', size: 'Mediano', age: 'Adulto', img: '/dog3.jpg' },
              { name: 'Loko ♂', size: 'Mediano', age: 'Adulto', img: '/dog3.jpg' }
            ].map((dog, i) => (
              <div key={i} className="bg-orange-300 text-white rounded-lg p-4 text-center shadow-md hover:scale-105 transition">
                <img src={dog.img} alt={dog.name} className="w-full h-36 object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-lg">{dog.name}</h3>
                <p className="text-sm">{dog.age}<br />{dog.size}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
