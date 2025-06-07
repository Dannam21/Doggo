import { FaThumbsUp, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SidebarCompany from "../../components/SidebarCompany";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";  // Asegúrate de que el path sea correcto

const CompanyDoggos = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);  // Obtener el usuario del contexto

  useEffect(() => {
    // Imprimir en la consola cuando los valores se estén pasando correctamente
    console.log("Token recibido:", user.token);
    console.log("Albergue ID recibido:", user.albergueId);
  }, [user.token, user.albergueId]);  // Ejecutar cada vez que el token o albergueId cambien

  return (
    <div className="flex h-screen">
      <SidebarCompany />

      <div className="flex-1 bg-[#FFF1DC] p-8">
        <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
          <FaHome />
          ¡Bienvenido!
        </div>

        {/* Mostrar el mensaje de confirmación en la UI */}
        {/* <p className="text-green-600 font-bold mb-4">
          Token y Albergue ID están siendo pasados correctamente:
        </p>
        <div className="bg-white p-4 rounded shadow mb-6">
          <p><strong>Token:</strong> {user.token}</p>
          <p><strong>Albergue ID:</strong> {user.albergueId}</p>
        </div> */}

        <div className="space-y-4 max-w-xl">
          <button
            className="flex items-center gap-2 px-4 py-3 bg-[#FCFCFA] text-black rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            onClick={() => navigate("/company/adddoggo")}
          >
            <FaThumbsUp className="text-[#2e2e2e]" /> Añadir Doggos
          </button>

          <button className="px-4 py-3 bg-[#FCFCFA] text-black rounded shadow text-left w-full hover:bg-[#f6f6f6]">
            Listado de Doggos
          </button>

          <button className="px-4 py-3 bg-[#FCFCFA] text-black rounded shadow text-left w-full hover:bg-[#f6f6f6]">
            Ver historial de doggo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDoggos;
