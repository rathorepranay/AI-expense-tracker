import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LogOut, User, Shield, Download, ChevronRight } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const settingsOptions = [
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Manage your privacy settings',
      onClick: () => alert('Privacy settings - Coming soon!'),
    },
    {
      icon: Download,
      title: 'Data Export',
      description: 'Download your expense data',
      onClick: () => alert('Data export - Coming soon!'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-white/90 text-sm">Manage your account</p>
      </div>

      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-900">{user?.email}</h2>
              <p className="text-sm text-gray-500">User ID: {user?.id}</p>
            </div>
          </div>
        </Card>

        {/* Settings Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 px-2">Settings</h3>
          
          {settingsOptions.map((option, index) => (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={option.onClick}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <option.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.title}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>

        {/* App Info */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 border-0">
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-1">AI Expense Tracker</h3>
            <p className="text-sm text-gray-600">Version 1.0.0</p>
            <p className="text-xs text-gray-500 mt-2">
              Track smarter, save better with AI-powered insights
            </p>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
