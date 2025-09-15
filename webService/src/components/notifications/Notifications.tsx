import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Clock, MapPin, Users, Shield, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface Notification {
  id: string;
  type: 'safety' | 'location' | 'emergency' | 'system' | 'trip' | 'family';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  actionUrl?: string;
  metadata?: {
    location?: string;
    tripId?: string;
    userId?: string;
    severity?: string;
  };
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'emergency',
      title: 'Panic Alert Activated',
      message: 'Alex Chen activated panic button in Times Square. Emergency services have been notified.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isRead: false,
      priority: 'critical',
      actionRequired: true,
      actionUrl: '/incidents/1',
      metadata: {
        location: 'Times Square, New York, NY',
        tripId: 'trip_1',
        userId: 'user_1',
        severity: 'critical'
      }
    },
    {
      id: '2',
      type: 'safety',
      title: 'Risk Area Entry Alert',
      message: 'You have entered a high-risk area. Please stay alert and follow safety guidelines.',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      isRead: false,
      priority: 'high',
      actionRequired: true,
      metadata: {
        location: 'Central Park, New York, NY',
        severity: 'high'
      }
    },
    {
      id: '3',
      type: 'family',
      title: 'Family Member Location Update',
      message: 'Sarah Johnson has arrived at Central Park. Battery level: 25%',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: true,
      priority: 'medium',
      actionRequired: false,
      metadata: {
        location: 'Central Park, New York, NY',
        userId: 'user_2'
      }
    },
    {
      id: '4',
      type: 'trip',
      title: 'Trip Safety Check',
      message: 'Your trip to New York City is going well. No safety concerns detected.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: true,
      priority: 'low',
      actionRequired: false,
      metadata: {
        tripId: 'trip_1'
      }
    },
    {
      id: '5',
      type: 'system',
      title: 'Location Services Updated',
      message: 'Your location sharing preferences have been updated successfully.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: true,
      priority: 'low',
      actionRequired: false
    },
    {
      id: '6',
      type: 'safety',
      title: 'Community Safety Report',
      message: 'A new safety report has been submitted for Broadway area. Check details for more information.',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      isRead: true,
      priority: 'medium',
      actionRequired: false,
      metadata: {
        location: 'Broadway, New York, NY'
      }
    }
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');

  const typeOptions = [
    { value: 'all', label: 'All Types', icon: Bell },
    { value: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { value: 'safety', label: 'Safety', icon: Shield },
    { value: 'family', label: 'Family', icon: Users },
    { value: 'trip', label: 'Trip', icon: MapPin },
    { value: 'system', label: 'System', icon: Bell }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const readOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'read', label: 'Read Only' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filterType === 'all' || notification.type === filterType;
    const priorityMatch = filterPriority === 'all' || notification.priority === filterPriority;
    const readMatch = filterRead === 'all' || 
      (filterRead === 'unread' && !notification.isRead) ||
      (filterRead === 'read' && notification.isRead);
    
    return typeMatch && priorityMatch && readMatch;
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      emergency: AlertTriangle,
      safety: Shield,
      family: Users,
      trip: MapPin,
      system: Bell,
      location: MapPin
    };
    return icons[type as keyof typeof icons] || Bell;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      emergency: 'text-red-600 bg-red-100 dark:bg-red-900/30',
      safety: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
      family: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      trip: 'text-green-600 bg-green-100 dark:bg-green-900/30',
      system: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30',
      location: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
    };
    return colors[type as keyof typeof colors] || colors.system;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      // In real app, navigate to actionUrl
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.isRead).length;

  return (
    <div className="space-y-6 p-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {unreadCount} unread notifications
            {criticalCount > 0 && (
              <span className="ml-2 text-red-600 font-semibold">
                ({criticalCount} critical)
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Mark All Read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4  bg-opacity-35 border-none">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
            >
              {readOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center  bg-opacity-35 border-none">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Notifications</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {filterType === 'all' && filterPriority === 'all' && filterRead === 'all'
                ? 'You have no notifications yet.'
                : 'No notifications match your current filters.'
              }
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification, index) => {
            const TypeIcon = getTypeIcon(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className={`p-6 hover:shadow-lg transition-all  bg-opacity-65 border-none cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-secondary-800 ${
                    !notification.isRead ? 'border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                            <span className={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority.toUpperCase()}
                            </span>
                            {notification.actionRequired && (
                              <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full">
                                Action Required
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-sm ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimeAgo(notification.timestamp)}
                            </div>
                            {notification.metadata?.location && (
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {notification.metadata.location}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-xs"
                            >
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
