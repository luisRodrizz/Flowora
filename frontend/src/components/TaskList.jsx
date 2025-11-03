import { useState } from "react";
import { FaTrash, FaUndo, FaCheck } from "react-icons/fa";

/**
 * Componente reutilizable de lista de tareas.
 *
 * Props:
 * - tasks: array de tareas
 * - onToggle: función para marcar/desmarcar una tarea
 * - onDelete: función para eliminar una tarea
 * - mode: "home" | "completed" (determina el comportamiento)
 */
function TaskList({ tasks = [], onToggle, onDelete, mode = "home" }) {
  const [expandedId, setExpandedId] = useState(null); // 🆕 controla qué tarea está expandida

  if (!tasks.length) {
    return (
      <p className="text-gray-400 text-center">
        {mode === "completed"
          ? "No tienes tareas completadas aún."
          : "No hay tareas aún ✨"}
      </p>
    );
  }

  // 🧠 Calcula la diferencia de días entre la fecha y hoy
  const getDueStatus = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1)
      return { text: `Faltan ${diffDays} días`, color: "text-gray-400" };
    if (diffDays === 1)
      return { text: "Falta 1 día", color: "text-yellow-400" };
    if (diffDays === 0)
      return { text: "⚠️ Vence hoy", color: "text-yellow-500 font-semibold" };
    if (diffDays === -1) return { text: "Venció ayer", color: "text-red-400" };
    return {
      text: `Vencida hace ${Math.abs(diffDays)} días`,
      color: "text-red-500",
    };
  };

  return (
    <ul className="w-full max-w-md space-y-3">
      {tasks.map((task) => {
        const status = getDueStatus(task.due_date);
        const isExpanded = expandedId === task.id;

        return (
          <li
            key={task.id}
            className="flex justify-between items-start bg-gray-800 px-4 py-3 rounded-lg border border-gray-700 hover:bg-gray-750 transition"
          >
            {/* Título, descripción, categoría y fecha */}
            <div className="flex-1">
              {/* Título */}
              <p
                onClick={() => onToggle(task.id, task.completed)}
                className={`cursor-pointer ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "hover:text-blue-400"
                }`}
              >
                {task.title}
              </p>

              {/* Descripción */}
              {task.description && (
                <div className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">
                  {isExpanded
                    ? task.description
                    : task.description.length > 100
                    ? task.description.slice(0, 100) + "..."
                    : task.description}

                  {task.description.length > 100 && (
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : task.id)
                      }
                      className="text-blue-400 hover:text-blue-300 text-xs ml-1"
                    >
                      {isExpanded ? "Ver menos" : "Ver más"}
                    </button>
                  )}
                </div>
              )}

              {/* Categoría */}
              <span className="text-xs text-gray-400 italic block mt-1">
                ({task.category || "General"})
              </span>

              {/* Fecha límite */}
              {task.due_date && (
                <>
                  <span className="text-xs text-gray-400 block">
                    📅 {new Date(task.due_date).toLocaleDateString("es-ES")}
                  </span>
                  {status && (
                    <span className={`text-xs ${status.color} block`}>
                      {status.text}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-3 ml-3">
              {mode === "completed" ? (
                <button
                  onClick={() => onToggle(task.id, task.completed)}
                  className="text-yellow-400 hover:text-yellow-500 transition-transform transform hover:scale-110"
                  title="Marcar como pendiente"
                >
                  <FaUndo />
                </button>
              ) : (
                <button
                  onClick={() => onToggle(task.id, task.completed)}
                  className="text-green-400 hover:text-green-500 transition-transform transform hover:scale-110"
                  title="Marcar como completada"
                >
                  <FaCheck />
                </button>
              )}

              <button
                onClick={() => onDelete(task.id)}
                className="text-red-400 hover:text-red-600 transition-transform transform hover:scale-110"
                title="Eliminar tarea"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;
