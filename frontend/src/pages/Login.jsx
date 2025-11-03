// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(email, password);
      // Simulación de espera para UX
      setTimeout(() => {
        navigate("/");
        setLoading(false);
      }, 1200);
    } catch (err) {
      console.error("Error en el login:", err);
      setError(err.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen message="Iniciando sesión..." />}

      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 text-gray-800 overflow-hidden">
        {/* Fondo animado sutil */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-200/30 via-transparent to-transparent"
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
          {/* Lado izquierdo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex flex-col justify-center p-10 md:p-16 w-full md:w-1/2 text-left"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-600">
               ¡Bienvenido a Flowora!
            </h1>
            <p className="text-gray-600 leading-relaxed max-w-md">
              Gestiona tus tareas, organiza tu día y alcanza tus metas con una
              interfaz clara, moderna y eficiente.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-[2px] w-10 bg-indigo-500" />
              <span className="text-sm text-gray-500">Tu productividad, elevada.</span>
            </div>
          </motion.div>

          {/* Panel de login */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="bg-white/70 w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-center border-l border-gray-200 rounded-r-3xl"
          >
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6 flex items-center justify-center gap-2">
               Inicia sesión en tu cuenta
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
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
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
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

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              {/* Botón principal */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-medium transition disabled:opacity-70"
              >
                Iniciar sesión
              </motion.button>

              {/* Botón alternativo */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
              >
                <FaGoogle className="text-red-500" /> Iniciar con Google
              </button>

              {/* Enlace registro */}
              <p className="text-sm text-gray-500 text-center mt-4">
                ¿Aún no tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 hover:underline hover:text-indigo-500 transition"
                >
                  Regístrate aquí
                </Link>
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Login;
