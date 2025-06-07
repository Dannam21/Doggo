import React from "react";
import SidebarCompany from "../../components/SidebarCompany";

export default function CompanyHome() {
  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">¡Bienvenido, Nombre empresa!</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">🐾</div>
            <p className="text-xl font-bold">10</p>
            <p className="text-sm text-gray-600">Doggos publicados</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">🟡</div>
            <p className="text-xl font-bold">3</p>
            <p className="text-sm text-gray-600">En espera de aprobación</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">📩</div>
            <p className="text-xl font-bold">5</p>
            <p className="text-sm text-gray-600">Mensajes no leídos</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">🔄</div>
            <p className="text-xl font-bold">2</p>
            <p className="text-sm text-gray-600">Adopciones logradas</p>
          </div>
        </div>

        
        <h2 className="text-xl font-semibold mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-4 mb-10">
          <button className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition">Añadir doggo</button>
          <button className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition">Ver listado</button>
          <button className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition">Editar perfil</button>
          <button className="bg-[#f77534] text-white px-4 py-2 rounded shadow hover:bg-orange-500 transition">Revisar mensajes</button>
        </div>


        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Últimos registros</h3>
            <div className="flex items-center gap-4 mb-3">
              <img src="https://placedog.net/50" alt="Luna" className="rounded-full w-10 h-10" />
              <div>
                <p className="font-medium">Luna</p>
                <p className="text-sm text-gray-500">Registrado hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <img src="https://placedog.net/51" alt="Max" className="rounded-full w-10 h-10" />
              <div>
                <p className="font-medium">Max</p>
                <p className="text-sm text-gray-500">Registrado hace 1 día</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-300 to-teal-400 opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
