import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { SkeletonCard } from "../components/SkeletonLoader";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useDarkMode } from "../context/DarkModeContext";
import { pageTransition, staggerContainer, staggerItem } from "../utils/animations";
import SpendingChart from "../components/SpendingChart";
import CumulativeAreaChart from "../components/CumulativeAreaChart";
import TopExpenses from "../components/TopExpenses";

export default function Analytics() {
  const navigate = useNavigate();
  const { isDark } = useDarkMode();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/");
        return;
      }

      setLoading(true);
      const res = await fetch("http://localhost:4000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setExpenses(data);
      } else {
        toast.error(data.message || "Failed to load analytics");
      }
    } catch {
      toast.error("Error fetching analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div
      className={`flex h-screen ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-emerald-200 via-teal-100 to-blue-200"
      } overflow-hidden`}
    >
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
              📈 Analytics Overview
            </h1>
            <p className={`mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>
              Deep dive into your spending habits and trends
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-6"
          >
            {/* Top Section: Area Chart & Top Expenses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={staggerItem} className="lg:col-span-2 relative">
                {loading ? <SkeletonCard /> : <CumulativeAreaChart expenses={expenses} />}
              </motion.div>
              
              <motion.div variants={staggerItem} className="lg:col-span-1 h-[420px] overflow-y-auto custom-scrollbar">
                {loading ? <SkeletonCard /> : <TopExpenses expenses={expenses} />}
              </motion.div>
            </div>

            {/* Bottom Section: Existing Daily / Pie Charts */}
            <motion.div variants={staggerItem} className="w-full">
              {loading ? <SkeletonCard /> : <SpendingChart expenses={expenses} />}
            </motion.div>

            {/* Empty State */}
            {!loading && expenses.length === 0 && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="text-center py-12"
               >
                 <p className="text-4xl mb-4">🏜️</p>
                 <p className={`text-xl font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                   No data available.
                 </p>
                 <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                   Add some expenses on your Dashboard to populate your Analytics!
                 </p>
               </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
