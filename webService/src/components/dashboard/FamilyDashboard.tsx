import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, AlertTriangle, Clock, Shield, Phone, Building2, Car } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../lib/store';
import { sampleTrips } from '../../lib/sample-data';
import { authService } from "../../lib/auth";

const user = authService.getCurrentUser();
if (!user) {
  window.location.href = "/login"; // redirect if not logged in
}


export const FamilyDashboard: React.FC = () => {
  const { user, safetyAlerts } = useAppStore();
  
  // Mock tracked family members including default priority members
  const trackedMembers = [
    {
      id: '1',
      name: 'Alex Chen',
      trip: sampleTrips[0],
      lastUpdate: new Date(),
      status: 'safe',
      location: 'Times Square, NYC',
      isDefault: false
    }
  ];

  // Default priority members (Police and Travel Department)
  const defaultMembers = [
    {
      id: 'police',
      name: 'Police Department',
      department: 'Law Enforcement',
      lastUpdate: new Date(),
      status: 'active',
      location: 'Emergency Response Center',
      isDefault: true,
      icon: Building2
    },
    {
      id: 'travel',
      name: 'Travel Department',
      department: 'Tourism & Safety',
      lastUpdate: new Date(),
      status: 'active',
      location: 'Tourist Safety Center',
      isDefault: true,
      icon: Car
    }
  ];

  const stats = [
    {
      label: 'Family Members',
      value: trackedMembers.length.toString(),
      icon: Users,
      color: 'text-secondary-600'
    },
    {
      label: 'Priority Members',
      value: (trackedMembers.length + defaultMembers.length).toString(),
      icon: Shield,
      color: 'text-indigo-600'
    },
    {
      label: 'Active Trips',
      value: '1',
      icon: MapPin,
      color: 'text-green-600'
    },
    {
      label: 'Safety Alerts',
      value: safetyAlerts.length.toString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Priority Members & Safety Center</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor your loved ones and emergency contacts</p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800">
          <Users className="h-4 w-4" />
          <span>Add Member</span>
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
            <Card hover className="text-center bg-opacity-55 border-none">
              <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Default Priority Members */}
      <Card className='bg-opacity-55 border-none'>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Default Priority Members</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Police and Travel Department automatically have location access for emergency response
        </p>
        <div className="space-y-4">
          {defaultMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center">
                    <member.icon className="h-6 w-6 text-secondary-600 dark:text-secondary-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{member.department}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>{member.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      {member.status.toUpperCase()}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {member.lastUpdate.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-secondary-600 dark:text-secondary-400 font-medium">Location Access</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Family Members */}
      <Card className='bg-opacity-55 border-none'>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Family Members</h2>
        <div className="space-y-4">
          {trackedMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-secondary-600 dark:text-secondary-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{member.trip.title}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>{member.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'safe' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {member.status.toUpperCase()}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {member.lastUpdate.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <Button variant="secondary" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Safety Timeline */}
      <Card className='bg-opacity-55 '>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Safety Timeline</h2>
        <div className="space-y-4">
          {safetyAlerts.length > 0 ? (
            safetyAlerts.slice(0, 5).map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 bg-primary-200 dark:bg-secondary-700 p-2 rounded-lg bg-opacity-55 border- border-secondary-300"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.severity === 'critical' ? 'bg-red-500' :
                  alert.severity === 'high' ? 'bg-orange-500' :
                  alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{alert.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{alert.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Shield className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p>All family members are safe!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};