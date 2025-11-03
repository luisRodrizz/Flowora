// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await registerUser(username, email, password);
      setSuccess("Cuenta creada con éxito 🎉");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(err.message || "Error de conexión con el servidor");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 text-gray-800 overflow-hidden">
      {/* Fondo animado sutil */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-200/30 via-transparent to-transparent"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: "400% 400%" }}
      />

      {/* Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col md:flex-row items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl max-w-5xl w-full mx-4"
      >
        {/* Lado izquierdo - mensaje motivacional */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="flex flex-col justify-center p-10 md:p-16 w-full md:w-1/2 text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-emerald-600">
             Crea tu cuenta
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-md">
            Únete a <span className="font-semibold text-gray-800">Flowora</span> y comienza a 
            organizar tu vida de forma más simple y eficiente.  
            Controla tus metas, tareas y progreso en un solo lugar.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-[2px] w-10 bg-emerald-500" />
            <span className="text-sm text-gray-500">Tu productividad empieza hoy.</span>
          </div>
        </motion.div>

        {/* Panel derecho - formulario */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="bg-white/70 w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-center border-l border-gray-200 rounded-r-3xl"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6 flex items-center justify-center gap-2">
             Regístrate en Flowora
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario */}
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-gray-800 placeholder-gray-500 outline-none"
                required
              />
            </div>

            {/* Correo */}
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-gray-800 placeholder-gray-500 outline-none"
                required
              />
            </div>

            {/* Contraseña */}
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-gray-800 placeholder-gray-500 outline-none"
                required
              />
            </div>

            {/* Mensajes */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-emerald-500 text-sm text-center"
              >
                {success}
              </motion.p>
            )}

            {/* Botón */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium transition"
            >
              Crear cuenta
            </motion.button>

            {/* Enlace a login */}
            <p className="text-sm text-gray-500 text-center mt-4">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:underline hover:text-emerald-500 transition"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;
