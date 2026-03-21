// Gamification logic for streaks, achievements, and insights

export const getWeeklyBudget = () => {
  const saved = localStorage.getItem("weeklyBudget");
  return saved ? Number(saved) : 10000;
};

export const calculateStreak = (expenses) => {
  if (!expenses || expenses.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  const expenseDates = new Set(
    expenses.map((exp) => {
      const date = new Date(exp.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );

  while (true) {
    if (expenseDates.has(currentDate.getTime())) {
      streak++;
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return streak;
};

export const getTodayExpenses = (expenses) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    expDate.setHours(0, 0, 0, 0);
    return expDate.getTime() === today.getTime();
  });
};

export const getWeeklyTotal = (expenses) => {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  return expenses
    .filter((exp) => {
      const expDate = new Date(exp.date);
      expDate.setHours(0, 0, 0, 0);
      return expDate >= weekStart;
    })
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
};

export const getWeeklyProgress = (expenses, budget = getWeeklyBudget()) => {
  const weeklyTotal = getWeeklyTotal(expenses);
  return Math.min((weeklyTotal / budget) * 100, 100);
};

export const isGoalAchieved = (expenses, budget = getWeeklyBudget()) => {
  const weeklyTotal = getWeeklyTotal(expenses);
  return weeklyTotal <= budget;
};

export const getAchievements = (expenses) => {
  const achievements = [];

  // First expense
  if (expenses.length === 1) {
    achievements.push({
      id: "first_expense",
      title: "First Step! 🎯",
      description: "Added your first expense",
      icon: "🎯",
    });
  }

  // Week 1 power user
  if (expenses.length >= 7) {
    achievements.push({
      id: "week_power_user",
      title: "Week 1 Power User 💪",
      description: "Tracked 7+ expenses",
      icon: "💪",
    });
  }

  // Budget master
  if (isGoalAchieved(expenses)) {
    achievements.push({
      id: "budget_master",
      title: "Budget Master 👑",
      description: "Stayed within weekly budget",
      icon: "👑",
    });
  }

  // Spending streak
  const streak = calculateStreak(expenses);
  if (streak >= 3) {
    achievements.push({
      id: "streak_3",
      title: `3-Day Streak 🔥`,
      description: "Tracked expenses 3 days in a row",
      icon: "🔥",
    });
  }

  if (streak >= 7) {
    achievements.push({
      id: "streak_7",
      title: `7-Day Streak 🌟`,
      description: "Tracked expenses all week",
      icon: "🌟",
    });
  }

  // Big spender milestone
  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  if (total >= 50000) {
    achievements.push({
      id: "milestone_50k",
      title: "50k Milestone 🚀",
      description: "Tracked ₹50,000+ in expenses",
      icon: "🚀",
    });
  }

  return achievements;
};

export const getSpendingTip = (expenses, dailyAverage = null) => {
  if (!expenses || expenses.length === 0) {
    return {
      text: "🌱 Start tracking your expenses to get personalized insights!",
      color: "text-green-600",
    };
  }

  const weeklyTotal = getWeeklyTotal(expenses);
  const todayExpenses = getTodayExpenses(expenses);
  const average =
    dailyAverage ||
    (expenses.length > 0
      ? expenses.reduce((sum, exp) => sum + Number(exp.amount), 0) /
        Math.max(expenses.length, 1)
      : 0);

  if (isGoalAchieved(expenses)) {
    return {
      text: "🎉 Amazing! You're within your weekly budget!",
      color: "text-green-600",
    };
  }

  if (weeklyTotal > getWeeklyBudget() * 0.8) {
    return {
      text: "⚠️ Watch out! You're close to your budget limit.",
      color: "text-amber-600",
    };
  }

  if (todayExpenses.length === 0 && expenses.length > 0) {
    return {
      text: "💡 No expenses today yet. Great start!",
      color: "text-blue-600",
    };
  }

  const lastExpense = expenses[expenses.length - 1];
  if (lastExpense && Number(lastExpense.amount) > average * 2) {
    return {
      text: "💰 That was a big purchase! Try to balance future expenses.",
      color: "text-amber-600",
    };
  }

  return {
    text: "✨ Keep tracking consistently to see better insights!",
    color: "text-emerald-600",
  };
};

export const getCategoryStats = (expenses) => {
  const stats = {};

  expenses.forEach((exp) => {
    const category = exp.category || "Other";
    if (!stats[category]) {
      stats[category] = { total: 0, count: 0 };
    }
    stats[category].total += Number(exp.amount);
    stats[category].count += 1;
  });

  return Object.entries(stats)
    .map(([category, data]) => ({
      category,
      ...data,
      percentage: (data.total / getTodayExpenses(expenses).length) * 100 || 0,
    }))
    .sort((a, b) => b.total - a.total);
};

export const getDailySpendingTrend = (expenses, days = 7) => {
  const trend = {};
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    trend[dateStr] = 0;
  }

  expenses.forEach((exp) => {
    const dateStr = new Date(exp.date).toISOString().split("T")[0];
    if (trend.hasOwnProperty(dateStr)) {
      trend[dateStr] += Number(exp.amount);
    }
  });

  return Object.entries(trend).map(([date, amount]) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    amount,
  }));
};
