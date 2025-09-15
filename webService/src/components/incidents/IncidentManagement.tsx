import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, User, Phone, MessageSquare, Shield, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

interface Incident {
  id: string;
  title: string;
  description: string;
  type: 'panic' | 'geofence' | 'community' | 'authority' | 'weather' | 'political';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'responding' | 'resolved' | 'closed';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  reporter: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
  timestamp: Date;
  assignedTo?: string;
  response?: string;
  priorityMembersNotified: string[];
  blockchainTxId?: string;
}

export const IncidentManagement: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      title: 'Panic Alert - Times Square',
      description: 'Tourist activated panic button in crowded area',
      type: 'panic',
      severity: 'critical',
      status: 'responding',
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        address: 'Times Square, New York, NY'
      },
      reporter: {
        id: 'user_1',
        name: 'Alex Chen',
        phone: '+1-555-0123',
        role: 'tourist'
      },
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      assignedTo: 'Officer Smith',
      priorityMembersNotified: ['+1-555-0124', '+1-555-0125'],
      blockchainTxId: '0x1234567890abcdef'
    },
    {
      id: '2',
      title: 'Risk Area Entry Alert',
      description: 'User entered high-risk area in downtown',
      type: 'geofence',
      severity: 'high',
      status: 'investigating',
      location: {
        latitude: 40.7505,
        longitude: -73.9934,
        address: 'Central Park, New York, NY'
      },
      reporter: {
        id: 'user_2',
        name: 'Sarah Johnson',
        phone: '+1-555-0126',
        role: 'tourist'
      },
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      assignedTo: 'Officer Brown',
      priorityMembersNotified: ['+1-555-0127']
    },
    {
      id: '3',
      title: 'Community Safety Report',
      description: 'Suspicious activity reported by community member',
      type: 'community',
      severity: 'medium',
      status: 'reported',
      location: {
        latitude: 40.7614,
        longitude: -73.9776,
        address: 'Broadway, New York, NY'
      },
      reporter: {
        id: 'user_3',
        name: 'Mike Wilson',
        phone: '+1-555-0128',
        role: 'family'
      },
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      priorityMembersNotified: []
    }
  ]);

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'reported', label: 'Reported', color: 'secondary' },
    { value: 'investigating', label: 'Investigating', color: 'yellow' },
    { value: 'responding', label: 'Responding', color: 'orange' },
    { value: 'resolved', label: 'Resolved', color: 'green' },
    { value: 'closed', label: 'Closed', color: 'gray' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severity', color: 'gray' },
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'critical', label: 'Critical', color: 'red' }
  ];

  const filteredIncidents = incidents.filter(incident => {
    const statusMatch = filterStatus === 'all' || incident.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || incident.severity === filterSeverity;
    return statusMatch && severityMatch;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      reported: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300',
      investigating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      responding: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[status as keyof typeof colors] || colors.reported;
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
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

  const handleStatusUpdate = (incidentId: string, newStatus: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { ...incident, status: newStatus as any }
        : incident
    ));
  };

  const handleAssign = (incidentId: string, assignedTo: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { ...incident, assignedTo }
        : incident
    ));
  };

  const stats = {
    total: incidents.length,
    active: incidents.filter(i => ['reported', 'investigating', 'responding'].includes(i.status)).length,
    critical: incidents.filter(i => i.severity === 'critical').length,
    resolved: incidents.filter(i => i.status === 'resolved').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Incident Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor and respond to safety incidents</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800">
          <Plus className="h-4 w-4" />
          <span>New Incident</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center bg-opacity-35 border-none">
          <AlertTriangle className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Incidents</p>
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

      {/* Filters */}
      <Card className="p-4 bg-opacity-35 border-none">
        <div className="flex flex-wrap gap-4">
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
        </div>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident, index) => {
          const TypeIcon = getTypeIcon(incident.type);
          return (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow bg-opacity-55 border-none">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-red-600 dark:text-red-300" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{incident.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                          {incident.status.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                          {incident.severity.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{incident.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {incident.location.address}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTimeAgo(incident.timestamp)}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {incident.reporter.name}
                        </div>
                      </div>
                      
                      {incident.assignedTo && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <strong>Assigned to:</strong> {incident.assignedTo}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      View Details
                    </Button>
                    
                    {incident.status === 'reported' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(incident.id, 'investigating')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        Investigate
                      </Button>
                    )}
                    
                    {incident.status === 'investigating' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(incident.id, 'responding')}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Respond
                      </Button>
                    )}
                    
                    {incident.status === 'responding' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(incident.id, 'resolved')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Incident Details
              </h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <p className="text-gray-900 dark:text-white">{selectedIncident.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="text-gray-900 dark:text-white">{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <p className="text-gray-900 dark:text-white">{selectedIncident.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity</label>
                  <p className="text-gray-900 dark:text-white">{selectedIncident.severity}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <p className="text-gray-900 dark:text-white">{selectedIncident.location.address}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedIncident.location.latitude}, {selectedIncident.location.longitude}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reporter</label>
                <p className="text-gray-900 dark:text-white">{selectedIncident.reporter.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{selectedIncident.reporter.phone}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority Members Notified</label>
                <div className="space-y-1">
                  {selectedIncident.priorityMembersNotified.map((contact, index) => (
                    <p key={index} className="text-sm text-gray-600 dark:text-gray-300">{contact}</p>
                  ))}
                </div>
              </div>

              {selectedIncident.blockchainTxId && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Blockchain Transaction</label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">{selectedIncident.blockchainTxId}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setSelectedIncident(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => handleCall(selectedIncident.reporter.phone)}
                className="bg-secondary-600 hover:bg-secondary-700 text-white"
              >
                Call Reporter
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
