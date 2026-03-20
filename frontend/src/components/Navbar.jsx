import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Optional: Fetch username from backend if you want to display it
    // For now, we'll just show a generic greeting
    setUsername("User");
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear local storage
      localStorage.removeItem("token");
      toast.success("👋 See you soon!");

      // Small delay for animation
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
      className="bg-gradient-to-r from-purple-50 via-white to-pink-50 backdrop-blur-xl border-b border-purple-200/30 shadow-sm"
    >
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Left: Logo & Greeting */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-2xl"
          >
            💰
          </motion.div>
          <div>
            <h1 className="font-bold text-gray-900">ExpenseAI</h1>
            <p className="text-xs text-gray-500">Smart spending tracker</p>
          </div>
        </motion.div>

        {/* Right: Greeting & Logout */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          {/* Greeting */}
          <div className="hidden sm:block">
            <p className="text-sm text-gray-600">
              Welcome back, <span className="font-semibold text-purple-600">{username}</span>
            </p>
            <p className="text-xs text-gray-400">Track your daily expenses</p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-purple-200 to-pink-200" />

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            disabled={isLoggingOut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300"
            style={{
              background: isLoggingOut
                ? "linear-gradient(135deg, #9333ea, #ec4899)"
                : "linear-gradient(135deg, #ef4444, #dc2626)",
            }}
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
        className="h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-transparent origin-left"
      />
    </motion.nav>
  );
}
