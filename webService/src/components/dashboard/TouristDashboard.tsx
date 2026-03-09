import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, DollarSign, Calendar, Shield, Plus, Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAppStore } from '../../lib/store';
import { sampleTrips } from '../../lib/sample-data';
import { authService } from "../../lib/auth";
import { databaseService } from "../../lib/database";

const user = authService.getCurrentUser();
if (!user) {
  window.location.href = "/login"; // redirect if not logged in
}

export const TouristDashboard: React.FC = () => {
  const { user, activeTrip, safetyAlerts } = useAppStore();
  const trip = activeTrip || sampleTrips[0];

  const [showTripModal, setShowTripModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: 0,
    travelers: 1
  });

  // Submit new trip
  const handleCreateTrip = async () => {
    try {
      const tripData = {
  tourist: user?.id || "",   // ✅ must match schema
  title: newTrip.title,
  destination: newTrip.destination,
  startDate: new Date(newTrip.startDate),
  endDate: new Date(newTrip.endDate),
  totalBudget: newTrip.budget,
  travelers: newTrip.travelers,
  spentAmount: 0,
  status: "PLANNED",   // match enum (uppercase)
  plannedRoute: [],
  expenses: [],
  safetyAlerts: []
};
await databaseService.createTrip(tripData);


      const tripId = await databaseService.createTrip(tripData);
      console.log("Trip created with ID:", tripId);

      // reset + close
      setShowTripModal(false);
      setNewTrip({ title: "", destination: "", startDate: "", endDate: "", budget: 0, travelers: 1 });

      // optional: refresh UI
      window.location.reload();
    } catch (err) {
      console.error("Error creating trip:", err);
    }
  };

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
      {/* Header */}
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Stay safe on your adventures</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowTripModal(true)}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800"
        >
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

      {/* New Trip Modal */}
      <Modal isOpen={showTripModal} onClose={() => setShowTripModal(false)} title="Plan New Trip" size="lg">
        <div className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Trip Title" value={newTrip.title}
              onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="Destination" value={newTrip.destination}
              onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" value={newTrip.startDate}
              onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="date" value={newTrip.endDate}
              onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" placeholder="Budget" value={newTrip.budget}
              onChange={(e) => setNewTrip({ ...newTrip, budget: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="number" min="1" placeholder="Travelers" value={newTrip.travelers}
              onChange={(e) => setNewTrip({ ...newTrip, travelers: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowTripModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateTrip}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800">
              <Save className="h-4 w-4" />
              <span>Create Trip</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
