import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useDarkMode } from "../context/DarkModeContext";
import { formatCurrency } from "../utils/currency";

export default function CumulativeAreaChart({ expenses = [] }) {
  const { isDark } = useDarkMode();

  if (!expenses || expenses.length === 0) {
    return null;
  }

  // 1. Sort ascending by date
  const sorted = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

  // 2. Compute cumulative aggregate per day
  const dailyCumulative = {};
  let totalSoFar = 0;

  sorted.forEach((exp) => {
    const dateObj = new Date(exp.date);
    const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    totalSoFar += Number(exp.amount);
    dailyCumulative[dateStr] = totalSoFar;
  });

  const chartData = Object.entries(dailyCumulative).map(([date, cumulativeTotal]) => ({
    date,
    total: cumulativeTotal,
  }));

  // Ensure there are at least two points to draw a beautiful area
  if (chartData.length === 1) {
    chartData.unshift({ date: "Start", total: 0 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className={`p-6 rounded-2xl shadow-xl backdrop-blur-lg border ${
        isDark ? "bg-slate-800/50 border-slate-700" : "bg-white/70 border-white/40"
      }`}
    >
      <div className="mb-6">
        <h3 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-800"}`}>
          🏂 Cumulative Spending
        </h3>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          Your total spending growth over time.
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e5e7eb"} vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke={isDark ? "#94a3b8" : "#6b7280"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke={isDark ? "#94a3b8" : "#6b7280"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#fff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                color: isDark ? "#f8fafc" : "#1f2937"
              }}
              itemStyle={{ color: "#ec4899", fontWeight: "bold" }}
              formatter={(value) => [formatCurrency(value), "Total Spent"]}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
