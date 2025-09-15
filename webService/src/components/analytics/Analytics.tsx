import React, { useState } from 'react';
import { Users, MapPin, AlertTriangle, Clock, Shield, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface AnalyticsData {
  incidents: {
    total: number;
    byType: { [key: string]: number };
    bySeverity: { [key: string]: number };
    byStatus: { [key: string]: number };
    monthly: { month: string; count: number }[];
  };
  users: {
    total: number;
    byRole: { [key: string]: number };
    active: number;
    newThisMonth: number;
  };
  safety: {
    riskAreas: number;
    alerts: number;
    responseTime: number;
    resolutionRate: number;
  };
  locations: {
    hotspots: { name: string; count: number; severity: string }[];
    safeZones: { name: string; rating: number }[];
  };
}

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('incidents');

  const analyticsData: AnalyticsData = {
    incidents: {
      total: 156,
      byType: {
        panic: 45,
        geofence: 38,
        community: 32,
        authority: 25,
        weather: 12,
        political: 4
      },
      bySeverity: {
        critical: 8,
        high: 34,
        medium: 67,
        low: 47
      },
      byStatus: {
        reported: 12,
        investigating: 18,
        responding: 8,
        resolved: 98,
        closed: 20
      },
      monthly: [
        { month: 'Jan', count: 23 },
        { month: 'Feb', count: 31 },
        { month: 'Mar', count: 28 },
        { month: 'Apr', count: 35 },
        { month: 'May', count: 42 },
        { month: 'Jun', count: 38 }
      ]
    },
    users: {
      total: 2847,
      byRole: {
        tourist: 2156,
        family: 456,
        authority: 235
      },
      active: 1923,
      newThisMonth: 234
    },
    safety: {
      riskAreas: 47,
      alerts: 892,
      responseTime: 4.2, // minutes
      resolutionRate: 87.5 // percentage
    },
    locations: {
      hotspots: [
        { name: 'Times Square', count: 23, severity: 'high' },
        { name: 'Central Park', count: 18, severity: 'medium' },
        { name: 'Broadway', count: 15, severity: 'medium' },
        { name: 'Brooklyn Bridge', count: 12, severity: 'low' }
      ],
      safeZones: [
        { name: 'Museum District', rating: 4.8 },
        { name: 'Financial District', rating: 4.6 },
        { name: 'University Area', rating: 4.5 },
        { name: 'Residential Zone', rating: 4.4 }
      ]
    }
  };

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const metrics = [
    { value: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { value: 'users', label: 'Users', icon: Users },
    { value: 'safety', label: 'Safety', icon: Shield },
    { value: 'locations', label: 'Locations', icon: MapPin }
  ];

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    };
    return colors[severity as keyof typeof colors] || 'text-gray-600';
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Comprehensive safety and incident analytics</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <Button variant="secondary" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Metric Tabs */}
      <Card className="p-4 bg-opacity-55 border-none">
        <div className="flex space-x-1">
          {metrics.map((metric) => (
            <button
              key={metric.value}
              onClick={() => setSelectedMetric(metric.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedMetric === metric.value
                  ? 'bg-secondary-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <metric.icon className="h-4 w-4" />
              <span>{metric.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.incidents.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Incidents</p>
          <p className="text-xs text-green-600 mt-1">↓ 12% from last month</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <Users className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.users.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Users</p>
          <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.safety.responseTime}m</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Avg Response Time</p>
          <p className="text-xs text-green-600 mt-1">↓ 15% from last month</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.safety.resolutionRate}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Resolution Rate</p>
          <p className="text-xs text-green-600 mt-1">↑ 3% from last month</p>
        </Card>
      </div>

      {/* Incidents Analytics */}
      {selectedMetric === 'incidents' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incidents by Type */}
          <Card className="p-6 bg-opacity-55 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Incidents by Type</h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.incidents.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-secondary-500 h-2 rounded-full"
                        style={{ width: `${(count / analyticsData.incidents.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Incidents by Severity */}
          <Card className="p-6 bg-opacity-55 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Incidents by Severity</h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.incidents.bySeverity).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${getSeverityColor(severity)}`}>
                    {severity.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          severity === 'critical' ? 'bg-red-500' :
                          severity === 'high' ? 'bg-orange-500' :
                          severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(count / analyticsData.incidents.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Users Analytics */}
      {selectedMetric === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Role */}
          <Card className="p-6 bg-opacity-55 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Users by Role</h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.users.byRole).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{role}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-secondary-500 h-2 rounded-full"
                        style={{ width: `${(count / analyticsData.users.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* User Activity */}
          <Card className="p-6 bg-opacity-55 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Active Users</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{analyticsData.users.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">New This Month</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{analyticsData.users.newThisMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Activity Rate</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {Math.round((analyticsData.users.active / analyticsData.users.total) * 100)}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Safety Analytics */}
      {selectedMetric === 'safety' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Safety Metrics */}
          <Card className="p-6 bg-opacity-55 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Safety Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Risk Areas</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{analyticsData.safety.riskAreas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Alerts</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{analyticsData.safety.alerts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Avg Response Time</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{analyticsData.safety.responseTime}m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Resolution Rate</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{analyticsData.safety.resolutionRate}%</span>
              </div>
            </div>
          </Card>

          {/* Monthly Trend */}
          <Card className="p-6 bg-opacity-55 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Incident Trend</h3>
            <div className="space-y-2">
              {analyticsData.incidents.monthly.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{month.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-secondary-500 h-2 rounded-full"
                        style={{ width: `${(month.count / Math.max(...analyticsData.incidents.monthly.map(m => m.count))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{month.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Locations Analytics */}
      {selectedMetric === 'locations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Safety Hotspots */}
          <Card className="p-6 bg-opacity-55 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Safety Hotspots</h3>
            <div className="space-y-3">
              {analyticsData.locations.hotspots.map((hotspot, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{hotspot.name}</span>
                    <span className={`ml-2 text-xs ${getSeverityColor(hotspot.severity)}`}>
                      {hotspot.severity.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{hotspot.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Safe Zones */}
          <Card className="p-6 bg-opacity-55 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Safe Zones</h3>
            <div className="space-y-3">
              {analyticsData.locations.safeZones.map((zone, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{zone.name}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{zone.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(zone.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
