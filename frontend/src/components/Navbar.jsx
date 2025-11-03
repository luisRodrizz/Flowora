import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaBars, FaTimes } from "react-icons/fa";
import { logoutUser, getToken } from "../services/auth";
import LoadingScreen from "../components/LoadingScreen"; // 👈 Importa tu animación

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // 👈 Nuevo estado
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, [location]);

  const handleLogout = async () => {
    setIsLoggingOut(true); // 👈 Muestra la animación
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Pequeña pausa
    logoutUser();
    setIsLoggedIn(false);
    setIsLoggingOut(false);
    navigate("/login");
  };

  const navLinks = [
    { path: "/", label: "Inicio" },
    { path: "/completed", label: "Completadas" },
    { path: "/stats", label: "Estadísticas" },
    { path: "/about", label: "Acerca de" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-semibold hover:opacity-90 transition"
          >
            <FaCheckCircle className="text-white text-2xl" />
            <span>Flowora</span>
          </Link>

          {/* BOTÓN MENÚ MÓVIL */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-xl md:hidden focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* LINKS PRINCIPALES */}
          <div
            className={`${
              menuOpen
                ? "flex flex-col absolute top-16 left-0 w-full bg-indigo-700 md:bg-transparent md:static md:flex md:flex-row"
                : "hidden md:flex"
            } items-center gap-6 md:gap-8 text-sm font-medium transition-all`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`relative py-2 md:py-0 ${
                  location.pathname === link.path
                    ? "text-white font-semibold"
                    : "text-indigo-100 hover:text-white"
                } transition`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-white rounded-full md:bottom-[-4px]" />
                )}
              </Link>
            ))}

            {/* AUTENTICACIÓN */}
            <div className="flex flex-col md:flex-row items-center gap-3 mt-3 md:mt-0 md:ml-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition w-full md:w-auto"
                >
                  Cerrar sesión
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="bg-white text-indigo-700 hover:bg-gray-100 px-4 py-1.5 rounded-lg text-sm font-medium transition w-full md:w-auto text-center"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="border border-white hover:bg-white hover:text-indigo-700 px-4 py-1.5 rounded-lg text-sm font-medium transition w-full md:w-auto text-center"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 🔹 Animación de cierre de sesión */}
      {isLoggingOut && <LoadingScreen message="Cerrando sesión..." />}
    </>
  );
}

export default Navbar;
