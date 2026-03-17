import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';

export const NotFoundScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
};
