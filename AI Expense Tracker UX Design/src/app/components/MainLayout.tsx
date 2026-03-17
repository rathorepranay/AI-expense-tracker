import React from 'react';
import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
