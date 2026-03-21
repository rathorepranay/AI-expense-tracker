import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  // 📌 Fetch existing data
  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:4000/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setAmount(data.amount);
      setCategory(data.category);
      setDate(data.date);
    } catch (error) {
      console.error(error);
    }
  };

  // 📌 Update expense
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:4000/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          category,
          date,
        }),
      });

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      alert("Updated successfully");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Expense</h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-emerald-600 text-white py-2 rounded"
        >
          Update Expense
        </button>
      </div>
    </div>
  );
}
