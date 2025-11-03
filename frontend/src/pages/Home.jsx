// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "../services/api";
import Navbar from "../components/Navbar";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("General");
  const [filter, setFilter] = useState("Todas");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  // ✅ Obtener el nombre del usuario desde localStorage
  const userName = localStorage.getItem("username") || "Usuario";

  // ✅ Obtener tareas desde el backend
  useEffect(() => {
    getTasks()
      .then((data) => {
        const sorted = data.sort((a, b) => {
          if (!a.due_date && b.due_date) return 1;
          if (a.due_date && !b.due_date) return -1;
          if (!a.due_date && !b.due_date) return 0;
          return new Date(a.due_date) - new Date(b.due_date);
        });
        setTasks(sorted);
      })
      .catch(console.error);
  }, []);

  // ➕ Agregar nueva tarea
  const handleAdd = async () => {
    if (!newTask.trim()) return;
    try {
      const task = await addTask(newTask, category, dueDate || null, description);
      setTasks([...tasks, task]);
      setNewTask("");
      setCategory("General");
      setDueDate("");
      setDescription("");
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  // 🔄 Cambiar estado (completada / pendiente)
  const handleToggle = async (id, completed) => {
    try {
      const updated = await updateTask(id, { completed: !completed });
      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  // 🗑️ Eliminar tarea
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // 📋 Filtrar tareas por categoría
  const filteredTasks =
    filter === "Todas" ? tasks : tasks.filter((t) => t.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-8 py-12"
      >
        {/* 🧭 ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Bienvenido, {userName}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Aquí puedes gestionar tus tareas pendientes, organizar tus proyectos y
            hacer seguimiento de tu progreso diario.
          </p>
        </motion.div>

        {/* 📝 FORMULARIO DE CREACIÓN */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Título de la tarea..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-800"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-800"
            >
              <option value="General">General</option>
              <option value="Trabajo">Trabajo</option>
              <option value="Estudio">Estudio</option>
              <option value="Personal">Personal</option>
              <option value="Otros">Otros</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-800"
            />
          </div>

          <textarea
            placeholder="Descripción o detalles adicionales..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-gray-800 placeholder-gray-500 mb-4"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition w-full md:w-auto"
          >
            Agregar tarea
          </motion.button>
        </div>

        {/* 🎯 FILTROS DE CATEGORÍA */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["Todas", "General", "Trabajo", "Estudio", "Personal", "Otros"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* 📦 GRID DE TAREAS */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No hay tareas registradas.
            </p>
          ) : (
            filteredTasks.map((task) => {
              const today = new Date();
              const due = task.due_date ? new Date(task.due_date) : null;
              const isOverdue = due && !task.completed && due < today;

              return (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`p-6 rounded-xl shadow-sm border transition ${
                    task.completed
                      ? "bg-green-50 border-green-200"
                      : isOverdue
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-gray-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2
                      className={`text-lg font-semibold ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : isOverdue
                          ? "text-red-600"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </h2>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      ✕
                    </button>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {task.category} •{" "}
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString("es-ES")
                        : "Sin fecha"}
                      {isOverdue && !task.completed && (
                        <span className="ml-2 text-red-600 font-medium">
                          (Vencida)
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => handleToggle(task.id, task.completed)}
                      className={`text-sm font-medium px-3 py-1 rounded-full transition ${
                        task.completed
                          ? "bg-green-100 text-green-700"
                          : isOverdue
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {task.completed
                        ? "Completada"
                        : isOverdue
                        ? "Vencida"
                        : "Pendiente"}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
