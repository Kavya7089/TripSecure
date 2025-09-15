import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Download, TrendingUp, DollarSign, Calendar, MapPin, CreditCard, Receipt } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { useAppStore } from '../../lib/store';

interface Expense {
  id: string;
  tripId: string;
  category: 'accommodation' | 'food' | 'transport' | 'activities' | 'emergency' | 'other';
  amount: number;
  description: string;
  date: Date;
  location?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'razorpay';
  receipt?: string;
}

export const ExpenseTracking: React.FC = () => {
  const { activeTrip } = useAppStore();
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      tripId: activeTrip?.id || '',
      category: 'accommodation',
      amount: 150.00,
      description: 'Hotel booking for 2 nights',
      date: new Date('2024-01-15'),
      location: 'Times Square, NYC',
      paymentMethod: 'card',
      receipt: 'receipt_001.pdf'
    },
    {
      id: '2',
      tripId: activeTrip?.id || '',
      category: 'food',
      amount: 45.50,
      description: 'Dinner at local restaurant',
      date: new Date('2024-01-15'),
      location: 'Broadway, NYC',
      paymentMethod: 'upi',
      receipt: 'receipt_002.pdf'
    },
    {
      id: '3',
      tripId: activeTrip?.id || '',
      category: 'transport',
      amount: 25.00,
      description: 'Subway tickets',
      date: new Date('2024-01-16'),
      location: 'NYC Subway',
      paymentMethod: 'cash'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newExpense, setNewExpense] = useState({
    category: 'food' as const,
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    paymentMethod: 'card' as const
  });

  const categories = [
    { value: 'all', label: 'All Categories', icon: Filter },
    { value: 'accommodation', label: 'Accommodation', icon: Receipt },
    { value: 'food', label: 'Food & Dining', icon: Receipt },
    { value: 'transport', label: 'Transportation', icon: Receipt },
    { value: 'activities', label: 'Activities', icon: Receipt },
    { value: 'emergency', label: 'Emergency', icon: Receipt },
    { value: 'other', label: 'Other', icon: Receipt }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: DollarSign },
    { value: 'card', label: 'Credit Card', icon: CreditCard },
    { value: 'upi', label: 'UPI', icon: CreditCard },
    { value: 'razorpay', label: 'Razorpay', icon: CreditCard }
  ];

  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === filterCategory);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budget = activeTrip?.totalBudget || 1000;
  const remainingBudget = budget - totalExpenses;
  const budgetPercentage = (totalExpenses / budget) * 100;

  const categoryTotals = categories.slice(1).map(category => ({
    ...category,
    total: expenses
      .filter(expense => expense.category === category.value)
      .reduce((sum, expense) => sum + expense.amount, 0)
  }));

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      id: `expense_${Date.now()}`,
      tripId: activeTrip?.id || '',
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      date: new Date(newExpense.date)
    };
    setExpenses([expense, ...expenses]);
    setNewExpense({
      category: 'food',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      paymentMethod: 'card'
    });
    setIsModalOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      accommodation: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300',
      food: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      transport: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      activities: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      emergency: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Tracking</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your trip expenses and budget</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800 text-white">
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6  bg-opacity-55 border-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Spent</h3>
            <DollarSign className="h-6 w-6 text-secondary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">of {formatCurrency(budget)} budget</p>
        </Card>

        <Card className="p-6 bg-opacity-55 border-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Remaining</h3>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <p className={`text-3xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(remainingBudget)}
          </p>
          <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${budgetPercentage > 100 ? 'bg-red-500' : 'bg-secondary-500'}`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </Card>

        <Card className="p-6 bg-opacity-55 border-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Average</h3>
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalExpenses / Math.max(expenses.length, 1))}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">per expense</p>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="p-4 bg-opacity-55 border-none">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setFilterCategory(category.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                filterCategory === category.value
                  ? 'bg-primary-400 text-white'
                  : 'bg-gray-100 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <category.icon className="h-4 w-4" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card className="p-6 bg-opacity-55 border-none">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Expenses by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTotals.map((category) => (
            <div key={category.value} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <category.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="font-medium text-gray-900 dark:text-white">{category.label}</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(category.total)}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Expenses List */}
      <Card className="p-6 bg-opacity-55 border-none">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Expenses</h3>
        <div className="space-y-4">
          {filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-secondary-600 dark:text-secondary-300" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{expense.description}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {expense.date.toLocaleDateString()}
                    </span>
                    {expense.location && (
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {expense.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</span>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  {(() => {
                    const method = paymentMethods.find(method => method.value === expense.paymentMethod);
                    const Icon = method?.icon;
                    return Icon ? <Icon className="h-4 w-4" /> : null;
                  })()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expense"
      >
        <form onSubmit={handleAddExpense} className="space-y-4 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
            >
              {categories.slice(1).map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              placeholder="What did you spend on?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location (Optional)
            </label>
            <input
              type="text"
              value={newExpense.location}
              onChange={(e) => setNewExpense({ ...newExpense, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              placeholder="Where did you spend this?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Method
            </label>
            <select
              value={newExpense.paymentMethod}
              onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-secondary-600 hover:bg-secondary-700 text-white">
              Add Expense
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
