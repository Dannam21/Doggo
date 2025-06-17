import SidebarCompany from "../../components/SidebarCompany";
import { FaHeart, FaHandshake, FaUsers, FaDog } from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const stats = [
  { icon: <FaHeart className="text-pink-500 text-3xl" />, title: "Adopciones Completadas", value: 280 },
  { icon: <FaHandshake className="text-yellow-500 text-3xl" />, title: "Matches Realizados", value: 1050 },
];

const chartData = [
  { fecha: "Abr 1", adopciones: 18 },
  { fecha: "Abr 5", adopciones: 22 },
  { fecha: "Abr 11", adopciones: 37 },
  { fecha: "Abr 18", adopciones: 29 },
  { fecha: "Abr 21", adopciones: 25 },
];

const pieData = [
  { name: "Pequeño", value: 45 },
  { name: "Mediano", value: 34 },
  { name: "Grande", value: 21 },
];

const COLORS = ["#ff7675", "#74b9ff", "#55efc4"];

export default function CompanyStatistics() {
  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />

      <main className="flex-1 p-10 ml-64">
        <h1 className="text-3xl font-bold mb-8 text-[#2e2e2e]">Panel de Estadísticas</h1>

        {/* Tarjetas */}
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

        {/* Gráficas */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Adopciones por mes</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="adopciones" fill="#f67280" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">🐾 Adopciones por Tamaño</h2>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
