import SidebarCompany from "../../components/SidebarCompany";
import { FaHeart, FaHandshake, FaUsers, FaClock } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
  { fecha: "Apr 1", adopciones: 13 },
  { fecha: "Apr 5", adopciones: 19 },
  { fecha: "Apr 11", adopciones: 35 },
  { fecha: "Apr 18", adopciones: 18 },
  { fecha: "Apr 21", adopciones: 26 },
];

const pieData = [
  { name: "Pequeño", value: 45 },
  { name: "Mediano", value: 34 },
  { name: "Grande", value: 21 },
];

const topDoggos = [
  { nombre: "Rex", matches: 42 },
  { nombre: "Bella", matches: 39 },
  { nombre: "Daisy", matches: 35 },
  { nombre: "Max", matches: 29 },
  { nombre: "Milo", matches: 27 },
];

const COLORS = ["#ff7675", "#74b9ff", "#55efc4"];

export default function CompanyStatistics() {
  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />

      <main className="flex-1 p-10 ml-64">
        <h1 className="text-3xl font-bold mb-8 text-[#2e2e2e]">Panel de Estadísticas</h1>

        {/* KPIs */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
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
            <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Adopciones por Día</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="adopciones" stroke="#f67280" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">🐶 Adopciones por Tamaño</h2>
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

        {/* Tabla de top doggos */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Top 5 Doggos por Matches</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Nombre</th>
                <th className="py-2">Matches</th>
              </tr>
            </thead>
            <tbody>
              {topDoggos.map((dog, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-100">
                  <td className="py-2 font-medium">{dog.nombre}</td>
                  <td className="py-2">{dog.matches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
