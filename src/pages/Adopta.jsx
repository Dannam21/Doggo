const Adopta = () => {
    return (
      <nav>
        
        {/* Contenedor relativo para que absolute funcione dentro */}
        <section className="relative w-full px-4 md:px-20 py-12">
            
  
          {/* Círculo decorativo (fondo) */}
          {/* <div className="absolute top-[130px] left-[-100px] w-[400px] h-[400px] bg-[#9cdcd4] rounded-full opacity-40 blur-[100px] z-0"></div>
          <div className="absolute top-[130px] left-[-100px] w-[400px] h-[400px] bg-[#9cdcd4] rounded-full opacity-40 blur-[100px] z-0"></div>

          <div className="absolute top-[600px] left-[1200px] w-[400px] h-[400px] bg-[#9cdcd4] rounded-full opacity-40 blur-[100px] z-0"></div>
          <div className="absolute top-[600px] left-[1200px] w-[400px] h-[400px] bg-[#9cdcd4] rounded-full opacity-40 blur-[100px] z-0"></div>
 */}


          {/* Contenido con z-index alto para estar delante */}
          <div className="relative z-10">
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
          </div>
  
        </section>
      </nav>
    )
  }
  
  export default Adopta;
  