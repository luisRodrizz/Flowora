// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../services/api";
import Navbar from "../components/Navbar";

function Completed() {
  const [tasks, setTasks] = useState([]);

  // Obtener solo tareas completadas
  useEffect(() => {
    getTasks()
      .then((data) => {
        const completedTasks = data
          .filter((t) => Boolean(t.completed)) // ✅ acepta true, 1, "true"
          .sort((a, b) => {
            if (!a.due_date && b.due_date) return 1;
            if (a.due_date && !b.due_date) return -1;
            if (!a.due_date && !b.due_date) return 0;
            return new Date(a.due_date) - new Date(b.due_date);
          });
        setTasks(completedTasks);
      })
      .catch(console.error);
  }, []);

  // Marcar como pendiente
  const handleUndo = async (id) => {
    await updateTask(id, { completed: false });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Eliminar tarea
  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-800">
      <Navbar />

      {/* Contenedor principal animado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-8 py-12"
      >
        {/* ENCABEZADO */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-600">
            Tareas Completadas
          </h1>
          <p className="text-gray-500 mt-2">
            Revisa tus avances y gestiona lo que ya has logrado.
          </p>

          {/* Resumen rápido */}
          <div className="flex justify-center mt-6 gap-6">
            <div className="bg-green-200 text-green-800 px-5 py-2 rounded-full font-medium shadow-sm">
              Total completadas: {tasks.length}
            </div>
            <div className="bg-indigo-200 text-indigo-800 px-5 py-2 rounded-full font-medium shadow-sm">
              Productividad:{" "}
              {tasks.length > 0
                ? `${Math.min(tasks.length * 10, 100)}%`
                : "0%"}
            </div>
          </div>
        </div>

        {/* LISTADO DE TAREAS */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full py-20">
              No tienes tareas completadas todavía.
            </p>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-xl shadow-sm border border-green-300 bg-green-50 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold text-gray-700 line-through flex items-center gap-2">
                    ✅ {task.title}
                  </h2>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Eliminar tarea"
                  >
                    ✕
                  </button>
                </div>

                {task.description && (
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {task.description}
                  </p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {task.category} •{" "}
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString("es-ES")
                      : "Sin fecha"}
                  </span>

                  <button
                    onClick={() => handleUndo(task.id)}
                    className="text-sm font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                  >
                    Marcar como pendiente
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Completed;
