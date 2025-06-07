import { FaCloudUploadAlt } from "react-icons/fa";

export default function AddDoggoForm() {
  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      {/* Área de carga */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col justify-center items-center hover:border-orange-400 cursor-pointer mb-6">
        <FaCloudUploadAlt className="text-4xl text-gray-400" />
        <p className="text-gray-500 text-sm mt-1">Sube una imagen del doggo</p>
      </div>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input
            type="text"
            placeholder="Ej. Luna"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Edad</label>
          <input
            type="text"
            placeholder="Ej. 2 años"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Tamaño</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300">
            <option>Selecciona un tamaño</option>
            <option>Pequeño</option>
            <option>Mediano</option>
            <option>Grande</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Descripción</label>
          <textarea
            placeholder="Describe a tu doggo"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none h-24"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#f77534] hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition"
        >
          Registrar Doggo
        </button>
      </form>
    </section>
  );
}
