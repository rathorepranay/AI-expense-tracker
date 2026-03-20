import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import CanvasAnimatedBackground from "../components/CanvasAnimatedBackground";
import { useDarkMode } from "../context/DarkModeContext";
import { pageTransition, staggerContainer, staggerItem, glowEffect } from "../utils/animations";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Username/Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.token) {
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      toast.success("✨ Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Dark Background Gradient */}
      {!isDark && <CanvasAnimatedBackground />}

      {/* Dark Theme Background */}
      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      )}

      {/* Login Form - Animated and positioned on top */}
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className={`${
            isDark
              ? "bg-slate-800/60 border-slate-700/50"
              : "bg-white/20 border-white/30"
          } backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-80 border`}
        >
          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
              isDark
                ? "bg-slate-700/50 text-yellow-400 hover:bg-slate-600"
                : "bg-white/30 text-white hover:bg-white/50"
            }`}
          >
            {isDark ? "☀️" : "🌙"}
          </motion.button>

          {/* Title */}
          <motion.div variants={staggerItem} className="text-center mb-8">
            <h2 className={`${isDark ? "text-white" : "text-white"} text-4xl font-bold mb-2`}>
              Welcome Back! 👋
            </h2>
            <p className={isDark ? "text-slate-400 text-sm" : "text-gray-200 text-sm"}>
              Track your expenses smarter
            </p>
          </motion.div>

          {/* Username Input */}
          <motion.div variants={staggerItem}>
            <motion.input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              whileFocus={{ scale: 1.02 }}
              className={`${
                isDark
                  ? "bg-slate-700/50 text-white placeholder-slate-400 border-slate-600 focus:ring-purple-400"
                  : "bg-white/90 text-gray-900 placeholder-gray-400 border-white focus:ring-white"
              } w-full mb-4 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 border-2 backdrop-blur-sm transition font-medium`}
            />
          </motion.div>

          {/* Password Input */}
          <motion.div variants={staggerItem}>
            <motion.input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              whileFocus={{ scale: 1.02 }}
              className={`${
                isDark
                  ? "bg-slate-700/50 text-white placeholder-slate-400 border-slate-600 focus:ring-purple-400"
                  : "bg-white/90 text-gray-900 placeholder-gray-400 border-white focus:ring-white"
              } w-full mb-6 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 border-2 backdrop-blur-sm transition font-medium`}
            />
          </motion.div>

          {/* Login Button */}
          <motion.button
            variants={staggerItem}
            onClick={handleLogin}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...glowEffect}
            className={`${
              isDark
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-900/50"
                : "bg-gradient-to-r from-white to-gray-100 text-purple-600"
            } w-full font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition transform`}
          >
            {loading ? (
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                ⏳
              </motion.span>
            ) : (
              "Login Now 🚀"
            )}
          </motion.button>

          {/* Register Link */}
          <motion.div
            variants={staggerItem}
            className={`${isDark ? "text-slate-300" : "text-white"} text-sm text-center mt-6`}
          >
            Don't have an account?{" "}
            <motion.span
              onClick={() => navigate("/register")}
              whileHover={{ scale: 1.1 }}
              className={`underline cursor-pointer font-bold transition inline-block ${
                isDark ? "hover:text-white" : "hover:text-gray-100"
              }`}
            >
              Register here
            </motion.span>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            variants={staggerItem}
            className="mt-6 flex justify-center gap-2 text-2xl"
          >
            {["💰", "📊", "✨"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
