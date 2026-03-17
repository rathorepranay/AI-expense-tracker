# AI Expense Tracker

A modern, AI-powered expense tracking application built with React, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- **User Authentication**: Secure login and signup system
- **Expense Management**: Add, edit, and delete expenses with ease
- **Category Organization**: Auto-suggest categories using AI based on expense descriptions
- **Visual Analytics**: Interactive charts showing spending patterns
- **Savings Goals**: Set and track financial goals with progress visualization
- **AI Chatbot**: Conversational interface for financial queries
- **Insights Dashboard**: Detailed analytics and AI-powered spending insights

### User Experience
- **Bottom Tab Navigation**: Easy access to Home, Expenses, Goals, Chat, and Profile
- **Responsive Design**: Optimized for mobile and desktop
- **Empty States**: Helpful guidance when no data exists
- **Error Handling**: Clear error messages and validation
- **Fast Entry**: Expense entry optimized for speed (under 5 seconds)

### AI Features
- **Smart Categorization**: Automatically suggests expense categories
- **Spending Insights**: AI-generated insights about spending patterns
- **Trend Analysis**: Month-over-month and category-based analysis
- **Goal Recommendations**: Suggests monthly savings targets
- **Conversational Assistant**: Natural language queries about expenses

## Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS v4** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **date-fns** for date handling
- **LocalStorage** for data persistence (frontend-only)

## Getting Started

### Demo Account
Click "Try demo" on the login screen to explore the app with pre-loaded sample data.

### Create Your Own Account
1. Click "Create new account" on the login screen
2. Enter your email and password (minimum 6 characters)
3. Start tracking your expenses!

## App Structure

### Screens
1. **Login/Signup** - User authentication
2. **Home Dashboard** - Overview of monthly spending with charts
3. **Expenses** - List and manage all expenses
4. **Add/Edit Expense** - Quick expense entry with AI category suggestions
5. **Insights** - Detailed analytics and AI insights
6. **Goals** - Savings goal tracking
7. **Chat** - AI assistant for financial queries
8. **Profile** - User settings and app information

### Navigation
- **Bottom Tabs**: Primary navigation between main screens
- **Quick Actions**: Direct access to common tasks
- **Breadcrumbs**: Easy navigation back to previous screens

## Data Storage

Currently, the app uses browser LocalStorage for data persistence. This means:
- ✅ Data persists across browser sessions
- ✅ No server required
- ⚠️ Data is stored locally on your device
- ⚠️ Clearing browser data will delete all expenses

### Future Enhancements
The app architecture supports easy migration to:
- Cloud database (Supabase)
- Bank account sync
- Subscription tracking
- Budget alerts
- Investment insights

## Design Principles

1. **Speed**: Expense entry under 5 seconds
2. **Clarity**: Insights understandable at a glance
3. **Guidance**: AI assistant as a helpful companion
4. **Scalability**: Architecture supports future features

## Color Scheme

- **Primary**: Blue/Teal gradient (Trust + Finance)
- **Categories**: Distinct colors for easy recognition
  - Food: Pink (#FF6384)
  - Transport: Blue (#36A2EB)
  - Shopping: Yellow (#FFCE56)
  - Bills: Teal (#4BC0C0)
  - Entertainment: Purple (#9966FF)
  - Health: Orange (#FF9F40)

## Accessibility

- Large tap targets for mobile
- Clear color contrast
- Charts with labels
- Simple, understandable language

---

Built with ❤️ for smarter expense tracking
