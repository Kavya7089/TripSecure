import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Users, Plus, Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAppStore } from '../../lib/store';
import { Trip } from '../../types';

export const TripPlanner: React.FC = () => {
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 0,
    travelers: 1
  });
  const { trips, user } = useAppStore();

  const handleCreateTrip = () => {
    const trip: Trip = {
      id: Date.now().toString(),
      touristId: user?.id || '',
      title: newTrip.title,
      destination: newTrip.destination,
      startDate: new Date(newTrip.startDate),
      endDate: new Date(newTrip.endDate),
      status: 'planned',
      plannedRoute: [],
      expenses: [],
      safetyAlerts: [],
      totalBudget: newTrip.budget,
      spentAmount: 0
    };

    // Add to store (mock)
    console.log('Created trip:', trip);
    setShowNewTripModal(false);
    setNewTrip({
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      budget: 0,
      travelers: 1
    });
  };

  const mockTrips: Trip[] = [
    {
      id: '1',
      touristId: user?.id || '',
      title: 'New York Adventure',
      destination: 'New York City, USA',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-20'),
      status: 'active',
      plannedRoute: [],
      expenses: [],
      safetyAlerts: [],
      totalBudget: 2000,
      spentAmount: 850
    },
    {
      id: '2',
      touristId: user?.id || '',
      title: 'Tokyo Explorer',
      destination: 'Tokyo, Japan',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-18'),
      status: 'planned',
      plannedRoute: [],
      expenses: [],
      safetyAlerts: [],
      totalBudget: 3500,
      spentAmount: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600">Plan and manage your travel adventures</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNewTripModal(true)}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          <span>New Trip</span>
        </Button>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTrips.map((trip, index) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full  bg-opacity-55 border-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{trip.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trip.status === 'active' ? 'bg-green-100 text-green-800' :
                  trip.status === 'planned' ? 'bg-secondary-100 text-secondary-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{trip.destination}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span>${trip.spentAmount} / ${trip.totalBudget}</span>
                </div>

                {/* Budget Progress */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      (trip.spentAmount / trip.totalBudget) > 0.8 ? 'bg-red-500' :
                      (trip.spentAmount / trip.totalBudget) > 0.6 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((trip.spentAmount / trip.totalBudget) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button variant="secondary" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* New Trip Modal */}
      <Modal
        isOpen={showNewTripModal}
        onClose={() => setShowNewTripModal(false)}
        title="Plan New Trip"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Title
              </label>
              <input
                type="text"
                value={newTrip.title}
                onChange={(e) => setNewTrip(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                placeholder="My Amazing Trip"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={newTrip.destination}
                onChange={(e) => setNewTrip(prev => ({ ...prev, destination: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                placeholder="Paris, France"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={newTrip.startDate}
                onChange={(e) => setNewTrip(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={newTrip.endDate}
                onChange={(e) => setNewTrip(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget ($)
              </label>
              <input
                type="number"
                value={newTrip.budget}
                onChange={(e) => setNewTrip(prev => ({ ...prev, budget: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                placeholder="2000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travelers
              </label>
              <input
                type="number"
                value={newTrip.travelers}
                onChange={(e) => setNewTrip(prev => ({ ...prev, travelers: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                min="1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowNewTripModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateTrip}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800"
            >
              <Save className="h-4 w-4" />
              <span>Create Trip</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};