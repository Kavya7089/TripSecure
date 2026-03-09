import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { authService } from '../../lib/auth';
import { User } from '../../types';
import { useNavigate } from 'react-router-dom';

// Add your image import here (replace with your actual image path)
import loginImage from '../../assest/ChatGPT Image Sep 14, 2025, 07_14_46 AM.png';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
  onBackToHome?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await authService.login(email, password);
      if (user) {
        onLogin(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  

  const demoAccounts = [
    { email: 'tourist@demo.com', role: 'Tourist', password: 'demo123' },
    { email: 'family@demo.com', role: 'Family Member', password: 'demo123' },
    { email: 'authority@demo.com', role: 'Authority', password: 'demo123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-100 dark:from-gray-900 dark:to-primary-900 flex items-center justify-center ">
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-2xl shadow-lg ">
        <div className="hidden md:block md:w-1/2 bg-gray-100 dark:bg-primary-900">
          <img
            src={loginImage}
            alt="Login Visual"
            className="object-cover w-full h-full"
            style={{ minHeight: 500 }}
          />
        </div>
        {/* Form Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-7 bg-primary-200 dark:bg-secondary-700">
          <Card className=" shadow-none bg-white dark:bg-secondary-500 w-full max-w-md border border-gray-200 dark:border-gray-700 bg-opacity-35">
            <div className="text-center mb-8">
              {onBackToHome && (
                <div className="flex justify-start mb-4">
                  <Button
                    variant="ghost"
                    onClick={onBackToHome}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-secondary-600 dark:hover:text-secondary-400"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Home</span>
                  </Button>
                </div>
              )}
              <motion.div 
                className="flex justify-center mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="h-12 w-12 text-primary-400" />
              </motion.div>
              <h1 className="text-3xl font-bold text-secondary-600 dark:text-primary-600">TripSecure</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Smart Tourist Safety Platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-800"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Demo Accounts:</p>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                    }}
                    className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  >
                    <span className="font-medium">{account.role}</span>
                    <span className="text-gray-500 ml-2">{account.email}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-primary-600 hover:text-secondary-700 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};