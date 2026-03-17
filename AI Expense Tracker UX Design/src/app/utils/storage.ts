import { User, Expense, Goal, ChatMessage } from '../types';

const STORAGE_KEYS = {
  USER: 'expense_tracker_user',
  EXPENSES: 'expense_tracker_expenses',
  GOALS: 'expense_tracker_goals',
  CHAT_HISTORY: 'expense_tracker_chat_history',
};

// User Storage
export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Expenses Storage
export const saveExpense = (expense: Expense) => {
  const expenses = getExpenses();
  expenses.push(expense);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
};

export const getExpenses = (): Expense[] => {
  const expenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return expenses ? JSON.parse(expenses) : [];
};

export const updateExpense = (id: string, updatedExpense: Expense) => {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    expenses[index] = updatedExpense;
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }
};

export const deleteExpense = (id: string) => {
  const expenses = getExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
};

// Goals Storage
export const saveGoal = (goal: Goal) => {
  const goals = getGoals();
  goals.push(goal);
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

export const getGoals = (): Goal[] => {
  const goals = localStorage.getItem(STORAGE_KEYS.GOALS);
  return goals ? JSON.parse(goals) : [];
};

export const updateGoal = (id: string, updatedGoal: Goal) => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals[index] = updatedGoal;
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }
};

export const deleteGoal = (id: string) => {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filtered));
};

// Chat History Storage
export const saveChatMessage = (message: ChatMessage) => {
  const history = getChatHistory();
  history.push(message);
  localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
};

export const getChatHistory = (): ChatMessage[] => {
  const history = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
  return history ? JSON.parse(history) : [];
};

export const clearChatHistory = () => {
  localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
};
