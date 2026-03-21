import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDarkMode } from "../context/DarkModeContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername("User");
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("token");
      toast.success("👋 See you soon!");

      await new Promise(resolve => setTimeout(resolve, 500));
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${
        isDark
          ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700"
          : "bg-gradient-to-r from-purple-50 via-white to-pink-50 border-purple-200/30"
      } backdrop-blur-xl border-b shadow-sm`}
    >
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Left: Logo & Greeting */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <img src={logo} alt="SpendSmart" className="w-8 h-8 object-contain" />
          <div>
            <h1 className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
              SpendSmart
            </h1>
            <p className={isDark ? "text-xs text-slate-400" : "text-xs text-gray-500"}>
              Smart spending tracker
            </p>
          </div>
        </motion.div>

        {/* Right: Greeting, Theme Toggle & Logout */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          {/* Greeting */}
          <div className="hidden sm:block">
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Welcome back, <span className="font-semibold text-purple-600">{username}</span>
            </p>
            <p className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>
              Track your daily expenses
            </p>
          </div>

          {/* Divider */}
          <div className={`hidden sm:block w-px h-8 ${isDark ? "bg-gradient-to-b from-slate-600 to-slate-700" : "bg-gradient-to-b from-purple-200 to-pink-200"}`} />

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
              isDark
                ? "bg-slate-700/50 text-yellow-400 hover:bg-slate-600"
                : "bg-purple-100 text-purple-600 hover:bg-purple-200"
            }`}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </motion.button>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            disabled={isLoggingOut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              isDark
                ? "bg-gradient-to-r from-red-900/70 to-pink-900/70 text-red-200 hover:from-red-800 hover:to-pink-800"
                : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
            }`}
          >
            <span className="text-white flex items-center gap-2">
              {isLoggingOut ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  ⏳
                </motion.span>
              ) : (
                <>
                  👋 Logout
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Animated bottom border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className={`h-0.5 ${isDark ? "bg-gradient-to-r from-purple-600 via-pink-600 to-transparent" : "bg-gradient-to-r from-purple-400 via-pink-400 to-transparent"} origin-left`}
      />
    </motion.nav>
  );
}
