import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Shield, Users, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../lib/store';
import { PanicButton } from './PanicButton';
import { sampleHeatmapData } from '../../lib/sample-data';

// Mock Mapbox component since we can't use the actual Mapbox in this environment
const MapComponent: React.FC<{ center: [number, number]; markers: any[] }> = ({ center, markers }) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className={`border border-gray-300 ${Math.random() > 0.7 ? 'bg-blue-200' : ''}`} />
          ))}
        </div>
      </div>
      
      {/* Mock markers */}
      {markers.map((marker, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="absolute"
          style={{
            left: `${20 + (marker.longitude + 74) * 15}%`,
            top: `${30 + (41 - marker.latitude) * 15}%`
          }}
        >
          <div className={`w-4 h-4 rounded-full ${
            marker.type === 'panic' ? 'bg-red-500' :
            marker.type === 'tourist' ? 'bg-blue-500' :
            marker.type === 'safe' ? 'bg-green-500' :
            'bg-yellow-500'
          } shadow-lg animate-pulse`} />
        </motion.div>
      ))}
      
      {/* Mock location indicator */}
      <motion.div
        className="absolute w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"
        style={{ left: '45%', top: '55%' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      
      {/* Map label */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-lg shadow-md">
        <p className="text-sm font-medium text-gray-700">Interactive Safety Map</p>
      </div>
    </div>
  );
};

export const MapView: React.FC = () => {
  const { user, activeTrip, safetyAlerts, panicAlerts } = useAppStore();
  const [mapCenter, setMapCenter] = useState<[number, number]>([-73.9851, 40.7589]);
  const [selectedLayer, setSelectedLayer] = useState<'heatmap' | 'incidents' | 'safe-zones'>('heatmap');

  // Mock markers data
  const markers = [
    { latitude: 40.7589, longitude: -73.9851, type: 'tourist', data: { name: 'Current Location' } },
    { latitude: 40.7505, longitude: -73.9934, type: 'safe', data: { name: 'Empire State Building' } },
    { latitude: 40.7614, longitude: -73.9776, type: 'warning', data: { name: 'Reported Incident' } },
    ...panicAlerts.map(alert => ({
      latitude: alert.location.latitude,
      longitude: alert.location.longitude,
      type: 'panic',
      data: alert
    }))
  ];

  const mapLayers = [
    { id: 'heatmap', label: 'Safety Heatmap', icon: MapPin },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'safe-zones', label: 'Safe Zones', icon: Shield }
  ];

  const stats = [
    { label: 'Your Location', value: 'Times Square, NYC', icon: MapPin },
    { label: 'Nearby Tourists', value: '23', icon: Users },
    { label: 'Safety Score', value: '8.5/10', icon: Shield },
    { label: 'Active Alerts', value: safetyAlerts.length.toString(), icon: AlertTriangle }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Safety Map</h1>
          <p className="text-gray-600">Real-time monitoring and incident tracking</p>
        </div>
        
        {user?.role === 'tourist' && (
          <PanicButton />
        )}
      </div>

      {/* Map Controls */}
      <Card className=' bg-opacity-35 border-none'>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Map Layers</h2>
          <div className="flex space-x-2">
            {mapLayers.map((layer) => (
              <Button
                key={layer.id}
                variant={selectedLayer === layer.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedLayer(layer.id as any)}
                className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-800 text-gray-300"
              >
                <layer.icon className="h-4 w-4" />
                <span>{layer.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4 text-center"
            >
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Map Container */}
        <div className="h-96 rounded-lg border border-gray-200 overflow-hidden">
          <MapComponent center={mapCenter} markers={markers} />
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Safe Areas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span>Caution</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>High Risk</span>
          </div>
        </div>
      </Card>

      {/* Nearby Incidents */}
      <Card className=' bg-opacity-35 border-none'>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Nearby Safety Information</h2>
        <div className="space-y-3">
          {safetyAlerts.slice(0, 3).map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start space-x-3 p-3 rounded-lg bg-opacity-65  border-l-4 ${
                alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}
            >
              <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                alert.severity === 'critical' ? 'text-red-600' :
                alert.severity === 'high' ? 'text-orange-600' :
                alert.severity === 'medium' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              <div className="flex-1 ">
                <h4 className="font-medium text-gray-900">{alert.title}</h4>
                <p className="text-sm text-gray-600">{alert.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {alert.location.address} • {alert.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};