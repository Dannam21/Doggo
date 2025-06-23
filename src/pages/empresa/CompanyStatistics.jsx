import React, { useContext, useEffect, useState } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import { UserContext } from "../../context/UserContext";
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

const COLORS = ["#ff7675", "#74b9ff", "#55efc4", "#ffe066", "#a29bfe"];

const getLast4Weeks = () => {
  const weeks = [];
  const now = new Date();
  for (let i = 3; i >= 0; i--) {
    const wStart = new Date(now);
    wStart.setDate(wStart.getDate() - wStart.getDay() - 7 * i);
    const label = `Sem ${wStart.toLocaleDateString("es-PE", { month: "2-digit" })}/${wStart.getDate()}`;
    weeks.push(label);
  }
  return weeks;
};

export default function CompanyStatistics() {
  const { user } = useContext(UserContext);
  const [matches, setMatches] = useState([]);
  const [adoptions, setAdoptions] = useState([]);

  useEffect(() => {
    if (!user?.token || !user?.albergue_id) return;
    const headers = { Authorization: `Bearer ${user.token}` };
    fetch(`http://localhost:8000/matches/albergue/${user.albergue_id}`, { headers })
      .then(r => (r.ok ? r.json() : []))
      .then(setMatches)
      .catch(() => setMatches([]));
    fetch(`http://localhost:8000/adopciones/albergue/${user.albergue_id}`, { headers })
      .then(r => (r.ok ? r.json() : []))
      .then(setAdoptions)
      .catch(() => setAdoptions([]));
  }, [user]);

  const stats = [
    { title: "❤️ Adopciones Completadas", value: adoptions.length },
    { title: "🤝 Matches Realizados", value: matches.length },
  ];

  const chartData = (() => {
    const weeks = getLast4Weeks();
    const counts = adoptions.reduce((acc, a) => {
      const date = new Date(a.fecha);
      const start = new Date(date);
      start.setDate(start.getDate() - start.getDay());
      const label = `Sem ${start.toLocaleDateString("es-PE", { month: "2-digit" })}/${start.getDate()}`;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
    return weeks.map(w => ({ semana: w, adopciones: counts[w] || 0 }));
  })();

  const pieData = (() => {
    const categories = ["Pequeño", "Mediano", "Grande"];
    const counts = adoptions.reduce((acc, a) => {
      const size = a.mascota.especie;
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {});
    return categories.map(name => ({ name, value: counts[name] || 0 }));
  })();

  const topDoggos = (() => {
    const counts = matches.reduce((acc, m) => {
      const id = m.mascota.id;
      if (!acc[id]) acc[id] = { nombre: m.mascota.nombre, matches: 0 };
      acc[id].matches++;
      return acc;
    }, {});
    return Object.values(counts)
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 5);
  })();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdf0df]">
      <SidebarCompany />
      <main className="flex-1 w-full pt-[60px] md:pt-10 px-4 md:px-10 md:ml-64">
        <h1 className="text-3xl font-bold mb-8 text-[#2e2e2e]">Panel de Estadísticas</h1>

        {/* Estadísticas principales */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {stats.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-gray-600 text-center">{item.title}</p>
            </div>
          ))}
        </section>

        {/* Gráficos */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Adopciones por Semana (últimas 4 semanas)</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
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
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Tabla de doggos top */}
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
