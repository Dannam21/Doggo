import SidebarCompany from "../../components/SidebarCompany";
import { FaPaw, FaClock, FaEnvelopeOpenText, FaHeart } from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const stats = [
  { icon: <FaPaw className="text-orange-500 text-3xl" />, title: "Doggos registrados", value: 50 },
  { icon: <FaClock className="text-yellow-500 text-3xl" />, title: "Pendientes por aprobar", value: 3 },
  { icon: <FaEnvelopeOpenText className="text-blue-500 text-3xl" />, title: "Mensajes recibidos", value: 12 },
  { icon: <FaHeart className="text-pink-500 text-3xl" />, title: "Adopciones logradas", value: 7 },
];

const chartData = [
  { mes: "Ene", adopciones: 2 },
  { mes: "Feb", adopciones: 4 },
  { mes: "Mar", adopciones: 3 },
  { mes: "Abr", adopciones: 5 },
  { mes: "May", adopciones: 7 },
];

export default function CompanyStatistics() {
  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8 text-[#2e2e2e]">📊 Panel de Estadísticas</h1>

        {/* Tarjetas*/}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              {item.icon}
              <p className="text-2xl font-bold mt-2">{item.value}</p>
              <p className="text-sm text-gray-600 text-center">{item.title}</p>
            </div>
          ))}
        </section>

        {/* grafico de barras */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Adopciones por mes</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="adopciones" fill="#f77534" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}
