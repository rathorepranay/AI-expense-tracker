import { useNavigate, useLocation } from "react-router-dom";
import { FaChartLine, FaWallet, FaCog, FaBullseye } from "react-icons/fa";
import { useDarkMode } from "../context/DarkModeContext";

export default function BottomNav() {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const activeNav = location.pathname.substring(1) || "dashboard";

  const navItems = [
    { id: "dashboard", icon: FaWallet, label: "Home" },
    { id: "goals", icon: FaBullseye, label: "Goals" },
    { id: "analytics", icon: FaChartLine, label: "Stats" },
    { id: "settings", icon: FaCog, label: "Settings" }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 md:hidden z-50 border-t ${
      isDark ? "bg-slate-900 border-slate-700" : "bg-white border-emerald-200"
    } pb-safe`}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/${item.id}`)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive 
                  ? (isDark ? "text-emerald-400" : "text-emerald-600") 
                  : (isDark ? "text-slate-400" : "text-gray-500")
              }`}
            >
              <Icon className="text-xl" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
