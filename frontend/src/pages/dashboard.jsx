import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddExpense from "../components/AddExpenses";

export default function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);

  // 📌 Fetch expenses
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setExpenses(data);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 📌 Delete expense
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:4000/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  // 📌 Edit expense
  const handleEdit = async (exp) => {
    const newAmount = prompt("Enter new amount", exp.amount);
    if (!newAmount) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:4000/api/expenses/${exp.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: newAmount,
          category: exp.category,
          date: exp.date,
        }),
      });

      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  // 📊 Total calculation
  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        <div className="p-6">
          {/* Heading */}
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          {/* ➕ Add Expense */}
          <AddExpense onAdd={fetchExpenses} />

          {/* 📊 Stats */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">Total Expenses</h2>
              <p className="text-2xl font-bold">₹{total}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">Total Entries</h2>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">Latest Expense</h2>
              <p className="text-2xl font-bold">₹{expenses[0]?.amount || 0}</p>
            </div>
          </div>

          {/* 📋 Table */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Expenses</h2>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Amount</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b">
                    <td className="p-2">₹{exp.amount}</td>
                    <td className="p-2">{exp.category}</td>
                    <td className="p-2">{exp.date}</td>

                    <td className="p-2 space-x-3">
                      <button
                        onClick={() => navigate(`/edit/${exp.id}`)}
                        className="text-blue-500"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
