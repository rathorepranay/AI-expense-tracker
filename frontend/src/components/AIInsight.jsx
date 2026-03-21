import { motion } from "framer-motion";
import { getSpendingTip, getWeeklyTotal, getWeeklyBudget } from "../utils/gamification";
import { staggerItem } from "../utils/animations";

export default function AIInsight({ expenses = [] }) {
  const tip = getSpendingTip(expenses);
  const weeklyTotal = getWeeklyTotal(expenses);
  const remaining = Math.max(getWeeklyBudget() - weeklyTotal, 0);
  const percentageLeft = (remaining / getWeeklyBudget()) * 100;

  return (
    <motion.div
      variants={staggerItem}
      initial="initial"
      animate="animate"
      className="bg-gradient-to-r from-emerald-100 via-emerald-100 to-teal-100 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-emerald-200/50 mb-6"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-4xl flex-shrink-0"
        >
          🤖
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2">AI Insight</h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-base font-semibold mb-3 ${tip.color}`}
          >
            {tip.text}
          </motion.p>

          {/* Budget Status */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Weekly Remaining:</span>
              <span className="font-bold text-gray-800">
                ₹{remaining.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentageLeft}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`h-full rounded-full ${
                  percentageLeft > 50
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : percentageLeft > 25
                    ? "bg-gradient-to-r from-amber-400 to-amber-600"
                    : "bg-gradient-to-r from-red-400 to-red-600"
                }`}
              />
            </div>

            <p className="text-xs text-gray-600 mt-1">
              {percentageLeft > 0
                ? `You can still spend ₹${(getWeeklyBudget() * (percentageLeft / 100)).toFixed(0)} this week`
                : "Weekly budget exceeded! 📊"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
