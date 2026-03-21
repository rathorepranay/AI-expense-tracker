import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useDarkMode } from "../context/DarkModeContext";
import {
  getDailySpendingTrend,
  getCategoryStats,
} from "../utils/gamification";
import { getCategoryColor } from "../utils/categoryIcons";

export default function SpendingChart({ expenses = [] }) {
  const { isDark } = useDarkMode();
  if (!expenses || expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40 text-center py-12"
      >
        <p className="text-gray-600">📊 Add expenses to see your spending trends!</p>
      </motion.div>
    );
  }

  const dailyData = getDailySpendingTrend(expenses);
  const categoryData = getCategoryStats(expenses);

  // Map category data to colors
  const chartColors = categoryData.map((cat) =>
    getCategoryColor(cat.category)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Daily Spending Bar Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          📈 Daily Spending Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #8b5cf6",
                borderRadius: "8px",
              }}
              formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
            />
            <Bar
              dataKey="amount"
              fill="url(#colorGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" />
                  <stop offset="95%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category Distribution Pie Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          🥧 Category Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ category, percent }) =>
                `${category} ${(percent * 100).toFixed(0)}%`
              }
              animationDuration={800}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
