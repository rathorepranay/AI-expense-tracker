import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function EditModal({ isOpen, onClose, expense, onUpdate }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount);
      setCategory(expense.category);
      setDate(expense.date?.split("T")[0]);
    }
  }, [expense]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:4000/api/expenses/${expense.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, category, date }),
    });

    toast.success("Updated");
    onUpdate();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-blue-900/40 backdrop-blur-md flex items-center justify-center">
          <motion.div
            className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl w-96 shadow-2xl border border-white/30"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.7 }}
          >
            <h2 className="text-xl font-bold mb-4">Edit Expense</h2>

            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mb-2 p-2 border rounded focus:ring-pink-400"
            />

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mb-2 p-2 border rounded focus:ring-pink-400"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-between">
              <button onClick={onClose}>Cancel</button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded"
              >
                Update
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
