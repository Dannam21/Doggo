// src/pages/empresa/CompanyStatistics.jsxMore actions
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
    const label = `Sem ${wStart.toLocaleDateString("es-PE", {
      month: "2-digit",
    })}/${wStart.getDate()}`;
    weeks.push(label);
  }
  return weeks;
};

export default function CompanyStatistics() {
  const { user } = useContext(UserContext);
  const [matchTotals, setMatchTotals] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [mascotaMap, setMascotaMap] = useState({});

  useEffect(() => {
    if (!user?.token || !user?.albergue_id) return;
    const headers = { Authorization: `Bearer ${user.token}` };

    // 1) fetch de match_totales
    fetch(`http://localhost:8000/match_totales/albergue/${user.albergue_id}`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then(async (data) => {
        const arr = Array.isArray(data) ? data : [];
        setMatchTotals(arr);

        // ids únicos de mascota de match_totales
        const matchIds = [...new Set(arr.map((m) => m.mascota_id))].filter(Boolean);
        // además ids únicos de adopciones (vendrán después)
        // los combinamos con los de adopciones
        const adoptionIds = adoptions.map((a) => a.mascota.id);
        const allIds = [...new Set([...matchIds, ...adoptionIds])];
        const map = {};
        await Promise.all(
          allIds.map(async (id) => {
            const resp = await fetch(`http://localhost:8000/usuario/mascotas/${id}`, { headers });
            if (!resp.ok) return;
            map[id] = await resp.json();
          })
        );
        setMascotaMap(map);
      })
      .catch(() => {
        setMatchTotals([]);
      });

    // 2) fetch de adopciones
    fetch(`http://localhost:8000/adopciones/albergue/${user.albergue_id}`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then(async (data) => {
        setAdoptions(data);

        // ids únicos de mascota de adopciones
        const adoptionIds = [...new Set(data.map((a) => a.mascota.id))].filter(Boolean);
        // ids de match_totales ya en state
        const matchIds = matchTotals.map((m) => m.mascota_id);
        const allIds = [...new Set([...matchIds, ...adoptionIds])];
        const map = { ...mascotaMap };
        await Promise.all(
          adoptionIds.map(async (id) => {
            if (map[id]) return;
            const resp = await fetch(`http://localhost:8000/usuario/mascotas/${id}`, { headers });
            if (!resp.ok) return;
            map[id] = await resp.json();
          })
        );
        setMascotaMap(map);
      })
      .catch(() => {
        setAdoptions([]);
      });
  }, [user]);

  const stats = [
    { title: "❤️ Adopciones Completadas", value: adoptions.length },
    { title: "🤝 Matches Totales Realizados", value: matchTotals.length },
  ];

  // Línea: adopciones por semana
  const adoptionChartData = (() => {
    const weeks = getLast4Weeks();
    const counts = adoptions.reduce((acc, a) => {
      const d = new Date(a.fecha);
      const start = new Date(d);
      start.setDate(start.getDate() - start.getDay());
      const label = `Sem ${start.toLocaleDateString("es-PE", {
        month: "2-digit",
      })}/${start.getDate()}`;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
    return weeks.map((w) => ({ semana: w, adopciones: counts[w] || 0 }));
  })();

  // Pie: adopciones por ESPECIE
  const adoptionPieData = (() => {

    const counts = adoptions.reduce((acc, a) => {
      const especie = mascotaMap[a.mascota.id]?.especie ?? "Desconocido";
      acc[especie] = (acc[especie] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  })();

  // Línea: matches totales por semana
  const matchTotalsByWeek = (() => {
    const weeks = getLast4Weeks();
    const counts = matchTotals.reduce((acc, m) => {
      const d = new Date(m.fecha);
      const start = new Date(d);
      start.setDate(start.getDate() - start.getDay());
      const label = `Sem ${start.toLocaleDateString("es-PE", {
        month: "2-digit",
      })}/${start.getDate()}`;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
    return weeks.map((semana) => ({ semana, matches: counts[semana] || 0 }));
  })();

  // Pie: matches totales por ESPECIE
  const matchTotalsPieData = (() => {
    const counts = matchTotals.reduce((acc, m) => {
      const especie = mascotaMap[m.mascota_id]?.especie ?? "Desconocido";
      acc[especie] = (acc[especie] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  })();

  // Top 5 Doggos por matches
  const topDoggos = (() => {
    const counts = matchTotals.reduce((acc, m) => {
      const mascota = mascotaMap[m.mascota_id];
      if (!mascota) return acc;
      const { id, nombre } = mascota;
      if (!acc[id]) acc[id] = { nombre, matches: 0 };
      acc[id].matches++;
      return acc;
    }, {});
    return Object.values(counts)
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 5);
  })();

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />
      <main className="flex-1 min-h-screen bg-[#FFF1DC] p-4 sm:p-6 sm:ml-64 mt-20 sm:mt-0">
        <h1 className="text-3xl font-bold mb-8 text-[#2e2e2e]">Panel de Estadísticas</h1>
        {/* KPIs */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-gray-600 text-center">{item.title}</p>
            </div>
          ))}
        </section>
        {/* Adopciones */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          {/* LineChart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              📈 Adopciones por Semana (últimas 4 semanas)
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adoptionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="adopciones" stroke="#f67280" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* PieChart ESPECIE */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">🐶 Adopciones por Especie</h2>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={adoptionPieData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {adoptionPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
        {/* Matches Totales */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          {/* LineChart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Matches Totales por Semana</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={matchTotalsByWeek}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="matches" stroke="#74b9ff" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* PieChart ESPECIE */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">🐾 Matches Totales por Especie</h2>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={matchTotalsPieData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {matchTotalsPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
        {/* Top 5 Doggos */}
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