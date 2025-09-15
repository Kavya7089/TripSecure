import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Map, 
  PlusCircle, 
  AlertTriangle, 
  MessageSquare, 
  CreditCard,
  Users,
  BarChart3,
  Shield,
  UserCheck,
  Bell,
  User,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user } = useAppStore();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'map', label: 'Live Map', icon: Map },
    ];

    const commonItems = [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    switch (user?.role) {
      case 'tourist':
        return [
          ...commonItems,
          ...baseItems,
          { id: 'trips', label: 'My Trips', icon: PlusCircle },
          { id: 'priority-members', label: 'Priority Members', icon: UserCheck },
          { id: 'risk-alerts', label: 'Risk Alerts', icon: Bell },
          { id: 'expenses', label: 'Expenses', icon: CreditCard },
          { id: 'alerts', label: 'Safety Alerts', icon: AlertTriangle },
          { id: 'community', label: 'Community', icon: MessageSquare },
        ];
      
      case 'family':
        return [
          ...commonItems,
          ...baseItems,
          { id: 'tracking', label: 'Track Loved Ones', icon: Users },
          { id: 'priority-members', label: 'Priority Members', icon: UserCheck },
          { id: 'risk-alerts', label: 'Risk Alerts', icon: Bell },
          { id: 'alerts', label: 'Safety Alerts', icon: AlertTriangle },
        ];
      
      case 'authority':
        return [
          ...commonItems,
          ...baseItems,
          { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'verification', label: 'ID Verification', icon: Shield },
        ];
      
      default:
        return [...baseItems, ...commonItems];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="bg-primary-800 dark:bg-secondary-700 border-r border-gray-200 dark:border-gray-700 w-64 min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              activeView === item.id
                ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-700'
                : 'text-gray-300 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </aside>
  );
};