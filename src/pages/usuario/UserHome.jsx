// UserHome.jsx - Vista principal del adoptante
import React, { useContext } from "react";
import SidebarUser from "../../components/SidebarUser";
import { UserContext } from "../../context/UserContext";

export default function UserHome() {
  const { user } = useContext(UserContext);

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarUser />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">
          ¡Bienvenid@, {user?.name || "Adoptante"}!
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">🐶</div>
            <p className="text-xl font-bold">5</p>
            <p className="text-sm text-gray-600">Doggos adoptados</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">🔄</div>
            <p className="text-xl font-bold">2</p>
            <p className="text-sm text-gray-600">Adopciones en proceso</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl mb-2">📩</div>
            <p className="text-xl font-bold">1</p>
            <p className="text-sm text-gray-600">Mensajes no leídos</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Últimos registros</h3>
            <p className="text-sm text-gray-500">No hay registros aún.</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Calendario</h3>
            <p className="text-sm text-gray-500">Aquí verás tus próximas citas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
