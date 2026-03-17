import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getExpenses } from '../utils/storage';
import { generateInsights } from '../utils/ai';
import { Expense } from '../types';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, TrendingUp, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF6384',
  Transport: '#36A2EB',
  Shopping: '#FFCE56',
  Bills: '#4BC0C0',
  Entertainment: '#9966FF',
  Health: '#FF9F40',
  Other: '#C9CBCF',
};

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
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

  // Category data for pie chart
  const categoryData = monthExpenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Weekly trend data
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyData = daysOfWeek.map(day => {
    const dayExpenses = monthExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      day: format(day, 'EEE'),
      amount: total,
    };
  });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  if (monthExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No expenses yet</h2>
          <p className="text-gray-600 mb-8">
            Add your first expense to start tracking and see AI-powered insights
          </p>
          <Button 
            onClick={() => navigate('/add-expense')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
        <h1 className="text-xl mb-4">
          Hello, {user?.email.split('@')[0]}! 👋
        </h1>
        
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

      <div className="p-4 space-y-4">
        {/* Monthly Expense Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 border-0">
          <div className="text-sm text-gray-600 mb-1">Total spent this month</div>
          <div className="text-4xl font-bold text-gray-900">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {monthExpenses.length} transaction{monthExpenses.length !== 1 ? 's' : ''}
          </div>
        </Card>

        {/* AI Insight Card */}
        {insights.length > 0 && (
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-0">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">AI Insight</div>
                <div className="text-sm text-gray-700">
                  {insights[0]}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Category Spending Chart */}
        {categoryData.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Category Breakdown</h3>
              <button
                onClick={() => navigate('/insights')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View Details
              </button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
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
          </Card>
        )}

        {/* Weekly Trend Chart */}
        <Card className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            onClick={() => navigate('/add-expense')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
          <Button 
            onClick={() => navigate('/expenses')}
            variant="outline"
          >
            View All
          </Button>
        </div>
      </div>
    </div>
  );
};