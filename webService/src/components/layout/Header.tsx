import React from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Bell, User, LogOut, Sun, Moon, Home } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { useTheme } from '../../lib/theme';
import { Button } from '../ui/Button';
import { authService } from '../../lib/auth';

interface HeaderProps {
  onLogout: () => void;
  onBackToHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, onBackToHome }) => {
  const { user, isConnected, safetyAlerts } = useAppStore();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await authService.logout();
    onLogout();
  };

  const unreadAlerts = safetyAlerts.filter(alert => !alert.isResolved).length;

  return (
    <header className="bg-primary-500 dark:bg-secondary-400  px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="h-8 w-8 text-secondary-600 dark:text-primary-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">TripSecure</span>
          </motion.div>
          
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {onBackToHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToHome}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-secondary-600 dark:hover:text-secondary-400"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          )}

          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </motion.button>

          <motion.div 
            className="relative"
            whileHover={{ scale: 1.1 }}
          >
            
            
          </motion.div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                
              </div>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};