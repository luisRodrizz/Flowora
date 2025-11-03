import { getToken } from "./auth"; // 👈 importa la función que obtiene el token

const API_URL = "http://127.0.0.1:5000";

// 🔐 Función auxiliar: agrega el header Authorization automáticamente
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 📋 Obtener todas las tareas del usuario logueado
export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
  if (!res.ok) throw new Error("Error al obtener las tareas");
  return await res.json();
}

// ➕ Crear nueva tarea
export async function addTask(
  title,
  category = "General",
  due_date = null,
  description = ""
) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ title, category, due_date, description }),
  });
  if (!res.ok) throw new Error("Error al crear la tarea");
  return await res.json();
}

// ✏️ Actualizar una tarea
export async function updateTask(id, updates) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Error al actualizar la tarea");
  return await res.json();
}

// 🗑️ Eliminar una tarea
export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar la tarea");
  return await res.json();
}
