import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setExpenses(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">Total Expenses</h2>
              <p className="text-2xl font-bold">
                ₹{expenses.reduce((acc, e) => acc + Number(e.amount), 0)}
              </p>
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

          {/* Table */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b">
                    <td>₹{exp.amount}</td>
                    <td>{exp.category}</td>
                    <td>{exp.date}</td>
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
