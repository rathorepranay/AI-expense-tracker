import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../context/DarkModeContext";
import { getWeeklyBudget } from "../utils/gamification";
import { formatCurrency } from "../utils/currency";

export default function AiChatbot({ expenses = [] }) {
  const { isDark } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi there! I'm your Smart Savings Assistant. What would you like to know?" }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  const getHighestExpense = () => {
    if (expenses.length === 0) return "You haven't logged any expenses yet!";
    const highest = expenses.reduce((max, exp) => Number(exp.amount) > Number(max.amount) ? exp : max, expenses[0]);
    return `Your single largest expense is ${formatCurrency(highest.amount)} for ${highest.category} (${highest.note || 'No note'}).`;
  };

  const getHighestCategory = () => {
    if (expenses.length === 0) return "No expenses logged to analyze yet.";
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + Number(exp.amount);
    });
    
    let maxCategory = "";
    let maxAmount = -1;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > maxAmount) {
        maxAmount = amt;
        maxCategory = cat;
      }
    }
    
    let tip = "Try cutting back on non-essentials in this area.";
    if (maxCategory === "Food") tip = "Meal prepping can drastically reduce your food expenses!";
    if (maxCategory === "Entertainment") tip = "Consider looking for free local events instead of paid entertainment.";
    if (maxCategory === "Transport") tip = "Carpooling or taking public transit might save you a lot here.";
    if (maxCategory === "Shopping") tip = "Try the 24-hour rule before buying non-essential items.";
    
    return `You spend the most on ${maxCategory} (${formatCurrency(maxAmount)}). ${tip}`;
  };

  const checkWeeklyBudget = () => {
    if (expenses.length === 0) return "No expenses logged right now.";
    const budget = getWeeklyBudget();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const spentLast7Days = expenses
      .filter(exp => new Date(exp.date) >= oneWeekAgo)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
      
    if (spentLast7Days > budget) {
      return `⚠️ You've spent ${formatCurrency(spentLast7Days)} in the last 7 days, which is OVER your weekly budget of ${formatCurrency(budget)}. Time to tighten the belt!`;
    } else {
      return `✅ You're doing great! You've spent ${formatCurrency(spentLast7Days)} in the last 7 days, remaining securely under your ${formatCurrency(budget)} limit!`;
    }
  };

  const getRandomTip = () => {
    const tips = [
      "Pay yourself first: Put a percentage of your income into savings before spending.",
      "Track every penny: Being aware of your spending is the first step to saving.",
      "Cancel unused subscriptions: Review your bank statements for recurring, forgotten charges.",
      "Use the 50/30/20 rule: 50% Needs, 30% Wants, 20% Savings.",
      "Buy generic brands: They often have the same quality as name brands but cost much less.",
      "Automate your savings: Set up an automatic transfer on payday."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const handlePrompt = (type) => {
    let question = "";
    let answer = "";
    
    if (type === "highest") {
      question = "What is my highest expense?";
      answer = getHighestExpense();
    } else if (type === "category") {
      question = "Which category drains my wallet?";
      answer = getHighestCategory();
    } else if (type === "budget") {
      question = "Am I breaking my weekly budget?";
      answer = checkWeeklyBudget();
    } else if (type === "tip") {
      question = "Give me a random savings tip!";
      answer = getRandomTip();
    }
    
    addMessage("user", question);
    setTimeout(() => {
      addMessage("ai", answer);
      scrollToBottom();
    }, 500);
  };

  return (
    <>
      <div className={`fixed z-[90] transition-all duration-300 ${isOpen ? 'bottom-20 md:bottom-8 right-4 md:right-8' : 'bottom-20 md:bottom-8 right-4 md:right-8'}`}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50, originX: 1, originY: 1 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className={`w-[85vw] max-w-[350px] mb-4 flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'}`}
              style={{ height: '420px' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="font-bold leading-tight">Smart Assistant</h3>
                    <p className="text-xs text-emerald-100 leading-tight">Online</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:text-emerald-200 transition text-lg font-bold">✖</button>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {messages.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-none' : (isDark ? 'bg-slate-700 text-slate-200 rounded-bl-none' : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200')}`}>
                      <p className="text-sm font-medium leading-snug">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} className="h-1 lg:h-4" />
              </div>
              
              {/* Prompts Area */}
              <div className={`p-3 border-t ${isDark ? 'border-slate-700 bg-slate-900' : 'border-emerald-100 bg-emerald-50'} overflow-x-auto flex gap-2`} style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                <style>{`
                  div::-webkit-scrollbar { display: none; }
                `}</style>
                <button onClick={() => handlePrompt('highest')} className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold rounded-full transition shadow-sm border ${isDark ? 'bg-slate-800 text-emerald-400 border-emerald-900/50 hover:bg-slate-700' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>🔴 Highest Expense</button>
                <button onClick={() => handlePrompt('category')} className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold rounded-full transition shadow-sm border ${isDark ? 'bg-slate-800 text-teal-400 border-teal-900/50 hover:bg-slate-700' : 'bg-white text-teal-700 border-teal-200 hover:bg-teal-100'}`}>📊 Worst Category</button>
                <button onClick={() => handlePrompt('budget')} className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold rounded-full transition shadow-sm border ${isDark ? 'bg-slate-800 text-blue-400 border-blue-900/50 hover:bg-slate-700' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-100'}`}>⏱️ Weekly Budget?</button>
                <button onClick={() => handlePrompt('tip')} className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold rounded-full transition shadow-sm border ${isDark ? 'bg-slate-800 text-indigo-400 border-indigo-900/50 hover:bg-slate-700' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-100'}`}>💡 Random Tip</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Floating Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-2xl ${isOpen ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500' : 'hover:from-emerald-500 hover:to-teal-500'} transition-all duration-300 ml-auto border-4 ${isDark ? 'border-slate-900' : 'border-white'}`}
        >
          {isOpen ? <span className="text-xl">✖</span> : '🤖'}
        </motion.button>
      </div>
    </>
  );
}
