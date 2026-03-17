import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { loadDemoData } from '../utils/demoData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Wallet } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Incorrect email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login('demo@example.com', 'demo123');
      // Load demo data for the demo user
      const user = JSON.parse(localStorage.getItem('expense_tracker_user') || '{}');
      if (user.id) {
        loadDemoData(user.id);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to load demo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Expense Tracker</h1>
            <p className="text-gray-600 mt-2">Track smarter, save better</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create new account
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-gray-600 hover:text-gray-700 font-medium"
              >
                Try demo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};