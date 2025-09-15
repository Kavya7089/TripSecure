import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, CheckCircle, XCircle, Bell } from 'lucide-react';
import { Button } from './ui/Button';
import { RiskArea, RiskAreaAlert, Location } from '../types';

interface RiskAreaAlertProps {
  alerts: RiskAreaAlert[];
  riskAreas: RiskArea[];
  onAcknowledgeAlert: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
}

export const RiskAreaAlertSystem: React.FC<RiskAreaAlertProps> = ({
  alerts,
  riskAreas,
  onAcknowledgeAlert,
  onDismissAlert
}) => {
  const [activeAlerts, setActiveAlerts] = useState<RiskAreaAlert[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const unacknowledgedAlerts = alerts.filter(alert => !alert.isAcknowledged);
    setActiveAlerts(unacknowledgedAlerts);
    
    if (unacknowledgedAlerts.length > 0) {
      setShowNotification(true);
      // Auto-hide notification after 10 seconds
      setTimeout(() => setShowNotification(false), 10000);
    }
  }, [alerts]);

  const getRiskAreaInfo = (riskAreaId: string) => {
    return riskAreas.find(area => area.id === riskAreaId);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'low':
        return 'bg-secondary-100 text-secondary-800 border-secondary-200 dark:bg-secondary-900/20 dark:text-secondary-300 dark:border-secondary-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      <AnimatePresence>
        {showNotification && activeAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-red-600 text-white p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-3 animate-pulse" />
                <div>
                  <h3 className="font-semibold">Risk Area Alert</h3>
                  <p className="text-sm">
                    You have {activeAlerts.length} unacknowledged risk area alert{activeAlerts.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-white hover:text-red-200 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
          Risk Area Alerts
        </h3>

        {alerts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-secondary-800 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Risk Area Alerts
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              You haven't entered any high-risk areas recently.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => {
              const riskArea = getRiskAreaInfo(alert.riskAreaId);
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-white dark:bg-gray-700 rounded-lg border-l-4 ${
                    alert.isAcknowledged
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/10'
                  } p-6 shadow-sm`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className={`h-5 w-5 mr-2 ${
                          alert.isAcknowledged ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {riskArea?.name || 'Unknown Risk Area'}
                        </h4>
                        {riskArea && (
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium border ${
                            getRiskLevelColor(riskArea.riskLevel)
                          }`}>
                            {riskArea.riskLevel.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {riskArea?.alertMessage || 'You have entered a high-risk area.'}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {alert.location.address || `${alert.location.latitude}, ${alert.location.longitude}`}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTimeAgo(alert.timestamp)}
                        </div>
                      </div>

                      {alert.priorityMembersNotified.length > 0 && (
                        <div className="mt-3 p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                          <p className="text-sm text-secondary-800 dark:text-secondary-300">
                            <strong>Priority members notified:</strong> {alert.priorityMembersNotified.length} member(s)
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {alert.isAcknowledged ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Acknowledged</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Risk Areas Overview */}
      <div className="bg-gray-50 dark:bg-secondary-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Active Risk Areas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {riskAreas.filter(area => area.isActive).map((area) => (
            <div
              key={area.id}
              className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900 dark:text-white">
                  {area.name}
                </h5>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  getRiskLevelColor(area.riskLevel)
                }`}>
                  {area.riskLevel.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {area.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Radius: {area.radius}m
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
