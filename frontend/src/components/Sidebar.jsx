import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChartLine, FaWallet, FaCog, FaQuestionCircle } from "react-icons/fa";
import { useDarkMode } from "../context/DarkModeContext";
import logo from "../assets/logo.png";

const NavItem = ({ icon: Icon, label, isActive = false, onClick, isDark }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 8 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
          : isDark
          ? "text-slate-300 hover:bg-slate-700/50"
          : "text-gray-600 hover:bg-emerald-50"
      }`}
    >
      <Icon className="text-lg" />
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="ml-auto w-2 h-2 rounded-full bg-white"
          transition={{ type: "spring" }}
        />
      )}
    </motion.button>
  );
};

export default function Sidebar() {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Derive activeNav directly from the URL pathname (e.g. "/analytics" -> "analytics")
  const activeNav = location.pathname.substring(1) || "dashboard";

  const navItems = [
    { id: "dashboard", icon: FaWallet, label: "Dashboard" },
    { id: "analytics", icon: FaChartLine, label: "Analytics" },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
      className={`${
        isDark
          ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-slate-700"
          : "bg-gradient-to-b from-white via-emerald-50 to-teal-50 border-emerald-200/30"
      } backdrop-blur-xl border-r shadow-lg overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-4 ${isDark ? "border-slate-700" : "border-emerald-200/20"} border-b`}
      >
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <img src={logo} alt="SpendSmart Logo" className="w-8 h-8 object-contain" />
              <div>
                <h1 className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
                  SpendSmart
                </h1>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  Tracker
                </p>
              </div>
            </motion.div>
          )}

          {/* Collapse Button */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-slate-700" : "hover:bg-emerald-100"
            }`}
          >
            <motion.span
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg"
            >
              {isCollapsed ? "📖" : "📕"}
            </motion.span>
          </motion.button>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 px-3 py-6 space-y-2"
      >
        {navItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
          >
            <NavItem
              icon={item.icon}
              label={isCollapsed ? "" : item.label}
              isActive={activeNav === item.id}
              onClick={() => navigate(`/${item.id}`)}
              isDark={isDark}
            />
          </motion.div>
        ))}
      </motion.nav>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3 }}
        className={`mx-3 h-px ${
          isDark
            ? "bg-gradient-to-r from-slate-600 via-slate-500 to-transparent"
            : "bg-gradient-to-r from-emerald-200 via-teal-200 to-transparent"
        } origin-left`}
      />

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-3 space-y-2"
      >
        <NavItem
          icon={FaCog}
          label={isCollapsed ? "" : "Settings"}
          onClick={() => navigate('/settings')}
          isActive={activeNav === "settings"}
          isDark={isDark}
        />
        <NavItem
          icon={FaQuestionCircle}
          label={isCollapsed ? "" : "Help"}
          onClick={() => {}}
          isDark={isDark}
        />

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-4 p-4 rounded-lg ${
              isDark
                ? "bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-500"
                : "bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200/50"
            }`}
          >
            <p className={`text-xs font-semibold ${isDark ? "text-slate-200" : "text-gray-700"} mb-2`}>
              💡 Pro Tip
            </p>
            <p className={`text-xs ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Add expenses daily to build a tracking streak!
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.aside>
  );
}
