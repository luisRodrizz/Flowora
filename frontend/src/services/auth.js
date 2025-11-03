const API_URL = "http://127.0.0.1:5000";

// ✅ Guardar token
export function saveToken(token) {
  localStorage.setItem("token", token);
}

// ✅ Obtener token
export function getToken() {
  return localStorage.getItem("token");
}

// ✅ Eliminar token y nombre (logout)
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("username"); // 👈 importante: limpia también el nombre
}

// ✅ Registro
export async function registerUser(username, email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al registrar usuario");
  }

  return await res.json();
}

// ✅ Login
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Credenciales inválidas");
  }

  const data = await res.json();

  // 👇 Asegura que se guarde correctamente el nombre y token
  saveToken(data.token);
  if (data.user && data.user.username) {
    localStorage.setItem("username", data.user.username);
  } else {
    console.warn("⚠️ No se encontró el nombre de usuario en la respuesta del backend.");
  }

  return data;
}
