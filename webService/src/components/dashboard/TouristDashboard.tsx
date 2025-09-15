import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, DollarSign, Calendar, Shield, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../lib/store';
import { sampleTrips } from '../../lib/sample-data';

export const TouristDashboard: React.FC = () => {
  const { user, activeTrip, safetyAlerts } = useAppStore();
  const trip = activeTrip || sampleTrips[0];

  const stats = [
    {
      label: 'Active Trip',
      value: trip ? trip.destination : 'None',
      icon: MapPin,
      color: 'text-secondary-600'
    },
    {
      label: 'Safety Alerts',
      value: safetyAlerts.length.toString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      label: 'Trip Budget',
      value: trip ? `$${trip.totalBudget - trip.spentAmount} left` : '$0',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Safety Score',
      value: '8.5/10',
      icon: Shield,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-6 bg-primary-200 dark:bg-secondary-600 p-6">
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay safe on your adventures</p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800">
          <Plus className="h-4 w-4" />
          <span>New Trip</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="text-center bg-white dark:bg-primary-200 bg-opacity-35 dark:bg-opacity-35 border-none">
              <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Trip */}
      {trip && (
        <Card className=' bg-white dark:bg-primary-200 bg-opacity-35 dark:bg-opacity-35 border-none'>
          <div className="flex items-center justify-between mb-4 ">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Current Trip</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              trip.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-primary-400 mb-2">{trip.title}</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-4 bg-opacity-55">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Budget Usage</span>
                  <span className="text-sm text-green-700">
                    ${trip.spentAmount} / ${trip.totalBudget}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-secondary-600 dark:bg-primary-700 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(trip.spentAmount / trip.totalBudget) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Alerts */}
      <Card className=' bg-white dark:bg-primary-200 bg-opacity-35 dark:bg-opacity-35 border-none'>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4">Recent Safety Alerts</h2>
        {safetyAlerts.length > 0 ? (
          <div className="space-y-3">
            {safetyAlerts.slice(0, 3).map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-opacity-75 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p>All clear! No safety alerts at the moment.</p>
          </div>
        )}
      </Card>
    </div>
  );
};