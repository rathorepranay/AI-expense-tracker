export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg p-5">
      <h2 className="text-xl font-bold mb-8">💰 ExpenseAI</h2>

      <ul className="space-y-4">
        <li className="cursor-pointer hover:text-purple-600">Dashboard</li>
        <li className="cursor-pointer hover:text-purple-600">Expenses</li>
        <li className="cursor-pointer hover:text-purple-600">Analytics</li>
      </ul>
    </div>
  );
}
