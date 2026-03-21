import { motion } from "framer-motion";
import { useDarkMode } from "../context/DarkModeContext";
import { getCategoryEmoji } from "../utils/categoryIcons";

export default function TopExpenses({ expenses = [] }) {
  const { isDark } = useDarkMode();

  if (!expenses || expenses.length === 0) return null;

  // Sort descending by amount, take top 5
  const topExpenses = [...expenses]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className={`p-6 rounded-2xl shadow-xl backdrop-blur-lg border h-full ${
        isDark ? "bg-slate-800/50 border-slate-700" : "bg-white/70 border-white/40"
      }`}
    >
      <div className="mb-6">
        <h3 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-800"}`}>
          🔥 Top 5 Expenses
        </h3>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          Your largest transactions.
        </p>
      </div>

      <div className="space-y-4">
        {topExpenses.map((exp, idx) => (
          <motion.div
            key={exp.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02] cursor-default ${
              isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-white/60 hover:bg-white shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl ${
                isDark ? "bg-slate-800" : "bg-purple-100 shadow-inner"
              }`}>
                {getCategoryEmoji(exp.category)}
              </div>
              <div>
                <p className={`font-semibold ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                  {exp.category}
                </p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"} truncate max-w-[120px]`}>
                  {exp.note || "No note provided"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 text-lg">
                ₹{Number(exp.amount).toLocaleString("en-IN")}
              </p>
              <p className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                {new Date(exp.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
