import { motion } from "framer-motion";
import {
  calculateStreak,
  getWeeklyProgress,
  isGoalAchieved,
  getAchievements,
  WEEKLY_BUDGET,
} from "../utils/gamification";
import { staggerContainer, staggerItem, pulseScale } from "../utils/animations";

export default function GameStatus({ expenses = [] }) {
  const streak = calculateStreak(expenses);
  const progress = getWeeklyProgress(expenses, WEEKLY_BUDGET);
  const goalAchieved = isGoalAchieved(expenses, WEEKLY_BUDGET);
  const achievements = getAchievements(expenses);

  // Determine progress color
  const getProgressColor = () => {
    if (progress < 50) return "from-green-400 to-green-600";
    if (progress < 80) return "from-amber-400 to-amber-600";
    return "from-red-400 to-red-600";
  };

  const getProgressText = () => {
    if (progress < 50) return "text-green-600";
    if (progress < 80) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    >
      {/* Streak Card */}
      <motion.div
        variants={staggerItem}
        className="bg-gradient-to-br from-orange-100 to-red-100 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-orange-200/50 relative overflow-hidden"
      >
        {streak > 0 && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
            className="absolute -right-8 -top-8 text-6xl opacity-10"
          >
            🔥
          </motion.div>
        )}
        <div className="relative z-10">
          <p className="text-gray-700 text-sm font-semibold mb-2">
            Tracking Streak
          </p>
          <motion.h3
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-orange-600"
          >
            {streak}
          </motion.h3>
          <p className="text-xs text-gray-600 mt-1">
            {streak === 0
              ? "Start tracking today! 💪"
              : streak === 1
              ? "1 day tracked"
              : `${streak} days in a row`}
          </p>
        </div>
      </motion.div>

      {/* Weekly Budget Card */}
      <motion.div
        variants={staggerItem}
        className="bg-gradient-to-br from-blue-100 to-purple-100 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-blue-200/50"
      >
        <p className="text-gray-700 text-sm font-semibold mb-4">
          Weekly Budget
        </p>

        {/* Circular Progress */}
        <div className="flex items-center justify-center mb-4 relative w-32 h-32 mx-auto">
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={`url(#gradient-${progress})`}
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 282.7 }}
              animate={{
                strokeDashoffset: 282.7 - (282.7 * progress) / 100,
              }}
              transition={{ duration: 0.8 }}
              strokeDasharray="282.7"
            />
            <defs>
              <linearGradient id={`gradient-${progress}`} x1="0%" y1="0%">
                <stop
                  offset="0%"
                  stopColor={
                    progress < 50
                      ? "#10b981"
                      : progress < 80
                      ? "#f59e0b"
                      : "#ef4444"
                  }
                />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className={`text-2xl font-bold ${getProgressText()}`}>
              {Math.round(progress)}%
            </span>
            <span className="text-xs text-gray-600">of budget</span>
          </div>
        </div>

        <p className="text-xs text-center text-gray-600">
          Target: ₹{WEEKLY_BUDGET.toLocaleString("en-IN")}
        </p>

        {goalAchieved && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="mt-2 text-center"
          >
            <span className="text-xl">👑</span>
            <p className="text-sm text-green-600 font-semibold">Budget Master!</p>
          </motion.div>
        )}
      </motion.div>

      {/* Achievements Card */}
      <motion.div
        variants={staggerItem}
        className="bg-gradient-to-br from-yellow-100 to-pink-100 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-yellow-200/50"
      >
        <p className="text-gray-700 text-sm font-semibold mb-3">Achievements</p>

        {achievements.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {achievements.slice(0, 3).map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md border-2 border-yellow-300 hover:scale-110 transition"
                title={achievement.title}
              >
                <span className="text-xl">{achievement.icon}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            🎯 Unlock achievements by tracking expenses!
          </p>
        )}

        {achievements.length > 3 && (
          <p className="text-xs text-gray-600 mt-2">
            +{achievements.length - 3} more achievements
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
