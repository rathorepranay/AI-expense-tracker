export interface User {
  id: string;
  email: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  paymentMethod: string;
  date: string;
  userId: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  userId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type Category = 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Entertainment' | 'Health' | 'Other';

export const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

export const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Net Banking'];
