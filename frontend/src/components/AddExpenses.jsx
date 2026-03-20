import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { getAllCategories } from "../utils/categoryIcons";
import { useConfetti } from "./ConfettiTrigger";
import { scaleHover } from "../utils/animations";

export default function AddExpense({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const triggerConfetti = useConfetti();

  const categories = getAllCategories();

  const handleSubmit = async () => {
    if (!amount || !category || !date) {
      toast.error("Fill all required fields");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:4000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, category, date, note: note || "" }),
      });

      if (response.ok) {
        // Trigger confetti celebration
        triggerConfetti();

        // Show success toast
        toast.success("🎉 Expense added!", {
          icon: "✨",
        });

        // Reset form
        setAmount("");
        setCategory("");
        setNote("");
        setDate("");
        setIsDropdownOpen(false);

        // Callback to parent
        onAdd();
      } else {
        toast.error("Failed to add expense");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat.label);
    setIsDropdownOpen(false);
  };

  const quickCategories = categories.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">➕</span>
        <h2 className="font-bold text-lg text-gray-800">Add Expense</h2>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-1 block">
          Amount (₹)
        </label>
        <motion.input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm transition"
        />
      </div>

      {/* Category Selector */}
      <div className="mb-4 relative">
        <label className="text-sm font-semibold text-gray-700 mb-1 block">
          Category
        </label>
        <motion.button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg bg-white/80 backdrop-blur-sm text-left flex items-center justify-between hover:bg-white/90 transition font-medium text-gray-700"
        >
          <span>{category || "Select Category"}</span>
          <motion.span
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-lg border-2 border-purple-300 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
            >
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat.key}
                  onClick={() => handleCategorySelect(cat)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-gray-800 font-medium">{cat.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Category Buttons */}
      {category && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4"
        >
          <p className="text-xs text-gray-600 mb-2">Quick Select</p>
          <div className="flex flex-wrap gap-2">
            {quickCategories.map((cat) => (
              <motion.button
                key={cat.key}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(cat)}
                className="px-3 py-1 bg-white/70 rounded-full text-sm font-medium text-gray-700 border border-purple-300 hover:bg-purple-100 transition"
              >
                {cat.emoji} {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Date Input */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-1 block">
          Date
        </label>
        <motion.input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm transition"
        />
      </div>

      {/* Note Input */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-1 block">
          Note (Optional)
        </label>
        <motion.textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm transition resize-none"
          rows="2"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={loading}
        {...scaleHover}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition transform"
      >
        {loading ? (
          <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
            ⏳
          </motion.span>
        ) : (
          "✨ Add Expense ✨"
        )}
      </motion.button>
    </motion.div>
  );
}
