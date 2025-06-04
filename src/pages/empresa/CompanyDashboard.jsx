import { FaHome, FaThumbsUp } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/SidebarCompany";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";  // Asegúrate de que el path sea correcto

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);  // Obtener el usuario del contexto

  useEffect(() => {
    // Imprimir en la consola cuando los valores se estén pasando correctamente
    console.log("Token recibido:", user.token);
    console.log("Albergue ID recibido:", user.albergueId);
  }, [user.token, user.albergueId]);  // Ejecutar cada vez que el token o albergueId cambien

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#FFF1DC]">
      <Sidebar />

      <div className="flex-1 p-10">
        <div className="bg-white rounded-md shadow-md p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-xl font-semibold text-[#2e2e2e]">
            <FaHome />
            ¡Bienvenido!
          </div>

          {/* Mostrar el mensaje de confirmación en la UI */}
          <p className="text-green-600 font-bold mb-4">
            Token y Albergue ID están siendo pasados correctamente:
          </p>
          <div className="bg-white p-4 rounded shadow mb-6">
            <p><strong>Token:</strong> {user.token}</p>
            <p><strong>Albergue ID:</strong> {user.albergueId}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/empresa/add-doggo")}
              className="flex items-center gap-2 px-4 py-3 bg-[#FCFCFA] text-black rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            >
              Añadir Doggos
            </button>

            <button
              onClick={() => navigate("/empresa/list-doggos")}
              className="px-4 py-3 bg-[#FCFCFA] text-black rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            >
              Listado de Doggos
            </button>

            <button
              onClick={() => navigate("/empresa/edit-doggos")}
              className="px-4 py-3 bg-[#FCFCFA] text-black rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            >
              Editar Doggos
            </button>

            <button
              onClick={() => navigate("/empresa/historial-doggos")}
              className="px-4 py-3 bg-[#FCFCFA] text-black rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            >
              Ver historial de doggo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
