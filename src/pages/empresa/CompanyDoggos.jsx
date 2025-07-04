import { FaThumbsUp, FaEdit, FaPlus, FaListUl } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SidebarCompany from "../../components/SidebarCompany";

const CompanyDoggos = () => {
  const navigate = useNavigate();

  return (
    
<div className="flex flex-col md:flex-row min-h-screen bg-[#fdf0df] pt-[72px] md:pt-0">

<div className="w-64">
  <SidebarCompany />
</div>


      <div className="flex-1 bg-[#FFF1DC] p-8">
        <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
          Acciones
        </div>

        <div className="space-y-4 max-w-xl">
        <button
            className="flex items-center gap-2 px-4 py-3 bg-[#f77534] text-white rounded shadow text-left w-full hover:bg-[#f77534]"
            onClick={() => navigate("/company/adddoggo")}
          >
            <FaPlus className="text-white" /> Añadir Doggos
          </button>

          <button
            className="flex items-center gap-2 px-4 py-3 bg-[#f77534] text-white rounded shadow text-left w-full hover:bg-[#f77534]"
            onClick={() => navigate("/company/listdoggo")}
          >
            <FaListUl className="text-white" /> Listado de Doggos
          </button>

          <button
            className="flex items-center gap-2 px-4 py-3 bg-[#f77534] text-white rounded shadow text-left w-full hover:bg-[#f77534]"
            onClick={() => navigate("/company/editdoggos")}
          >
            <FaEdit className="text-white" /> Editar Doggos
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDoggos;