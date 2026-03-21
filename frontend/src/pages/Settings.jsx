import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useDarkMode } from "../context/DarkModeContext";
import { getWeeklyBudget } from "../utils/gamification";
import { pageTransition, staggerItem, staggerContainer } from "../utils/animations";

export default function Settings() {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const [budget, setBudget] = useState("");

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      if (data.length === 0) {
        toast.error("No expenses to export");
        return;
      }

      const headers = ["Date", "Category", "Amount", "Note"];
      const csvRows = [headers.join(",")];
      
      data.forEach(exp => {
        const row = [
          new Date(exp.date).toLocaleDateString("en-IN"),
          exp.category,
          exp.amount,
          `"${(exp.note || "").replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(","));
      });
      
      const csvString = csvRows.join("\\n");
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "spendsmart_expenses.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("✅ Expenses exported!");
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to delete ALL your expense history? This cannot be undone.")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/expenses/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        toast.success("🗑️ All history cleared!");
      } else {
        toast.error("Failed to clear history");
      }
    } catch {
      toast.error("Error clearing history");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmName = window.prompt("Type 'DELETE' to permanently delete your account. This will wipe all data.");
    if (confirmName !== 'DELETE') {
      toast.error("Account deletion cancelled");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/auth/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        toast.success("Account deleted");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
      } else {
        toast.error("Failed to delete account");
      }
    } catch {
      toast.error("Error deleting account");
    }
  };

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
      <BottomNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <motion.div
           variants={pageTransition}
           initial="initial"
           animate="animate"
           className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 space-y-6"
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

            {/* Data & Privacy Card */}
            <motion.div variants={staggerItem} className={`mt-6 p-8 rounded-2xl shadow-xl backdrop-blur-lg border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white/70 border-white/40"}`}>
               <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? "text-slate-100" : "text-gray-800"}`}>
                 <span>🛡️</span> Data & Privacy
               </h3>
               
               <div className="space-y-4 mt-6">
                 {/* Export CSV */}
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 gap-4">
                   <div>
                     <h4 className={`font-semibold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Export Data</h4>
                     <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Download all your expenses as a CSV file</p>
                   </div>
                   <button onClick={handleExportCSV} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow transition">
                     Download CSV
                   </button>
                 </div>

                 {/* Clear History */}
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 gap-4">
                   <div>
                     <h4 className={`font-semibold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Clear History</h4>
                     <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Delete all expenses but keep your account</p>
                   </div>
                   <button onClick={handleClearHistory} className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-semibold rounded-lg shadow transition">
                     Clear History
                   </button>
                 </div>

                 {/* Delete Account */}
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 gap-4">
                   <div>
                     <h4 className={`font-semibold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Danger Zone</h4>
                     <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Permanently delete your account and all data</p>
                   </div>
                   <button onClick={handleDeleteAccount} className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg shadow transition">
                     Delete Account
                   </button>
                 </div>
               </div>
            </motion.div>
          </motion.div>
          
        </motion.div>
      </div>
    </div>
  );
}
