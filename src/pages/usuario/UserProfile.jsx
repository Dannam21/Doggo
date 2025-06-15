import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">
        Mi Perfil 🐶
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
        <div>
          <p className="text-sm font-semibold text-gray-500">Nombre</p>
          <p className="text-lg">{user.name}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">Correo electrónico</p>
          <p className="text-lg">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4 flex-wrap">
        <button
          disabled
          className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
        >
          Editar perfil (próximamente)
        </button>

        <button
          onClick={() => navigate("/user/messages")}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition font-semibold"
        >
          Ir a mensajes 💬
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
