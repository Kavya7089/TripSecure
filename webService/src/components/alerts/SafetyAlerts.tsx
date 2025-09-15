import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, User, Shield, CheckCircle, XCircle, Filter, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAppStore } from '../../lib/store';

interface SafetyAlert {
  id: string;
  type: 'panic' | 'geofence' | 'community' | 'authority' | 'weather' | 'political';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: Date;
  isResolved: boolean;
  respondedBy?: string;
  response?: string;
  blockchainTxId?: string;
  tripId?: string;
  reporter?: {
    id: string;
    name: string;
    role: string;
  };
}

export const SafetyAlerts: React.FC = () => {
  const { safetyAlerts } = useAppStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced safety alerts with more details
  const enhancedAlerts: SafetyAlert[] = [
    {
      id: '1',
      type: 'panic',
      severity: 'critical',
      title: 'Panic Button Activated',
      description: 'Tourist activated panic button in crowded Times Square area. Immediate response required.',
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        address: 'Times Square, New York, NY'
      },
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isResolved: false,
      respondedBy: 'Officer Smith',
      blockchainTxId: '0x1234567890abcdef',
      tripId: 'trip_1',
      reporter: {
        id: 'user_1',
        name: 'Alex Chen',
        role: 'tourist'
      }
    },
    {
      id: '2',
      type: 'geofence',
      severity: 'high',
      title: 'High-Risk Area Entry',
      description: 'User entered a high-risk area in downtown. Safety monitoring activated.',
      location: {
        latitude: 40.7505,
        longitude: -73.9934,
        address: 'Central Park, New York, NY'
      },
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      isResolved: false,
      tripId: 'trip_2',
      reporter: {
        id: 'user_2',
        name: 'Sarah Johnson',
        role: 'tourist'
      }
    },
    {
      id: '3',
      type: 'community',
      severity: 'medium',
      title: 'Suspicious Activity Report',
      description: 'Community member reported suspicious activity near Broadway theater district.',
      location: {
        latitude: 40.7614,
        longitude: -73.9776,
        address: 'Broadway, New York, NY'
      },
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isResolved: true,
      respondedBy: 'Officer Brown',
      response: 'Investigated and found no immediate threat. Area is safe.',
      reporter: {
        id: 'user_3',
        name: 'Mike Wilson',
        role: 'family'
      }
    },
    {
      id: '4',
      type: 'weather',
      severity: 'medium',
      title: 'Severe Weather Warning',
      description: 'Heavy rain and strong winds expected in the area. Exercise caution while traveling.',
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        address: 'Times Square, New York, NY'
      },
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isResolved: false,
      reporter: {
        id: 'system',
        name: 'Weather Service',
        role: 'authority'
      }
    },
    {
      id: '5',
      type: 'political',
      severity: 'high',
      title: 'Political Demonstration Alert',
      description: 'Large political demonstration planned for tomorrow. Avoid the area if possible.',
      location: {
        latitude: 40.7505,
        longitude: -73.9934,
        address: 'Central Park, New York, NY'
      },
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isResolved: false,
      reporter: {
        id: 'authority_1',
        name: 'NYC Police Department',
        role: 'authority'
      }
    }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types', icon: AlertTriangle },
    { value: 'panic', label: 'Panic', icon: AlertTriangle },
    { value: 'geofence', label: 'Geofence', icon: MapPin },
    { value: 'community', label: 'Community', icon: User },
    { value: 'authority', label: 'Authority', icon: Shield },
    { value: 'weather', label: 'Weather', icon: AlertTriangle },
    { value: 'political', label: 'Political', icon: AlertTriangle }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const filteredAlerts = enhancedAlerts.filter(alert => {
    const typeMatch = filterType === 'all' || alert.type === filterType;
    const severityMatch = filterSeverity === 'all' || alert.severity === filterSeverity;
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'active' && !alert.isResolved) ||
      (filterStatus === 'resolved' && alert.isResolved);
    const searchMatch = searchQuery === '' || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && severityMatch && statusMatch && searchMatch;
  });

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      panic: AlertTriangle,
      geofence: MapPin,
      community: User,
      authority: Shield,
      weather: AlertTriangle,
      political: AlertTriangle
    };
    return icons[type as keyof typeof icons] || AlertTriangle;
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

  const stats = {
    total: enhancedAlerts.length,
    active: enhancedAlerts.filter(a => !a.isResolved).length,
    critical: enhancedAlerts.filter(a => a.severity === 'critical' && !a.isResolved).length,
    resolved: enhancedAlerts.filter(a => a.isResolved).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Safety Alerts</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor and manage safety incidents and alerts</p>
        </div>
        <Button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800">
          <AlertTriangle className="h-4 w-4" />
          <span>New Alert</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center bg-opacity-35 border-none">
          <AlertTriangle className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Alerts</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-35 border-none">
          <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Active</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-35 border-none">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.critical}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Critical</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-35 border-none">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Resolved</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 bg-opacity-35 border-none">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {severityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4 bg-opacity-55 border-none">
        {filteredAlerts.map((alert, index) => {
          const TypeIcon = getTypeIcon(alert.type);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 hover:shadow-lg transition-all bg-opacity-65 ${
                !alert.isResolved ? 'border-l-4 border-red-500' : ''
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    alert.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                    alert.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    alert.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    <TypeIcon className={`h-6 w-6 ${
                      alert.severity === 'critical' ? 'text-red-600 dark:text-red-300' :
                      alert.severity === 'high' ? 'text-orange-600 dark:text-orange-300' :
                      alert.severity === 'medium' ? 'text-yellow-600 dark:text-yellow-300' :
                      'text-green-600 dark:text-green-300'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        {!alert.isResolved && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            ACTIVE
                          </span>
                        )}
                        {alert.isResolved && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            RESOLVED
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{alert.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {alert.location.address}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatTimeAgo(alert.timestamp)}
                      </div>
                      {alert.reporter && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Reported by {alert.reporter.name} ({alert.reporter.role})
                        </div>
                      )}
                      {alert.respondedBy && (
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Responded by {alert.respondedBy}
                        </div>
                      )}
                    </div>
                    
                    {alert.response && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-300">
                          <strong>Response:</strong> {alert.response}
                        </p>
                      </div>
                    )}
                    
                    {alert.blockchainTxId && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <strong>Blockchain TX:</strong> {alert.blockchainTxId}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!alert.isResolved && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
