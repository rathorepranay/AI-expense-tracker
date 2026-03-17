import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">Total Expenses</h2>
              <p className="text-2xl font-bold">₹0</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">This Month</h2>
              <p className="text-2xl font-bold">₹0</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">Top Category</h2>
              <p className="text-2xl font-bold">Food</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
