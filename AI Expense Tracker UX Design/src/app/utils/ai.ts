import { Expense, Category, CATEGORIES } from '../types';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

// AI Category Suggestion based on description
export const suggestCategory = (description: string): Category => {
  const desc = description.toLowerCase();
  
  // Food keywords
  if (desc.includes('restaurant') || desc.includes('food') || desc.includes('cafe') || 
      desc.includes('coffee') || desc.includes('starbucks') || desc.includes('mcdonald') ||
      desc.includes('lunch') || desc.includes('dinner') || desc.includes('breakfast') ||
      desc.includes('pizza') || desc.includes('burger')) {
    return 'Food';
  }
  
  // Transport keywords
  if (desc.includes('uber') || desc.includes('taxi') || desc.includes('bus') || 
      desc.includes('train') || desc.includes('metro') || desc.includes('fuel') ||
      desc.includes('petrol') || desc.includes('gas') || desc.includes('parking')) {
    return 'Transport';
  }
  
  // Shopping keywords
  if (desc.includes('amazon') || desc.includes('shop') || desc.includes('mall') || 
      desc.includes('cloth') || desc.includes('shoes') || desc.includes('apparel')) {
    return 'Shopping';
  }
  
  // Bills keywords
  if (desc.includes('electric') || desc.includes('water') || desc.includes('rent') || 
      desc.includes('internet') || desc.includes('phone') || desc.includes('subscription') ||
      desc.includes('netflix') || desc.includes('spotify')) {
    return 'Bills';
  }
  
  // Entertainment keywords
  if (desc.includes('movie') || desc.includes('cinema') || desc.includes('game') || 
      desc.includes('concert') || desc.includes('ticket')) {
    return 'Entertainment';
  }
  
  // Health keywords
  if (desc.includes('doctor') || desc.includes('medicine') || desc.includes('pharmacy') || 
      desc.includes('hospital') || desc.includes('gym')) {
    return 'Health';
  }
  
  return 'Other';
};

// AI Insights Generation
export const generateInsights = (expenses: Expense[]): string[] => {
  const insights: string[] = [];
  
  if (expenses.length === 0) {
    return ['Start tracking expenses to see AI-powered insights'];
  }
  
  // Current month expenses
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  
  const currentMonthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
  });
  
  // Previous month expenses
  const prevMonthStart = startOfMonth(subMonths(now, 1));
  const prevMonthEnd = endOfMonth(subMonths(now, 1));
  
  const prevMonthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate >= prevMonthStart && expenseDate <= prevMonthEnd;
  });
  
  // Category analysis
  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  if (totalSpent > 0) {
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      const percentage = Math.round((topCategory[1] / totalSpent) * 100);
      insights.push(`You spent the most on ${topCategory[0]} (${percentage}% of total)`);
    }
  }
  
  // Month over month comparison
  const prevTotal = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  if (prevTotal > 0 && totalSpent > 0) {
    const change = ((totalSpent - prevTotal) / prevTotal) * 100;
    if (Math.abs(change) > 5) {
      insights.push(
        change > 0 
          ? `You spent ${Math.round(change)}% more this month compared to last month`
          : `Great! You spent ${Math.round(Math.abs(change))}% less this month`
      );
    }
  }
  
  // Weekly trend
  const last7Days = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return expenseDate >= sevenDaysAgo;
  });
  
  const last7DaysTotal = last7Days.reduce((sum, e) => sum + e.amount, 0);
  const avgDailySpend = last7DaysTotal / 7;
  
  if (avgDailySpend > 0) {
    insights.push(`Your average daily spending is ₹${Math.round(avgDailySpend)}`);
  }
  
  return insights.length > 0 ? insights : ['Keep tracking to see more insights!'];
};

// Chatbot Response Generation
export const generateChatResponse = (query: string, expenses: Expense[], goals: any[]): string => {
  const q = query.toLowerCase();
  
  // Monthly spending query
  if (q.includes('spend') && (q.includes('month') || q.includes('this month'))) {
    const now = new Date();
    const currentMonthExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    });
    const total = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    
    if (topCategory) {
      const percentage = Math.round((topCategory[1] / total) * 100);
      return `You spent ₹${total.toLocaleString('en-IN')} this month. ${topCategory[0]} is your highest category (${percentage}%).`;
    }
    
    return `You spent ₹${total.toLocaleString('en-IN')} this month.`;
  }
  
  // Highest category query
  if (q.includes('highest') && q.includes('category')) {
    const now = new Date();
    const currentMonthExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === now.getMonth();
    });
    
    const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    
    if (topCategory) {
      return `Your highest spending category is ${topCategory[0]} with ₹${topCategory[1].toLocaleString('en-IN')}.`;
    }
    
    return 'You have no expenses recorded yet.';
  }
  
  // Savings progress query
  if (q.includes('saving') || q.includes('goal')) {
    if (goals.length === 0) {
      return 'You have no savings goals yet. Create a goal to start tracking your progress!';
    }
    
    const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const percentage = Math.round((totalSaved / totalTarget) * 100);
    
    return `You have ${goals.length} active goal${goals.length > 1 ? 's' : ''}. You've saved ₹${totalSaved.toLocaleString('en-IN')} out of ₹${totalTarget.toLocaleString('en-IN')} (${percentage}%).`;
  }
  
  // Average spending
  if (q.includes('average')) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avg = expenses.length > 0 ? total / expenses.length : 0;
    return `Your average expense is ₹${Math.round(avg).toLocaleString('en-IN')}. You have ${expenses.length} total expenses recorded.`;
  }
  
  // Default response
  return "I can help you with:\n• Monthly spending summary\n• Category analysis\n• Savings goals progress\n• Spending trends\n\nTry asking: 'How much did I spend this month?'";
};

// Goal Suggestion
export const suggestMonthlySavings = (targetAmount: number, targetDate: string): number => {
  const now = new Date();
  const target = new Date(targetDate);
  const monthsRemaining = Math.max(
    (target.getFullYear() - now.getFullYear()) * 12 + 
    (target.getMonth() - now.getMonth()),
    1
  );
  
  return Math.ceil(targetAmount / monthsRemaining);
};
