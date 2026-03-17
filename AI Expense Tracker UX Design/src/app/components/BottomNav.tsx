import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Receipt, Target, MessageCircle, User } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/expenses', icon: Receipt, label: 'Expenses' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
