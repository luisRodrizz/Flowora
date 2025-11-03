// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTasks } from "../services/api";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import Navbar from "../components/Navbar";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Stats() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, []);

  if (!tasks.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-700">
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center h-[80vh]"
        >
          <h2 className="text-xl font-semibold text-gray-600">
            Cargando estadísticas...
          </h2>
          <p className="text-gray-400 mt-2">
            No hay tareas registradas todavía.
          </p>
        </motion.div>
      </div>
    );
  }

  // ─────────────── Datos base
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const now = new Date();
  const overdue = tasks.filter(
    (t) => !t.completed && t.due_date && new Date(t.due_date) < now
  ).length;
  const pending = total - completed - overdue;

  // 📊 Datos de gráficos
  const statusData = {
    labels: ["Completadas", "Pendientes", "Vencidas"],
    datasets: [
      {
        data: [completed, pending, overdue],
        backgroundColor: ["#22c55e", "#3b82f6", "#ef4444"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const detailedStatusData = {
    labels: ["Completadas", "Pendientes", "Vencidas"],
    datasets: [
      {
        label: "Tareas por estado",
        data: [completed, pending, overdue],
        backgroundColor: ["#22c55e", "#3b82f6", "#ef4444"],
        borderRadius: 6,
      },
    ],
  };

  const categories = {};
  tasks.forEach((t) => {
    const cat = t.category || "Sin categoría";
    categories[cat] = (categories[cat] || 0) + 1;
  });
  const categoryData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Tareas por categoría",
        data: Object.values(categories),
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#facc15",
          "#ec4899",
          "#a855f7",
          "#94a3b8",
        ],
        borderRadius: 6,
      },
    ],
  };

  const today = new Date();
  const groupedByDays = Array(7).fill(0);
  tasks.forEach((t) => {
    if (!t.due_date) return;
    const due = new Date(t.due_date);
    const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) groupedByDays[diffDays]++;
  });
  const dueData = {
    labels: ["Hoy", "Mañana", "2 días", "3 días", "4 días", "5 días", "6 días"],
    datasets: [
      {
        label: "Próximas tareas",
        data: groupedByDays,
        backgroundColor: "#f97316",
        borderRadius: 6,
      },
    ],
  };

  const overdueTasks = tasks
    .filter((t) => !t.completed && t.due_date && new Date(t.due_date) < now)
    .sort((a, b) => new Date(b.due_date) - new Date(a.due_date))
    .slice(0, 5);

  // ─────────────── Render
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-8 py-12"
      >
        {/* ENCABEZADO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800">
            Dashboard de estadísticas
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Visualiza el estado y la distribución de tus tareas.
          </p>
        </div>

        {/* TARJETAS RESUMEN */}
        <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        >
        {[
            {
            title: "Completadas",
            value: completed,
            colorFrom: "from-green-50",
            colorTo: "to-green-100",
            textColor: "text-green-600",
            border: "border-green-200",
            },
            {
            title: "Pendientes",
            value: pending,
            colorFrom: "from-indigo-50",
            colorTo: "to-indigo-100",
            textColor: "text-indigo-600",
            border: "border-indigo-200",
            },
            {
            title: "Vencidas",
            value: overdue,
            colorFrom: "from-red-50",
            colorTo: "to-red-100",
            textColor: "text-red-600",
            border: "border-red-200",
            },
        ].map((stat, index) => (
            <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col justify-center items-center h-32 rounded-xl bg-gradient-to-b ${stat.colorFrom} ${stat.colorTo} border ${stat.border} shadow-sm`}
            >
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                {stat.value}
            </h3>
            <p className={`${stat.textColor} text-sm font-medium mt-1`}>
                {stat.title}
            </p>
            </motion.div>
        ))}
        </motion.div>

        {/* GRÁFICOS EN REJILLA 2x2 */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
        {/* Estado general */}
        <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >
        <h2 className="text-lg font-semibold text-green-600 mb-4">
            Estado general
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Leyenda izquierda */}
            <div className="flex flex-col gap-2 text-sm md:w-1/3 order-2 md:order-1">
            {[
                { label: "Completadas", color: "#22c55e" },
                { label: "Pendientes", color: "#3b82f6" },
                { label: "Vencidas", color: "#ef4444" },
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-gray-700">{item.label}</span>
                </div>
            ))}
            </div>

            {/* Gráfico */}
            <div className="w-full md:w-2/3 order-1 md:order-2 flex justify-center">
            <div className="max-w-md w-full flex justify-center">
                <Pie
                data={statusData}
                options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                }}
                height={240}
                />
            </div>
            </div>
        </div>

        <p className="mt-5 text-sm text-gray-500 text-center">
            Total: {total} — {completed} completadas / {pending} pendientes / {overdue} vencidas
        </p>
        </motion.div>

        {/* Estado detallado */}
        <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        whileHover={{ scale: 1.01 }}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >
        <h2 className="text-lg font-semibold text-indigo-600 mb-4">
            Estado detallado
        </h2>
        <div className="h-[260px] flex items-center justify-center">
            <Bar
            data={detailedStatusData}
            options={{
                plugins: { legend: { display: false } }, // 🔹 Oculta leyenda
                maintainAspectRatio: false,
                scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#4b5563", font: { size: 13 } },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "#f1f5f9" },
                    ticks: { color: "#94a3b8", stepSize: 1 },
                },
                },
                layout: {
                padding: { top: 10, bottom: 5, left: 5, right: 5 },
                },
                elements: {
                bar: {
                    borderRadius: 8, // 🔹 Bordes más suaves
                },
                },
            }}
            />
        </div>
        </motion.div>

        {/* Tareas por categoría */}
        <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
            Tareas por categoría
        </h2>
        <div className="h-[260px] flex items-center justify-center">
            <Bar
            data={categoryData}
            options={{
                plugins: { legend: { display: false } }, // 🔹 Oculta leyenda
                maintainAspectRatio: false,
                scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#4b5563", font: { size: 13 } },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "#f1f5f9" },
                    ticks: { color: "#94a3b8", stepSize: 1 },
                },
                },
                layout: {
                padding: { top: 10, bottom: 5, left: 5, right: 5 },
                },
                elements: {
                bar: {
                    borderRadius: 8, // 🔹 Barras redondeadas
                },
                },
            }}
            />
        </div>
        </motion.div>

        {/* Próximas tareas */}
        <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        whileHover={{ scale: 1.01 }}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >
        <h2 className="text-lg font-semibold text-orange-600 mb-4">
            Próximas tareas (7 días)
        </h2>
        <div className="h-[260px] flex items-center justify-center">
            <Bar
            data={dueData}
            options={{
                plugins: { legend: { display: false } }, // 🔹 Sin leyenda
                maintainAspectRatio: false,
                scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#4b5563", font: { size: 13 } },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "#f1f5f9" },
                    ticks: { color: "#94a3b8", stepSize: 1 },
                },
                },
                layout: {
                padding: { top: 10, bottom: 5, left: 5, right: 5 },
                },
                elements: {
                bar: {
                    borderRadius: 8,
                },
                },
            }}
            />
        </div>
        </motion.div>

        </motion.div>

        {/* TAREAS VENCIDAS RECIENTES */}
        {overdueTasks.length > 0 && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-red-600 mb-3">
              Tareas vencidas recientes
            </h2>
            <ul className="divide-y divide-gray-200">
              {overdueTasks.map((t) => (
                <li
                  key={t.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{t.title}</p>
                    <p className="text-sm text-gray-500">
                      {t.category} •{" "}
                      {new Date(t.due_date).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                    Vencida
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Stats;
