import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddExpense from "../components/AddExpenses";
import EditModal from "../components/EditModal";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:4000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) setExpenses(data);
      else toast.error(data.message);
    } catch {
      toast.error("Error fetching expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:4000/api/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Deleted");
    fetchExpenses();
  };

  const handleEdit = (exp) => {
    setSelectedExpense(exp);
    setIsModalOpen(true);
  };

  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const latest = expenses[expenses.length - 1];

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <motion.div
          className="p-6 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <AddExpense onAdd={fetchExpenses} />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { title: "Total Expenses", value: `₹${total}` },
              { title: "Entries", value: expenses.length },
              { title: "Latest", value: `₹${latest?.amount || 0}` },
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40"
              >
                <h2 className="text-gray-600">{card.title}</h2>
                <p className="text-2xl font-bold">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40">
            <h2 className="text-xl font-semibold mb-4">Expenses</h2>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>₹{exp.amount}</td>
                    <td>{exp.category}</td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="px-3 py-1 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expense={selectedExpense}
        onUpdate={fetchExpenses}
      />
    </div>
  );
}
