import { FaThumbsUp, FaEdit, FaPlus, FaListUl } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SidebarCompany from "../../components/SidebarCompany";

const CompanyDoggos = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#fdf0df] ml-64">
      <SidebarCompany />

      <div className="flex-1 bg-[#FFF1DC] p-8">
        <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
          Acciones
        </div>

        <div className="space-y-4 max-w-xl">
        <button
            className="flex items-center gap-2 px-4 py-3 bg-[#FCFCFA] text-white rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            onClick={() => navigate("/company/adddoggo")}
          >
            <FaPlus className="text-[#FCFCFA]" /> Añadir Doggos
          </button>

          <button
            className="flex items-center gap-2 px-4 py-3 bg-[#FCFCFA] text-white rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            onClick={() => navigate("/company/listdoggo")}
          >
            <FaListUl className="text-[#FCFCFA]" /> Listado de Doggos
          </button>

          <button
            className="flex items-center gap-2 px-4 py-3 bg-[#FCFCFA] text-white rounded shadow text-left w-full hover:bg-[#f6f6f6]"
            onClick={() => navigate("/company/editdoggos")}
          >
            <FaEdit className="text-[#FCFCFA]" /> Editar Doggos
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDoggos;
