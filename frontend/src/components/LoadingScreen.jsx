// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

function LoadingScreen({ message = "Cargando..." }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-50 text-gray-700">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-indigo-500 text-4xl mb-4"
        >
          <FaSpinner />
        </motion.div>
        <p className="text-lg font-medium">{message}</p>
      </motion.div>
    </div>
  );
}

export default LoadingScreen;
