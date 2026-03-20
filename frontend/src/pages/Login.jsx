import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { pageTransition, staggerContainer, staggerItem, glowEffect } from "../utils/animations";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 left-10 text-6xl opacity-20"
      >
        💳
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-10 right-10 text-6xl opacity-20"
      >
        💰
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-80 border border-white/30"
      >
        {/* Title */}
        <motion.div variants={staggerItem} className="text-center mb-8">
          <h2 className="text-white text-4xl font-bold mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-200 text-sm">
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
            className="w-full mb-4 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/90 backdrop-blur-sm transition placeholder-gray-400 font-medium"
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
            className="w-full mb-6 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/90 backdrop-blur-sm transition placeholder-gray-400 font-medium"
          />
        </motion.div>

        {/* LoginButton */}
        <motion.button
          variants={staggerItem}
          onClick={handleLogin}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          {...glowEffect}
          className="w-full bg-gradient-to-r from-white to-gray-100 text-purple-600 font-bold py-3 rounded-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition transform"
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
        <motion.div variants={staggerItem} className="text-white text-sm text-center mt-6">
          Don't have an account?{" "}
          <motion.span
            onClick={() => navigate("/register")}
            whileHover={{ scale: 1.1 }}
            className="underline cursor-pointer font-bold hover:text-gray-100 transition inline-block"
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
  );
}
