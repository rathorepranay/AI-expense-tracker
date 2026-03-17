import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getExpenses, deleteExpense } from '../utils/storage';
import { Expense, CATEGORIES } from '../types';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Trash2, Edit, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';

const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔',
  Transport: '🚗',
  Shopping: '🛍️',
  Bills: '📄',
  Entertainment: '🎬',
  Health: '💊',
  Other: '📦',
};

export const ExpensesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadExpenses();
  }, [currentDate, filterCategory]);

  const loadExpenses = () => {
    const allExpenses = getExpenses();
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    let filtered = allExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });

    if (filterCategory !== 'all') {
      filtered = filtered.filter(e => e.category === filterCategory);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setExpenses(filtered);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
      toast.success('Expense deleted');
      loadExpenses();
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  if (expenses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <h1 className="text-xl font-bold">Expenses</h1>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No expenses recorded</h2>
            <p className="text-gray-600 mb-8">
              Add an expense to start tracking.
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b p-4 space-y-4">
        <h1 className="text-xl font-bold">Expenses</h1>
        
        {/* Month Selector */}
        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
          <button onClick={previousMonth} className="p-1 hover:bg-gray-200 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-200 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expense List */}
      <div className="p-4 space-y-2">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl">{CATEGORY_ICONS[expense.category]}</div>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{expense.description}</div>
              <div className="text-sm text-gray-500">
                {expense.category} • {format(new Date(expense.date), 'MMM dd, yyyy')}
              </div>
            </div>

            <div className="text-right flex items-center gap-2">
              <div>
                <div className="font-bold text-gray-900">
                  ₹{expense.amount.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-gray-500">{expense.paymentMethod}</div>
              </div>
              
              <button
                onClick={() => navigate(`/edit-expense/${expense.id}`)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              
              <button
                onClick={() => handleDelete(expense.id)}
                className="p-2 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/add-expense')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
