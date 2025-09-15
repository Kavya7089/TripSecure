import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, MessageCircle, AlertTriangle, Users, Shield, Navigation } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface TrackedMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: Date;
    accuracy: number;
  };
  trip: {
    id: string;
    title: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    status: 'planned' | 'active' | 'completed' | 'emergency';
  };
  status: 'safe' | 'warning' | 'danger' | 'offline';
  lastSeen: Date;
  batteryLevel: number;
  isSharingLocation: boolean;
  emergencyContacts: string[];
}

export const TrackLovedOnes: React.FC = () => {
  const [trackedMembers, setTrackedMembers] = useState<TrackedMember[]>([
    {
      id: '1',
      name: 'Alex Chen',
      phone: '+1-555-0123',
      email: 'alex@example.com',
      relationship: 'Spouse',
      currentLocation: {
        latitude: 40.7589,
        longitude: -73.9851,
        address: 'Times Square, New York, NY',
        timestamp: new Date(),
        accuracy: 5
      },
      trip: {
        id: 'trip_1',
        title: 'NYC Adventure',
        destination: 'New York City',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-20'),
        status: 'active'
      },
      status: 'safe',
      lastSeen: new Date(),
      batteryLevel: 85,
      isSharingLocation: true,
      emergencyContacts: ['+1-555-0124', '+1-555-0125']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phone: '+1-555-0126',
      email: 'sarah@example.com',
      relationship: 'Sister',
      currentLocation: {
        latitude: 40.7505,
        longitude: -73.9934,
        address: 'Central Park, New York, NY',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        accuracy: 8
      },
      trip: {
        id: 'trip_2',
        title: 'Business Trip',
        destination: 'New York City',
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-01-18'),
        status: 'active'
      },
      status: 'warning',
      lastSeen: new Date(Date.now() - 300000),
      batteryLevel: 25,
      isSharingLocation: true,
      emergencyContacts: ['+1-555-0127']
    }
  ]);

  const [selectedMember, setSelectedMember] = useState<TrackedMember | null>(null);
  const [mapView, setMapView] = useState(false);

  useEffect(() => {
    // Simulate real-time location updates
    const interval = setInterval(() => {
      setTrackedMembers(prev => prev.map(member => ({
        ...member,
        lastSeen: new Date(),
        batteryLevel: Math.max(0, member.batteryLevel - Math.random() * 2)
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'danger':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'offline':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
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

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleMessage = (phone: string) => {
    window.open(`sms:${phone}`);
  };

  const handleEmergency = (member: TrackedMember) => {
    // Trigger emergency response
    alert(`Emergency alert sent for ${member.name}. Authorities and emergency contacts have been notified.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Track Loved Ones</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor your family members' safety and location</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => setMapView(!mapView)}
            className="flex items-center space-x-2"
          >
            <Navigation className="h-4 w-4" />
            <span>{mapView ? 'List View' : 'Map View'}</span>
          </Button>
          <Button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800 ">
            <Users className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <Users className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{trackedMembers.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Tracked Members</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {trackedMembers.filter(m => m.status === 'safe').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Safe</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {trackedMembers.filter(m => m.status === 'warning').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Warning</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {trackedMembers.filter(m => m.isSharingLocation).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Sharing Location</p>
        </Card>
      </div>

      {/* Members List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trackedMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow bg-opacity-55 border-none">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-secondary-600 dark:text-secondary-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{member.relationship}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status.toUpperCase()}
                  </span>
                  <div className={`text-xs ${getBatteryColor(member.batteryLevel)}`}>
                    {member.batteryLevel}%
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{member.currentLocation.address}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>Last seen {formatTimeAgo(member.lastSeen)}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Shield className="h-4 w-4" />
                  <span>Trip: {member.trip.title}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCall(member.phone)}
                    className="flex items-center space-x-1"
                  >
                    <Phone className="h-3 w-3" />
                    <span>Call</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleMessage(member.phone)}
                    className="flex items-center space-x-1"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>Message</span>
                  </Button>
                </div>

                <Button
                  size="sm"
                  onClick={() => setSelectedMember(member)}
                  className="bg-secondary-600 hover:bg-secondary-700 text-white"
                >
                  View Details
                </Button>
              </div>

              {/* Emergency Button */}
              {(member.status === 'warning' || member.status === 'danger') && (
                <div className="mt-3">
                  <Button
                    size="sm"
                    onClick={() => handleEmergency(member)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Emergency Alert</span>
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Location Sharing Status */}
      <Card className="p-6 bg-opacity-55 border-none">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location Sharing Status</h3>
        <div className="space-y-3">
          {trackedMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${member.isSharingLocation ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium text-gray-900 dark:text-white">{member.name}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {member.isSharingLocation ? 'Sharing Location' : 'Location Off'}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full bg-opacity-55 border-none"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedMember.name} Details
              </h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Location</label>
                <p className="text-gray-900 dark:text-white">{selectedMember.currentLocation.address}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Accuracy: ±{selectedMember.currentLocation.accuracy}m
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trip Information</label>
                <p className="text-gray-900 dark:text-white">{selectedMember.trip.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedMember.trip.startDate.toLocaleDateString()} - {selectedMember.trip.endDate.toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contacts</label>
                <div className="space-y-1">
                  {selectedMember.emergencyContacts.map((contact, index) => (
                    <p key={index} className="text-sm text-gray-600 dark:text-gray-300">{contact}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setSelectedMember(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => handleCall(selectedMember.phone)}
                className="bg-secondary-600 hover:bg-secondary-700 text-white"
              >
                Call Now
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
