import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useDarkMode } from "../context/DarkModeContext";
import { getWeeklyBudget } from "../utils/gamification";
import { pageTransition, staggerItem, staggerContainer } from "../utils/animations";

export default function Settings() {
  const { isDark } = useDarkMode();
  const [budget, setBudget] = useState("");

  useEffect(() => {
    // Load existing budget on mount
    setBudget(getWeeklyBudget().toString());
  }, []);

  const handleSaveBudget = () => {
    const num = Number(budget);
    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }
    
    // Save to localStorage globally for Gamification Engine to read instantly!
    localStorage.setItem("weeklyBudget", num.toString());
    toast.success("✅ Weekly budget updated successfully!");
  };

  return (
    <div className={`flex h-screen ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-emerald-200 via-teal-100 to-blue-200"} overflow-hidden`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <motion.div
           variants={pageTransition}
           initial="initial"
           animate="animate"
           className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Header */}
          <motion.div variants={staggerItem}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              ⚙️ Settings
            </h1>
            <p className={`mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>
              Configure your personal app preferences.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="max-w-2xl mt-8">
            {/* Configuration Card: Weekly Budget */}
            <motion.div variants={staggerItem} className={`p-8 rounded-2xl shadow-xl backdrop-blur-lg border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white/70 border-white/40"}`}>
               <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? "text-slate-100" : "text-gray-800"}`}>
                 <span>🎯</span> Gamification Target
               </h3>
               <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                 Set a target for how much you want to spend each week. Your progress bars, analytics dashboard, and AI insights will dynamically adjust strictly to this goal.
               </p>
               
               <div className="flex flex-col sm:flex-row items-end gap-4">
                 <div className="flex-1 w-full">
                   <label className={`text-sm font-semibold mb-2 block ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                     Weekly Budget Limit (₹)
                   </label>
                   <input
                     type="number"
                     value={budget}
                     onChange={(e) => setBudget(e.target.value)}
                     className={`w-full px-4 py-3 border-2 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-sm ${isDark ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400" : "bg-white/80 border-emerald-300 text-emerald-700"}`}
                   />
                 </div>
                 <div className="w-full sm:w-auto mt-4 sm:mt-0">
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={handleSaveBudget}
                     className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-400 hover:to-emerald-500 transition duration-300 flex items-center justify-center gap-2"
                   >
                     <span>💾</span> Save Preset
                   </motion.button>
                 </div>
               </div>
            </motion.div>
          </motion.div>
          
        </motion.div>
      </div>
    </div>
  );
}
