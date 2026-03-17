import { createBrowserRouter, Navigate } from 'react-router';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import {
  LoginScreen,
  SignupScreen,
  HomeScreen,
  AddExpenseScreen,
  ExpensesScreen,
  EditExpenseScreen,
  InsightsScreen,
  GoalsScreen,
  CreateGoalScreen,
  ChatScreen,
  ProfileScreen,
  NotFoundScreen,
} from './screens';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/signup',
    element: <SignupScreen />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomeScreen />,
      },
      {
        path: 'expenses',
        element: <ExpensesScreen />,
      },
      {
        path: 'goals',
        element: <GoalsScreen />,
      },
      {
        path: 'chat',
        element: <ChatScreen />,
      },
      {
        path: 'profile',
        element: <ProfileScreen />,
      },
    ],
  },
  {
    path: '/add-expense',
    element: (
      <ProtectedRoute>
        <AddExpenseScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/edit-expense/:id',
    element: (
      <ProtectedRoute>
        <EditExpenseScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/insights',
    element: (
      <ProtectedRoute>
        <InsightsScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create-goal',
    element: (
      <ProtectedRoute>
        <CreateGoalScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);