import { motion } from "framer-motion";
import {
  getCategoryIcon,
  getCategoryColor,
  getCategoryEmoji,
  getCategoryConfig,
} from "../utils/categoryIcons";
import { staggerItem } from "../utils/animations";

export default function CategoryCard({ category, total, count }) {
  const config = getCategoryConfig(category);
  const Icon = config.icon;
  const color = getCategoryColor(category);

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.05 }}
      className={`${config.bgColor} backdrop-blur-lg p-4 rounded-xl shadow-md border border-white/40 transition-all`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={24} color={color} />
        </div>
        <h4 className="font-semibold text-gray-800 flex-1">
          {config.label}
        </h4>
        <span className="text-xl">{config.emoji}</span>
      </div>

      <div className="flex justify-between">
        <p className="text-sm text-gray-600">
          ₹{total.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>
    </motion.div>
  );
}
