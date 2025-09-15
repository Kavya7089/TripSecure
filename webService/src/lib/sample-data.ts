import { Trip, CommunityFeedback, SafetyAlert, HeatmapData } from '../types';

export const sampleTrips: Trip[] = [
  {
    id: '1',
    touristId: '1',
    title: 'New York Adventure',
    destination: 'New York City, USA',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-20'),
    status: 'active',
    currentLocation: {
      id: '1',
      latitude: 40.7589,
      longitude: -73.9851,
      address: 'Times Square, New York, NY',
      timestamp: new Date()
    },
    plannedRoute: [
      {
        id: '2',
        latitude: 40.7589,
        longitude: -73.9851,
        address: 'Times Square',
        timestamp: new Date()
      },
      {
        id: '3',
        latitude: 40.7505,
        longitude: -73.9934,
        address: 'Empire State Building',
        timestamp: new Date()
      }
    ],
    expenses: [
      {
        id: '1',
        tripId: '1',
        category: 'accommodation',
        amount: 200,
        description: 'Hotel Booking',
        date: new Date('2024-01-15'),
        paymentMethod: 'razorpay'
      }
    ],
    safetyAlerts: [],
    totalBudget: 2000,
    spentAmount: 850
  }
];

export const sampleCommunityFeedback: CommunityFeedback[] = [
  {
    id: '1',
    userId: '1',
    location: {
      id: '1',
      latitude: 40.7589,
      longitude: -73.9851,
      address: 'Times Square, NYC',
      timestamp: new Date('2024-01-14')
    },
    safetyRating: 4,
    category: 'safe',
    description: 'Well-lit area with good police presence',
    timestamp: new Date('2024-01-14'),
    upvotes: 15,
    downvotes: 2,
    isVerified: true
  },
  {
    id: '2',
    userId: '2',
    location: {
      id: '2',
      latitude: 40.7505,
      longitude: -73.9934,
      address: 'Empire State Building area',
      timestamp: new Date('2024-01-13')
    },
    safetyRating: 2,
    category: 'scam',
    description: 'Fake ticket sellers around tourist spots',
    timestamp: new Date('2024-01-13'),
    upvotes: 8,
    downvotes: 1,
    isVerified: true
  }
];

export const sampleSafetyAlerts: SafetyAlert[] = [
  {
    id: '1',
    type: 'community',
    severity: 'medium',
    title: 'Pickpocketing Alert',
    description: 'Increased pickpocketing reports in subway stations',
    location: {
      id: '1',
      latitude: 40.7589,
      longitude: -73.9851,
      address: 'Times Square Subway',
      timestamp: new Date()
    },
    timestamp: new Date(),
    isResolved: false
  }
];

export const sampleHeatmapData: HeatmapData[] = [
  {
    location: {
      id: '1',
      latitude: 40.7589,
      longitude: -73.9851,
      address: 'Times Square',
      timestamp: new Date()
    },
    safetyScore: 7.5,
    incidentCount: 3,
    feedbackCount: 15,
    lastUpdated: new Date()
  },
  {
    location: {
      id: '2',
      latitude: 40.7505,
      longitude: -73.9934,
      address: 'Empire State Building',
      timestamp: new Date()
    },
    safetyScore: 6.2,
    incidentCount: 5,
    feedbackCount: 8,
    lastUpdated: new Date()
  }
];