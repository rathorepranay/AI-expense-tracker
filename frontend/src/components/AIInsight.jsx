import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getWeeklyBudget } from "../utils/gamification";
import { staggerItem } from "../utils/animations";
import { useDarkMode } from "../context/DarkModeContext";

export default function AIInsight({ expenses = [] }) {
  const { isDark } = useDarkMode();
  const [advice, setAdvice] = useState("");
  const [prediction, setPrediction] = useState("");
  const [isML, setIsML] = useState(false);
  const [loadingML, setLoadingML] = useState(false);
  
  // Explicitly fetch budget inline so it stays hot 
  const budget = getWeeklyBudget();

  useEffect(() => {
    if (expenses.length === 0) {
      setAdvice("Start logging expenses to receive personalized AI financial advice!");
      setPrediction("Add at least one week of data to see your future predictions.");
      return;
    }

    // 1. AI Advice based on worst category in last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentExpenses = expenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
    
    if (recentExpenses.length === 0) {
      setAdvice("You haven't spent anything in the last 30 days—great job saving!");
    } else {
      const catTotals = {};
      recentExpenses.forEach(e => {
        catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount);
      });
      const topCategory = Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b);
      
      const tips = {
        Food: "Consider meal prepping on Sundays to instantly cut your food costs.",
        Shopping: "Try the 24-hour rule: wait a full day before buying non-essential items.",
        Transport: "Carpooling or evaluating monthly transit passes could lower your travel costs.",
        Entertainment: "Look for free local events or park days instead of paid entertainment."
      };
      const tip = tips[topCategory] || "Reviewing this category closely could yield major savings.";
      
      setAdvice(`In the last 30 days, your biggest drain was ${topCategory} (₹${catTotals[topCategory].toLocaleString('en-IN')}). ${tip}`);
    }

    // 2. Predict next week budget and expenses using the Backend ML Model
    const fetchMLPrediction = async () => {
      try {
        setLoadingML(true);
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/ml/predict", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok) {
           setIsML(data.isML);
           const predictedSpend = data.prediction;
           const diff = budget - predictedSpend;
           
           if (!data.isML) {
             setPrediction(data.message); // Not enough data
           } else if (diff >= 0) {
             setPrediction(`The ML Model forecasts you will spend ₹${predictedSpend.toLocaleString('en-IN')} next week based on your trajectory. You are on track to save ₹${diff.toFixed(0)} under your budget!`);
           } else {
             setPrediction(`The ML Model forecasts you will spend ₹${predictedSpend.toLocaleString('en-IN')} next week, which exceeds your budget by ₹${Math.abs(diff).toFixed(0)}. Try trimming your Weakest Category.`);
           }
        }
      } catch (error) {
         setPrediction("ML Model is temporarily unavailable. Please try again later.");
      } finally {
         setLoadingML(false);
      }
    };

    if (expenses.length > 0) {
      fetchMLPrediction();
    }
  }, [expenses, budget]);

  return (
    <motion.div
      variants={staggerItem}
      initial="initial"
      animate="animate"
      className={`p-6 rounded-2xl shadow-xl backdrop-blur-lg border mb-6 transition-colors duration-500 ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-emerald-100'}`}
    >
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-5xl flex-shrink-0"
        >
          🧠
        </motion.div>

        {/* Content */}
        <div className="flex-1 w-full mt-2 md:mt-0">
          <h3 className={`text-xl font-extrabold mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
            AI Financial Insights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Advice Section */}
             <div className={`p-4 rounded-xl shadow-sm ${isDark ? 'bg-slate-700/50' : 'bg-white/80'} border ${isDark ? 'border-slate-600' : 'border-white'}`}>
                <h4 className={`text-sm font-bold flex items-center gap-2 mb-2 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                  <span className="text-lg">💡</span> Actionable Advice
                </h4>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  {advice}
                </p>
             </div>

             {/* Prediction Section */}
             <div className={`p-4 rounded-xl shadow-sm relative overflow-hidden ${isDark ? 'bg-teal-900/40' : 'bg-teal-50'} border ${isDark ? 'border-teal-800/50' : 'border-teal-200'}`}>
                {isML && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg tracking-wider">
                    ML POWERED
                  </div>
                )}
                <h4 className={`text-sm font-bold flex items-center gap-2 mb-2 ${isDark ? 'text-teal-400' : 'text-teal-800'}`}>
                  <span className="text-lg">🔮</span> Next Week Forecast
                </h4>
                {loadingML ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2 py-1">
                      <div className={`h-2 rounded ${isDark ? 'bg-teal-700/50' : 'bg-teal-200'}`}></div>
                      <div className={`h-2 rounded w-5/6 ${isDark ? 'bg-teal-700/50' : 'bg-teal-200'}`}></div>
                    </div>
                  </div>
                ) : (
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-teal-100' : 'text-teal-800'}`}>
                    {prediction}
                  </p>
                )}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
