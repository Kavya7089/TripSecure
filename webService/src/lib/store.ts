import { create } from 'zustand';
import { User, Trip, SafetyAlert, CommunityFeedback, PanicAlert } from '../types';

interface AppState {
  user: User | null;
  trips: Trip[];
  activeTrip: Trip | null;
  safetyAlerts: SafetyAlert[];
  communityFeedback: CommunityFeedback[];
  panicAlerts: PanicAlert[];
  isConnected: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setTrips: (trips: Trip[]) => void;
  setActiveTrip: (trip: Trip | null) => void;
  addSafetyAlert: (alert: SafetyAlert) => void;
  addCommunityFeedback: (feedback: CommunityFeedback) => void;
  addPanicAlert: (alert: PanicAlert) => void;
  setConnection: (connected: boolean) => void;
  updateTripLocation: (tripId: string, location: Location) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  trips: [],
  activeTrip: null,
  safetyAlerts: [],
  communityFeedback: [],
  panicAlerts: [],
  isConnected: false,

  setUser: (user) => set({ user }),
  
  setTrips: (trips) => set({ trips }),
  
  setActiveTrip: (trip) => set({ activeTrip: trip }),
  
  addSafetyAlert: (alert) => set((state) => ({ 
    safetyAlerts: [alert, ...state.safetyAlerts] 
  })),
  
  addCommunityFeedback: (feedback) => set((state) => ({
    communityFeedback: [feedback, ...state.communityFeedback]
  })),
  
  addPanicAlert: (alert) => set((state) => ({
    panicAlerts: [alert, ...state.panicAlerts]
  })),
  
  setConnection: (connected) => set({ isConnected: connected }),
  
  updateTripLocation: (tripId, location) => set((state) => ({
    trips: state.trips.map(trip =>
      trip.id === tripId
        ? { ...trip, currentLocation: location }
        : trip
    ),
    activeTrip: state.activeTrip?.id === tripId
      ? { ...state.activeTrip, currentLocation: location }
      : state.activeTrip
  })),
}));