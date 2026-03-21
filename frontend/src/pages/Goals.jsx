import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useDarkMode } from "../context/DarkModeContext";
import { pageTransition, staggerItem, staggerContainer } from "../utils/animations";

export default function Goals() {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Goal State
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/goals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setGoals(data);
      else toast.error(data.message || "Failed to load goals");
    } catch {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, 
          target_amount: target, 
          deadline: deadline || null 
        })
      });
      if (res.ok) {
        toast.success("🎯 Goal created!");
        setIsAddOpen(false);
        setTitle("");
        setTarget("");
        setDeadline("");
        fetchGoals();
      } else {
        const data = await res.json();
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to create goal");
    }
  };

  const handleAddProgress = async (id, amount) => {
    const inputAmount = window.prompt("Enter savings amount to add to this goal:");
    if (!inputAmount || isNaN(inputAmount) || inputAmount <= 0) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/goals/${id}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(inputAmount) })
      });
      if (res.ok) {
        toast.success("💸 Progress saved!");
        fetchGoals();
      } else {
        toast.error("Failed to update progress");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Goal deleted");
        fetchGoals();
      } else {
        toast.error("Failed to delete goal");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className={`flex h-screen ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-emerald-200 via-teal-100 to-blue-200"} overflow-hidden`}>
      <Sidebar />
      <BottomNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <motion.div
           variants={pageTransition}
           initial="initial"
           animate="animate"
           className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 space-y-6"
        >
          <motion.div variants={staggerItem} className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                🎯 Savings Goals
              </h1>
              <p className={`mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Set targets and track your progress
              </p>
            </div>
            <button 
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
            >
              + New Goal
            </button>
          </motion.div>

          {loading ? (
            <div className="mt-8 text-center"><p className={isDark ? "text-slate-400" : "text-gray-500"}>Loading goals...</p></div>
          ) : goals.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🏆</p>
              <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>No goals yet</h3>
              <p className={`mt-2 ${isDark ? "text-slate-400" : "text-gray-600"}`}>Create your first goal to start saving!</p>
            </div>
          ) : (
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map(goal => {
                const percentage = Math.min(100, Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100));
                const isComplete = percentage >= 100;
                
                return (
                  <motion.div key={goal.id} variants={staggerItem} className={`p-6 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-lg border ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white/90 border-emerald-100"}`}>
                    {isComplete && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">COMPLETED 🎉</div>}
                    
                    <h3 className={`text-xl font-bold mb-1 max-w-[80%] ${isDark ? "text-white" : "text-gray-800"}`}>{goal.title}</h3>
                    {goal.deadline && (
                      <p className={`text-xs mb-4 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                        Target Date: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="my-6 relative flex justify-center items-center">
                      <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
                        <path className={`${isDark ? "text-slate-700" : "text-emerald-100"}`} stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={`${isComplete ? "text-yellow-400" : "text-emerald-500"}`} strokeDasharray={`${percentage}, 100`} stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{percentage}%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>Current</p>
                        <p className={`font-bold ${isDark ? "text-white" : "text-gray-800"}`}>₹{Number(goal.current_amount).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>Target</p>
                        <p className={`font-bold ${isDark ? "text-white" : "text-gray-800"}`}>₹{Number(goal.target_amount).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleAddProgress(goal.id)}
                         disabled={isComplete}
                         className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${isComplete ? (isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400') + ' cursor-not-allowed' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'}`}
                       >
                         ➕ Add Funds
                       </button>
                       <button 
                         onClick={() => handleDelete(goal.id)}
                         className={`px-3 py-2 rounded-lg transition ${isDark ? 'bg-red-900/50 hover:bg-red-800 text-red-400' : 'bg-red-100 hover:bg-red-200 text-red-600'}`}
                       >
                         🗑️
                       </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

        </motion.div>
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Create New Goal</h2>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Goal Title</label>
                  <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dream Vacation" className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-emerald-500 outline-none`} />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Target Amount (₹)</label>
                  <input required type="number" min="1" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="50000" className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-emerald-500 outline-none`} />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Target Deadline (Optional)</label>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-emerald-500 outline-none`} />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setIsAddOpen(false)} className={`flex-1 py-2 rounded-lg font-semibold transition ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition">Create Goal</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
