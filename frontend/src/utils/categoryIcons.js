// Category configuration with icons, colors, and emojis
import {
  FaUtensils,
  FaBus,
  FaFilm,
  FaDumbbell,
  FaShoppingBag,
  FaPlane,
  FaHeart,
  FaBook,
  FaHome,
  FaGamepad,
  FaMusic,
  FaWalking,
  FaHeartbeat,
  FaTools,
  FaWifi,
  FaCreditCard,
  FaGraduationCap,
} from "react-icons/fa";

export const categoryConfig = {
  food: {
    label: "Food & Dining",
    icon: FaUtensils,
    color: "#10b981",
    bgColor: "bg-green-100",
    emoji: "🍔",
  },
  transport: {
    label: "Transport",
    icon: FaBus,
    color: "#3b82f6",
    bgColor: "bg-blue-100",
    emoji: "🚕",
  },
  entertainment: {
    label: "Entertainment",
    icon: FaFilm,
    color: "#8b5cf6",
    bgColor: "bg-purple-100",
    emoji: "🎬",
  },
  fitness: {
    label: "Fitness & Health",
    icon: FaDumbbell,
    color: "#ef4444",
    bgColor: "bg-red-100",
    emoji: "💪",
  },
  shopping: {
    label: "Shopping",
    icon: FaShoppingBag,
    color: "#f59e0b",
    bgColor: "bg-amber-100",
    emoji: "🛍️",
  },
  travel: {
    label: "Travel",
    icon: FaPlane,
    color: "#06b6d4",
    bgColor: "bg-cyan-100",
    emoji: "✈️",
  },
  health: {
    label: "Medical",
    icon: FaHeart,
    color: "#ec4899",
    bgColor: "bg-pink-100",
    emoji: "🏥",
  },
  education: {
    label: "Education",
    icon: FaBook,
    color: "#6366f1",
    bgColor: "bg-indigo-100",
    emoji: "📚",
  },
  utilities: {
    label: "Utilities",
    icon: FaHome,
    color: "#71717a",
    bgColor: "bg-zinc-100",
    emoji: "🏠",
  },
  gaming: {
    label: "Gaming",
    icon: FaGamepad,
    color: "#8b5cf6",
    bgColor: "bg-purple-100",
    emoji: "🎮",
  },
  music: {
    label: "Music & Audio",
    icon: FaMusic,
    color: "#ec4899",
    bgColor: "bg-pink-100",
    emoji: "🎵",
  },
  sports: {
    label: "Sports",
    icon: FaWalking,
    color: "#10b981",
    bgColor: "bg-green-100",
    emoji: "⚽",
  },
  subscription: {
    label: "Subscription",
    icon: FaWifi,
    color: "#f59e0b",
    bgColor: "bg-amber-100",
    emoji: "📱",
  },
  groceries: {
    label: "Groceries",
    icon: FaShoppingBag,
    color: "#10b981",
    bgColor: "bg-green-100",
    emoji: "🛒",
  },
  rent: {
    label: "Rent",
    icon: FaHome,
    color: "#71717a",
    bgColor: "bg-zinc-100",
    emoji: "🏘️",
  },
  other: {
    label: "Other",
    icon: FaWalking,
    color: "#6b7280",
    bgColor: "bg-gray-100",
    emoji: "💫",
  },
};

export const getCategoryConfig = (category) => {
  if (!category) return categoryConfig.other;
  const key = category.toLowerCase().replace(/\s+/g, "");

  // Try exact match
  if (categoryConfig[key]) return categoryConfig[key];

  // Try partial match
  for (let [k, v] of Object.entries(categoryConfig)) {
    if (category.toLowerCase().includes(k)) return v;
  }

  return categoryConfig.other;
};

export const getCategoryColor = (category) => {
  return getCategoryConfig(category).color;
};

export const getCategoryIcon = (category) => {
  return getCategoryConfig(category).icon;
};

export const getCategoryEmoji = (category) => {
  return getCategoryConfig(category).emoji;
};

export const getAllCategories = () => {
  return Object.values(categoryConfig).map((cat, idx) => ({
    key: Object.keys(categoryConfig)[idx],
    ...cat,
  }));
};
