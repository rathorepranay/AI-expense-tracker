import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getExpenses, updateExpense, deleteExpense } from '../utils/storage';
import { Expense, CATEGORIES, PAYMENT_METHODS } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const EditExpenseScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const expenses = getExpenses();
    const expense = expenses.find(e => e.id === id);
    
    if (expense) {
      setAmount(expense.amount.toString());
      setDescription(expense.description);
      setCategory(expense.category);
      setPaymentMethod(expense.paymentMethod);
      setDate(expense.date);
      setUserId(expense.userId);
    } else {
      navigate('/expenses');
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum)) {
      setError('Please enter a valid amount');
      return;
    }

    if (amountNum <= 0) {
      setError('Please enter a number greater than zero');
      return;
    }

    const updatedExpenseData: Expense = {
      id: id!,
      amount: amountNum,
      description: description.trim(),
      category,
      paymentMethod,
      date,
      userId,
    };

    updateExpense(id!, updatedExpenseData);
    toast.success('Expense updated successfully!');
    navigate('/expenses');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id!);
      toast.success('Expense deleted');
      navigate('/expenses');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/expenses')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Edit Expense</h1>
          </div>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Amount */}
        <div>
          <Label htmlFor="amount">Amount *</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
              ₹
            </span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8 text-2xl h-14"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description *</Label>
          <Input
            id="description"
            type="text"
            placeholder="What did you buy?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method */}
        <div>
          <Label htmlFor="payment">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="mt-1"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
        >
          Update Expense
        </Button>
      </form>
    </div>
  );
};
