import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import AddExpense from "../components/AddExpenses";
import EditModal from "../components/EditModal";
import GameStatus from "../components/GameStatus";
import AiChatbot from "../components/AiChatbot";
import CategoryCard from "../components/CategoryCard";
import { SkeletonCard, SkeletonTable } from "../components/SkeletonLoader";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getCategoryEmoji } from "../utils/categoryIcons";
import { useDarkMode } from "../context/DarkModeContext";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
  slideOut,
} from "../utils/animations";
import { getCategoryStats } from "../utils/gamification";
import { formatCurrency } from "../utils/currency";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark } = useDarkMode();

  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
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
      } else toast.error(data.message);
    } catch {
      toast.error("Error fetching expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:4000/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("✨ Expense deleted!");
        fetchExpenses();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (exp) => {
    setSelectedExpense(exp);
    setIsModalOpen(true);
  };

  const categoryStats = getCategoryStats(expenses);

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              💰 Expense Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Track and analyze your spending</p>
          </motion.div>

          {/* Add Expense Form */}
          <motion.div variants={staggerItem}>
            <AddExpense onAdd={fetchExpenses} />
          </motion.div>

          {/* Gamification Status */}
          <motion.div variants={staggerItem}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <GameStatus expenses={expenses} />
            )}
          </motion.div>

          {/* Category Stats */}
          {categoryStats.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="mb-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📊 Spending by Category
              </h2>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {categoryStats.map((stat) => (
                  <motion.div key={stat.category} variants={staggerItem}>
                    <CategoryCard
                      category={stat.category}
                      total={stat.total}
                      count={stat.count}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Expenses Table */}
          {expenses.length > 0 && (
            <motion.div
              variants={staggerItem}
              className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                📋 Recent Expenses
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-emerald-300">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        Note
                      </th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {expenses.map((exp, idx) => (
                        <motion.tr
                          key={exp.id}
                          variants={slideOut}
                          initial={{ opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 300 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-gray-200 hover:bg-white/50 transition"
                        >
                          <td className="py-3 px-2 text-gray-700">
                            {new Date(exp.date).toLocaleDateString("en-IN")}
                          </td>
                          <td className="py-3 px-2">
                            <span className="flex items-center gap-2">
                              <span className="text-lg">
                                {getCategoryEmoji(exp.category)}
                              </span>
                              <span className="text-gray-700">{exp.category}</span>
                            </span>
                          </td>
                          <td className="py-3 px-2 font-bold text-emerald-600">
                            {formatCurrency(exp.amount)}
                          </td>
                          <td className="py-3 px-2 text-gray-600 truncate max-w-xs">
                            {exp.note || "—"}
                          </td>
                          <td className="py-3 px-2 text-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(exp)}
                              className="px-3 py-1 bg-gradient-to-r from-blue-400 to-emerald-500 text-white rounded-lg hover:shadow-lg transition"
                            >
                              ✏️
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(exp.id)}
                              className="px-3 py-1 bg-gradient-to-r from-red-400 to-teal-500 text-white rounded-lg hover:shadow-lg transition"
                            >
                              🗑️
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && expenses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <p className="text-2xl mb-2">📝</p>
              <p className="text-gray-600 font-medium">
                No expenses yet. Add your first expense to get started!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expense={selectedExpense}
        onUpdate={fetchExpenses}
      />
      <AiChatbot expenses={expenses} />
    </div>
  );
}
