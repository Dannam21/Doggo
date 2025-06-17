import { FaThumbsUp, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SidebarCompany from "../../components/SidebarCompany";

const CompanyDoggos = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <SidebarCompany />

      <div className="flex-1 bg-[#FFF1DC] p-8">
        <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
          Acciones
        </div>

        <div className="space-y-4 max-w-xl">
          <button
            className="flex items-center gap-2 px-4 py-3 bg-[#FCFCFA] text-black rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            onClick={() => navigate("/company/adddoggo")}
          >
            <FaThumbsUp className="text-[#2e2e2e]" /> Añadir Doggos
          </button>

          <button
            className="flex items-center gap-2 px-4 py-3 bg-[#FCFCFA] text-black rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            onClick={() => navigate("/company/listdoggo")}
          >
            <FaThumbsUp className="text-[#2e2e2e]" /> Listado de Doggos
          </button>

          <button
            className="flex items-center gap-2 px-4 py-3 bg-[#FCFCFA] text-black rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            onClick={() => navigate("/company/editdoggos")}
          >
            <FaThumbsUp className="text-[#2e2e2e]" /> Editar Doggos
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
