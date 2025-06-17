import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import SidebarUser from "../../components/SidebarUser";

const UserProfile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user || !user.token) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        No tienes acceso a esta página. Por favor, inicia sesión.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarUser />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-orange-500 mb-8">Mi Perfil</h1>

          <div className="flex flex-col md:flex-row items-start gap-10 mb-10">
            <div className="flex flex-col items-center w-40">
              <div className="w-40 h-40 mb-4">
                <img
                  src={`http://localhost:8000/imagenes/${user.imagen_perfil_id}`}
                  alt="Foto de perfil"
                  className="w-full h-full rounded-full object-cover border border-gray-300"
                />
              </div>
              <button className="bg-orange-500 text-white text-sm px-4 py-2 rounded hover:bg-orange-600">
                Cambiar foto
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-500">Nombre</p>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Correo electrónico</p>
                <p className="text-lg break-all">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-end">
            <button
              disabled
              className="bg-gray-300 text-gray-600 px-5 py-2 rounded cursor-not-allowed"
            >
              Editar perfil
            </button>

      
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
