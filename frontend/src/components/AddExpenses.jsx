import { useState } from "react";

export default function AddExpense({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, category, date }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message);
      }

      alert("Expense added");

      onAdd(); // refresh data

      setAmount("");
      setCategory("");
      setDate("");
    } catch (error) {
      console.error(error);
      alert("Error adding expense");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        Add Expense
      </button>
    </div>
  );
}
