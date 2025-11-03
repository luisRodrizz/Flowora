// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";
import { SiPython, SiReact, SiFlask, SiTailwindcss } from "react-icons/si";
import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto px-8 py-16 text-center"
      >
        {/* ENCABEZADO */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold text-slate-800 mb-4"
        >
          Acerca de este proyecto
        </motion.h1>

        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          Esta es una aplicación{" "}
          <span className="text-indigo-600 font-semibold">Full Stack</span>{" "}
          desarrollada con{" "}
          <span className="text-indigo-600 font-semibold">React y Flask</span>.{" "}
          Permite gestionar tareas de manera eficiente y visualizar estadísticas
          de productividad en tiempo real.
        </p>

        {/* SECCIÓN: TECNOLOGÍAS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-10"
        >
          <h2 className="text-2xl font-semibold text-indigo-600 mb-6">
            Tecnologías utilizadas
          </h2>

          <div className="flex justify-center space-x-8 text-4xl">
            <SiPython
              className="text-yellow-500 hover:scale-110 transition-transform"
              title="Python"
            />
            <SiFlask
              className="text-gray-500 hover:scale-110 transition-transform"
              title="Flask"
            />
            <SiReact
              className="text-cyan-500 hover:scale-110 transition-transform"
              title="React"
            />
            <SiTailwindcss
              className="text-sky-500 hover:scale-110 transition-transform"
              title="Tailwind CSS"
            />
          </div>
        </motion.div>

        {/* SECCIÓN: SOBRE MÍ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-10"
        >
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            Sobre mí
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Soy un desarrollador en formación, apasionado por la creación de
            aplicaciones web modernas y funcionales. Este proyecto fue diseñado
            como una oportunidad para aprender, practicar y mejorar mis
            habilidades como{" "}
            <span className="text-indigo-600 font-medium">
              Full Stack Developer
            </span>
            , aplicando buenas prácticas y diseño limpio.
          </p>
        </motion.div>

        {/* SECCIÓN: ENLACES */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center space-x-8 text-3xl mb-10"
        >
          <a
            href="https://github.com/luisRodrizz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-transform transform hover:scale-110"
            title="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/TU_USUARIO"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-transform transform hover:scale-110"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="#"
            className="hover:text-purple-500 transition-transform transform hover:scale-110"
            title="Portafolio"
          >
            <FaCode />
          </a>
        </motion.div>

        {/* PIE DE PÁGINA */}
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Desarrollado por{" "}
          <span className="text-indigo-600 font-medium">Luis Rodríguez</span>
        </p>
      </motion.div>
    </div>
  );
}

export default About;
