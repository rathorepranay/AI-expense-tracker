import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useConfetti } from "../components/ConfettiTrigger";
import { pageTransition, staggerContainer, staggerItem, glowEffect } from "../utils/animations";

export default function Register() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [registrationData, setRegistrationData] = useState(null);
  const navigate = useNavigate();
  const triggerConfetti = useConfetti();

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && step === 2) {
      toast.error("OTP expired. Please register again.");
      setStep(1);
    }
  }, [timeLeft, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 300) return "text-green-400";
    if (timeLeft > 60) return "text-yellow-400";
    return "text-red-400";
  };

  const handleRegister = async () => {
    if (!username || !password || !email) {
      toast.error("Username, password, and email are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters, with 1 number and 1 symbol.");
      return;
    }

    if (phone && phone.trim() !== "") {
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(phone)) {
        toast.error("Phone number must be at least 10 digits");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          phone: phone || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✨ OTP sent to your email!");
        setRegistrationData({ username, password, email, phone });
        setStep(2);
        setTimeLeft(600);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: registrationData.email,
          otp_code: otp,
          username: registrationData.username,
          password: registrationData.password,
          phone: registrationData.phone || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Trigger confetti
        triggerConfetti();
        toast.success("🎉 Registration successful! Please log in. 🚀");
        navigate("/");
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      if (step === 1) handleRegister();
      else handleVerifyOTP();
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden px-4 sm:px-6 py-6"
    >
      {/* Animated Background */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 left-10 text-6xl opacity-20"
      >
        🎉
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-10 right-10 text-6xl opacity-20"
      >
        ✨
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          // Step 1: Registration Form
          <motion.div
            key="step1"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white/20 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full sm:w-96 md:w-[420px] max-w-lg border border-white/30"
          >
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Title */}
              <motion.div variants={staggerItem} className="text-center mb-6 sm:mb-8">
                <h2 className="text-white text-3xl sm:text-4xl font-bold mb-2">
                  Create Account 🚀
                </h2>
                <p className="text-gray-200 text-xs sm:text-sm">
                  Start your expense tracking journey
                </p>
              </motion.div>

              {/* Progress Indicator */}
              <motion.div variants={staggerItem} className="mb-6 flex gap-2">
                <div className="flex-1 h-1 bg-white rounded-full"></div>
                <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
              </motion.div>

              {/* Username Input */}
              <motion.div variants={staggerItem}>
                <motion.input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  whileFocus={{ scale: 1.02 }}
                  className="w-full mb-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/90 backdrop-blur-sm transition text-sm sm:text-base"
                />
              </motion.div>

              {/* Email Input */}
              <motion.div variants={staggerItem}>
                <motion.input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  whileFocus={{ scale: 1.02 }}
                  className="w-full mb-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/90 backdrop-blur-sm transition text-sm sm:text-base"
                />
              </motion.div>

              {/* Phone Input */}
              <motion.div variants={staggerItem}>
                <motion.input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyPress={handleKeyPress}
                  whileFocus={{ scale: 1.02 }}
                  className="w-full mb-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/90 backdrop-blur-sm transition text-sm sm:text-base"
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
                  className="w-full mb-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/90 backdrop-blur-sm transition text-sm sm:text-base"
                />
                <p className="text-white/80 text-xs mb-6 sm:mb-8 ml-1">
                  * Must be at least 8 chars, 1 number, & 1 symbol
                </p>
              </motion.div>

              {/* Register Button */}
              <motion.button
                variants={staggerItem}
                onClick={handleRegister}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                {...glowEffect}
                className="w-full bg-gradient-to-r from-white to-gray-100 text-purple-600 font-bold py-2.5 sm:py-3 rounded-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
              >
                {loading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    ⏳
                  </motion.span>
                ) : (
                  "Register & Send OTP 📧"
                )}
              </motion.button>

              {/* Login Link */}
              <motion.div variants={staggerItem} className="text-white text-xs sm:text-sm text-center mt-6">
                Already have an account?{" "}
                <motion.span
                  onClick={() => navigate("/")}
                  whileHover={{ scale: 1.1 }}
                  className="underline cursor-pointer font-bold hover:text-gray-100 inline-block"
                >
                  Login here
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          // Step 2: OTP Verification
          <motion.div
            key="step2"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white/20 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full sm:w-96 md:w-[420px] max-w-lg border border-white/30"
          >
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Title */}
              <motion.div variants={staggerItem} className="text-center mb-6 sm:mb-8">
                <h2 className="text-white text-3xl sm:text-4xl font-bold mb-2">
                  Verify Email ✅
                </h2>
                <p className="text-gray-200 text-xs sm:text-sm">
                  6-digit code sent to <br />
                  <span className="font-semibold">{registrationData?.email}</span>
                </p>
              </motion.div>

              {/* Progress Indicator */}
              <motion.div variants={staggerItem} className="mb-6 flex gap-2">
                <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                <div className="flex-1 h-1 bg-white rounded-full"></div>
              </motion.div>

              {/* OTP Input with Animation */}
              <motion.div variants={staggerItem}>
                <motion.input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  onKeyPress={handleKeyPress}
                  maxLength="6"
                  whileFocus={{ scale: 1.05 }}
                  className="w-full mb-4 px-3 sm:px-4 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-center text-2xl sm:text-4xl tracking-[0.5rem] sm:tracking-[1rem] font-bold bg-white/90 backdrop-blur-sm transition"
                />
              </motion.div>

              {/* Countdown Timer */}
              <motion.div
                variants={staggerItem}
                className="text-center mb-6 sm:mb-8"
              >
                <p className="text-white text-xs sm:text-sm mb-2">Time remaining:</p>
                <motion.p
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className={`text-2xl sm:text-3xl font-bold font-mono ${getTimerColor()}`}
                >
                  {formatTime(timeLeft)}
                </motion.p>
                {timeLeft < 60 && (
                  <motion.p
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-red-300 text-xs sm:text-sm mt-2 font-semibold"
                  >
                    ⚠️ OTP expiring soon!
                  </motion.p>
                )}
              </motion.div>

              {/* Verify Button */}
              <motion.button
                variants={staggerItem}
                onClick={handleVerifyOTP}
                disabled={loading || timeLeft === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                {...glowEffect}
                className="w-full bg-gradient-to-r from-white to-gray-100 text-purple-600 font-bold py-2.5 sm:py-3 rounded-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition mb-3 text-sm sm:text-base"
              >
                {loading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    ⏳
                  </motion.span>
                ) : (
                  "Verify OTP 🔐"
                )}
              </motion.button>

              {/* Back Button */}
              <motion.button
                variants={staggerItem}
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setRegistrationData(null);
                }}
                className="w-full bg-transparent text-white font-semibold py-2 sm:py-2.5 rounded-lg border border-white hover:bg-white/10 transition text-sm sm:text-base"
              >
                Back to Registration
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
