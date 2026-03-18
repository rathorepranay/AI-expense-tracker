import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AddExpense({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    if (!amount || !category || !date) {
      toast.error("Fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    await fetch("http://localhost:4000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, category, date }),
    });

    toast.success("Added");
    onAdd();

    setAmount("");
    setCategory("");
    setDate("");
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40">
      <h2 className="mb-4 font-semibold">Add Expense</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="p-2 border rounded focus:ring-pink-400"
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="p-2 border rounded focus:ring-pink-400"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <motion.button
        onClick={handleSubmit}
        whileHover={{ scale: 1.05 }}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded"
      >
        Add
      </motion.button>
    </div>
  );
}
