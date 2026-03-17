import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getExpenses } from '../utils/storage';
import { generateInsights } from '../utils/ai';
import { Expense } from '../types';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Card } from '../components/ui/card';
import { ChevronLeft, ChevronRight, TrendingUp, Lightbulb, ArrowLeft } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF6384',
  Transport: '#36A2EB',
  Shopping: '#FFCE56',
  Bills: '#4BC0C0',
  Entertainment: '#9966FF',
  Health: '#FF9F40',
  Other: '#C9CBCF',
};

export const InsightsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = () => {
    const allExpenses = getExpenses();
    setExpenses(allExpenses);
    setInsights(generateInsights(allExpenses));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const monthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });

  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Category data
  const categoryData = monthExpenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]).sort((a, b) => b.value - a.value);

  // Daily spending for the month
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const dailyData = daysInMonth.map(day => {
    const dayExpenses = monthExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      date: format(day, 'dd'),
      amount: total,
    };
  });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to expenses filtered by category
    navigate('/expenses');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/20 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Insights</h1>
        </div>
        
        {/* Month Selector */}
        <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
          <button onClick={previousMonth} className="p-1 hover:bg-white/20 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-white/20 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-6">
        {/* Total Spending */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 border-0">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <div className="text-sm text-gray-600">Total Spending</div>
          </div>
          <div className="text-4xl font-bold text-gray-900">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {monthExpenses.length} transaction{monthExpenses.length !== 1 ? 's' : ''}
          </div>
        </Card>

        {/* Category Breakdown Chart */}
        {categoryData.length > 0 && (
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>

            {/* Category List */}
            <div className="space-y-2 mt-4">
              {categoryData.map((cat) => {
                const percentage = Math.round((cat.value / totalSpent) * 100);
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: CATEGORY_COLORS[cat.name] }}
                      />
                      <span className="font-medium">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{cat.value.toLocaleString('en-IN')}</div>
                      <div className="text-sm text-gray-500">{percentage}%</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Monthly Trend Chart */}
        {dailyData.length > 0 && (
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Daily Spending</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* AI Insights Summary */}
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-0">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900">AI Insights</h3>
          </div>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};