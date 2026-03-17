import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getGoals } from '../utils/storage';
import { Goal } from '../types';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Plus, Target } from 'lucide-react';
import { format } from 'date-fns';

export const GoalsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const allGoals = getGoals();
    setGoals(allGoals);
  };

  if (goals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <h1 className="text-xl font-bold">Savings Goals</h1>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No savings goals yet</h2>
            <p className="text-gray-600 mb-8">
              Start a goal to track your progress and achieve your dreams
            </p>
            <Button 
              onClick={() => navigate('/create-goal')}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Goal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Savings Goals</h1>
        <p className="text-white/90 text-sm">Track your financial targets</p>
      </div>

      <div className="p-4 space-y-4">
        {goals.map((goal) => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.savedAmount;
          
          return (
            <div
              key={goal.id}
              className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/goal/${goal.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{goal.name}</h3>
                  <p className="text-sm text-gray-500">
                    Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>

              <Progress value={progress} className="h-3 mb-3" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="font-bold text-gray-900">
                    ₹{goal.savedAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Remaining</div>
                  <div className="font-bold text-teal-600">
                    ₹{remaining.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          );
        })}

        <Button 
          onClick={() => navigate('/create-goal')}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Goal
        </Button>
      </div>
    </div>
  );
};
