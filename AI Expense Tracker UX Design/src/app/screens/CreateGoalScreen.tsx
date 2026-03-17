import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { saveGoal } from '../utils/storage';
import { suggestMonthlySavings } from '../utils/ai';
import { Goal } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { toast } from 'sonner';

export const CreateGoalScreen: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState(format(addMonths(new Date(), 6), 'yyyy-MM-dd'));
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(targetAmount);

    if (!name.trim()) {
      setError('Please enter a goal name');
      return;
    }

    if (!targetAmount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid target amount');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      name: name.trim(),
      targetAmount: amountNum,
      savedAmount: 0,
      targetDate,
      userId: user?.id || '',
    };

    saveGoal(goal);

    // Calculate and show AI suggestion
    const monthlySavings = suggestMonthlySavings(amountNum, targetDate);
    setSuggestion(`To reach this goal, save ₹${monthlySavings.toLocaleString('en-IN')} per month`);
    
    setTimeout(() => {
      toast.success('Goal created successfully!');
      navigate('/goals');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate('/goals')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Create Savings Goal</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Goal Name */}
        <div>
          <Label htmlFor="name">Goal Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Vacation Fund, New Laptop"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
            autoFocus
          />
        </div>

        {/* Target Amount */}
        <div>
          <Label htmlFor="amount">Target Amount *</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
              ₹
            </span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="pl-8 text-2xl h-14"
            />
          </div>
        </div>

        {/* Target Date */}
        <div>
          <Label htmlFor="date">Target Date *</Label>
          <Input
            id="date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="mt-1"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {suggestion && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">AI Suggestion</div>
                <div className="text-sm text-gray-700">{suggestion}</div>
              </div>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
        >
          Create Goal
        </Button>
      </form>
    </div>
  );
};
