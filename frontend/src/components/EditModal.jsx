import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getAllCategories } from "../utils/categoryIcons";
import { glowEffect, staggerContainer, staggerItem } from "../utils/animations";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { scale: 0.5, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { scale: 0.5, opacity: 0, y: 20 },
};

export default function EditModal({ isOpen, onClose, expense, onUpdate }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = getAllCategories();

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount);
      setCategory(expense.category);
      setDate(expense.date?.split("T")[0]);
      setNote(expense.note || "");
    }
  }, [expense]);

  const handleUpdate = async () => {
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

      const res = await fetch(`http://localhost:4000/api/expenses/${expense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, category, date, note: note || "" }),
      });

      if (res.ok) {
        toast.success("✨ Expense updated!");
        onUpdate();
        onClose();
      } else {
        toast.error("Failed to update expense");
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

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              className="bg-gradient-to-br from-white via-emerald-50 to-teal-50 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/40"
            >
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {/* Header */}
                <motion.div variants={staggerItem} className="mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ✏️ Edit Expense
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Update your expense details
                  </p>
                </motion.div>

                {/* Amount Input */}
                <motion.div variants={staggerItem} className="mb-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Amount (₹)
                  </label>
                  <motion.input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                    className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80 backdrop-blur-sm transition"
                  />
                </motion.div>

                {/* Category Selector */}
                <motion.div variants={staggerItem} className="mb-4 relative">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Category
                  </label>
                  <motion.button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg bg-white/80 backdrop-blur-sm text-left flex items-center justify-between hover:bg-white/90 transition font-medium text-gray-700"
                  >
                    <span>{category || "Select Category"}</span>
                    <motion.span
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▼
                    </motion.span>
                  </motion.button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-lg border-2 border-emerald-300 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
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
                </motion.div>

                {/* Date Input */}
                <motion.div variants={staggerItem} className="mb-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Date
                  </label>
                  <motion.input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                    className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80 backdrop-blur-sm transition"
                  />
                </motion.div>

                {/* Note Input */}
                <motion.div variants={staggerItem} className="mb-6">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Note (Optional)
                  </label>
                  <motion.textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    whileFocus={{ scale: 1.02 }}
                    className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80 backdrop-blur-sm transition resize-none"
                    rows="2"
                  />
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  variants={staggerItem}
                  className="flex gap-3"
                >
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    onClick={handleUpdate}
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    {...glowEffect}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loading ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        ⏳
                      </motion.span>
                    ) : (
                      "Update ✨"
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
