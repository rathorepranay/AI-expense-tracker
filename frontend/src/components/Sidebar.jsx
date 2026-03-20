import { useState } from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaWallet, FaCog, FaQuestionCircle } from "react-icons/fa";

const NavItem = ({ icon: Icon, label, isActive = false, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 8 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
          : "text-gray-600 hover:bg-purple-50"
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
  const [activeNav, setActiveNav] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "dashboard", icon: FaWallet, label: "Dashboard" },
    { id: "analytics", icon: FaChartLine, label: "Analytics" },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-b from-white via-purple-50 to-pink-50 backdrop-blur-xl border-r border-purple-200/30 shadow-lg overflow-hidden flex flex-col"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 border-b border-purple-200/20"
      >
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-2xl"
              >
                💰
              </motion.div>
              <div>
                <h1 className="font-bold text-gray-900">ExpenseAI</h1>
                <p className="text-xs text-gray-500">Tracker</p>
              </div>
            </motion.div>
          )}

          {/* Collapse Button */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
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
              onClick={() => setActiveNav(item.id)}
            />
          </motion.div>
        ))}
      </motion.nav>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-3 h-px bg-gradient-to-r from-purple-200 via-pink-200 to-transparent origin-left"
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
          onClick={() => {}}
        />
        <NavItem
          icon={FaQuestionCircle}
          label={isCollapsed ? "" : "Help"}
          onClick={() => {}}
        />

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-4 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200/50"
          >
            <p className="text-xs font-semibold text-gray-700 mb-2">💡 Pro Tip</p>
            <p className="text-xs text-gray-600">
              Add expenses daily to build a tracking streak!
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.aside>
  );
}
