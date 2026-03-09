import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, MapPin, TrendingUp, Shield, Phone, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../lib/store';

import { authService } from "../../lib/auth";
const user = authService.getCurrentUser();
if (!user) {
  window.location.href = "/login"; // redirect if not logged in
}


export const AuthorityDashboard: React.FC = () => {
  const { user, safetyAlerts, panicAlerts } = useAppStore();

  const stats = [
    {
      label: 'Active Incidents',
      value: panicAlerts.filter(a => a.status === 'active').length.toString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      label: 'Tourists Monitored',
      value: '1,247',
      icon: Users,
      color: 'text-secondary-600'
    },
    {
      label: 'Hotspots',
      value: '12',
      icon: MapPin,
      color: 'text-yellow-600'
    },
    {
      label: 'Response Rate',
      value: '98.5%',
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  const recentIncidents = [
    {
      id: '1',
      type: 'Panic Alert',
      tourist: 'Alex Chen',
      location: 'Times Square, NYC',
      timestamp: new Date(),
      severity: 'high',
      status: 'active'
    },
    {
      id: '2',
      type: 'Community Report',
      tourist: 'Sarah Johnson',
      location: 'Central Park, NYC',
      timestamp: new Date(Date.now() - 30000),
      severity: 'medium',
      status: 'investigating'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Authority Control Center</h1>
          <p className="text-gray-600">Monitor and respond to tourist safety incidents</p>
        </div>
        <Button variant="danger" className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Emergency Response</span>
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
            <Card hover className="text-center bg-opacity-35 border-none">
              <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Incidents */}
      <Card className='bg-opacity-35 border-none'>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Active Incidents</h2>
          <Button variant="secondary" size="sm">View All</Button>
        </div>
        
        <div className="space-y-4">
          {recentIncidents.map((incident, index) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-l-4 pl-4 py-3 ${
                incident.severity === 'high' ? 'border-red-500 bg-red-50' :
                incident.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-secondary-500 bg-secondary-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{incident.type}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>Tourist: {incident.tourist}</span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {incident.location}
                    </span>
                    <span>{incident.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    incident.status === 'active' ? 'bg-red-100 text-red-800' :
                    incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {incident.status.toUpperCase()}
                  </span>
                  
                  <Button variant="primary" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="success" size="sm">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Safety Heatmap Preview */}
      <Card className='bg-opacity-35 border-none'>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Safety Heatmap Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-medium text-gray-900">Safe Zones</p>
            <p className="text-2xl font-bold text-green-600">85%</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="font-medium text-gray-900">Caution Areas</p>
            <p className="text-2xl font-bold text-yellow-600">12%</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="font-medium text-gray-900">High Risk</p>
            <p className="text-2xl font-bold text-red-600">3%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};