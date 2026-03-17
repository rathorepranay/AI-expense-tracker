import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { saveExpense } from '../utils/storage';
import { suggestCategory } from '../utils/ai';
import { Expense, CATEGORIES, PAYMENT_METHODS } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const AddExpenseScreen: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [error, setError] = useState('');

  useEffect(() => {
    if (description.length > 3) {
      const suggested = suggestCategory(description);
      setSuggestedCategory(suggested);
      if (!category) {
        setCategory(suggested);
      }
    }
  }, [description]);

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

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      amount: amountNum,
      description: description.trim(),
      category: category || 'Other',
      paymentMethod,
      date,
      userId: user?.id || '',
    };

    saveExpense(expense);
    toast.success('Expense added successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Add Expense</h1>
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
              autoFocus
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
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="category">Category *</Label>
            {suggestedCategory && (
              <span className="text-xs text-purple-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI suggested: {suggestedCategory}
              </span>
            )}
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
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
          Save Expense
        </Button>
      </form>
    </div>
  );
};
