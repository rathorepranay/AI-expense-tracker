import { Expense, Goal } from '../types';
import { saveExpense, saveGoal } from './storage';
import { subDays, format } from 'date-fns';

export const loadDemoData = (userId: string) => {
  // Check if data already exists
  const existingExpenses = localStorage.getItem('expense_tracker_expenses');
  if (existingExpenses && JSON.parse(existingExpenses).length > 0) {
    return; // Don't overwrite existing data
  }

  // Demo expenses
  const demoExpenses: Expense[] = [
    {
      id: '1',
      amount: 250,
      description: 'Starbucks Coffee',
      category: 'Food',
      paymentMethod: 'Card',
      date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
      userId,
    },
    {
      id: '2',
      amount: 450,
      description: 'Uber ride to office',
      category: 'Transport',
      paymentMethod: 'UPI',
      date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
      userId,
    },
    {
      id: '3',
      amount: 1200,
      description: 'Restaurant dinner',
      category: 'Food',
      paymentMethod: 'Card',
      date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
      userId,
    },
    {
      id: '4',
      amount: 2500,
      description: 'Amazon shopping',
      category: 'Shopping',
      paymentMethod: 'Card',
      date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      userId,
    },
    {
      id: '5',
      amount: 1800,
      description: 'Electricity bill',
      category: 'Bills',
      paymentMethod: 'Net Banking',
      date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      userId,
    },
    {
      id: '6',
      amount: 800,
      description: 'Movie tickets',
      category: 'Entertainment',
      paymentMethod: 'UPI',
      date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      userId,
    },
    {
      id: '7',
      amount: 600,
      description: 'Pharmacy medicines',
      category: 'Health',
      paymentMethod: 'Cash',
      date: format(subDays(new Date(), 12), 'yyyy-MM-dd'),
      userId,
    },
    {
      id: '8',
      amount: 350,
      description: 'Coffee shop',
      category: 'Food',
      paymentMethod: 'Card',
      date: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
      userId,
    },
    {
      id: '9',
      amount: 200,
      description: 'Bus pass',
      category: 'Transport',
      paymentMethod: 'UPI',
      date: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
      userId,
    },
    {
      id: '10',
      amount: 950,
      description: 'Lunch with friends',
      category: 'Food',
      paymentMethod: 'Card',
      date: format(subDays(new Date(), 18), 'yyyy-MM-dd'),
      userId,
    },
  ];

  // Demo goals
  const demoGoals: Goal[] = [
    {
      id: '1',
      name: 'Vacation Fund',
      targetAmount: 50000,
      savedAmount: 12000,
      targetDate: format(new Date(2026, 11, 1), 'yyyy-MM-dd'), // Dec 2026
      userId,
    },
    {
      id: '2',
      name: 'New Laptop',
      targetAmount: 80000,
      savedAmount: 35000,
      targetDate: format(new Date(2026, 7, 1), 'yyyy-MM-dd'), // Aug 2026
      userId,
    },
  ];

  // Save to localStorage
  demoExpenses.forEach(expense => saveExpense(expense));
  demoGoals.forEach(goal => saveGoal(goal));
};
