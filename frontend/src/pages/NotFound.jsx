import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { isDark } = useDarkMode();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? "bg-slate-950" : "bg-gradient-to-br from-emerald-100 to-teal-100"}`}>
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full p-8 md:p-12 text-center rounded-3xl shadow-2xl backdrop-blur-lg border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-white"}`}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="text-8xl mb-6"
        >
          🛸
        </motion.div>
        
        <h1 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
          404
        </h1>
        
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-slate-200" : "text-gray-800"}`}>
          Lost in Space?
        </h2>
        
        <p className={`mb-8 ${isDark ? "text-slate-400" : "text-gray-600"}`}>
          The page you are looking for seems to have vanished or been abducted. Let's get you back to safety.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-emerald-500/30 transition-shadow"
        >
          Return to Dashboard ✨
        </motion.button>
      </motion.div>
    </div>
  );
}
