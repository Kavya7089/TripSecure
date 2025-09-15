export interface User {
  id: string;
  email: string;
  name: string;
  role: 'tourist' | 'family' | 'authority';
  phone?: string;
  emergencyContacts?: EmergencyContact[];
  priorityMembers?: PriorityMember[];
  digitalId?: string;
  avatar?: string;
  isVerified: boolean;
  locationAccess?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isNotifiable: boolean;
}

export interface PriorityMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  hasLocationAccess: boolean;
  isDefault: boolean; // For police and travel department
}

export interface Trip {
  id: string;
  touristId: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'active' | 'completed' | 'emergency';
  currentLocation?: Location;
  plannedRoute: Location[];
  expenses: Expense[];
  safetyAlerts: SafetyAlert[];
  totalBudget: number;
  spentAmount: number;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  timestamp: Date;
  accuracy?: number;
  isGeofenced?: boolean;
}

export interface Expense {
  id: string;
  tripId: string;
  category: 'accommodation' | 'food' | 'transport' | 'activities' | 'emergency' | 'other';
  amount: number;
  description: string;
  date: Date;
  location?: Location;
  paymentMethod: 'cash' | 'card' | 'upi' | 'razorpay';
  receipt?: string;
}

export interface SafetyAlert {
  id: string;
  tripId?: string;
  type: 'panic' | 'geofence' | 'community' | 'authority' | 'weather' | 'political';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: Location;
  timestamp: Date;
  isResolved: boolean;
  respondedBy?: string;
  response?: string;
  blockchainTxId?: string;
}

export interface CommunityFeedback {
  id: string;
  userId: string;
  location: Location;
  safetyRating: 1 | 2 | 3 | 4 | 5;
  category: 'crime' | 'scam' | 'harassment' | 'theft' | 'safe' | 'helpful_locals' | 'good_food' | 'clean';
  description: string;
  images?: string[];
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  isVerified: boolean;
}

export interface HeatmapData {
  location: Location;
  safetyScore: number;
  incidentCount: number;
  feedbackCount: number;
  lastUpdated: Date;
}

export interface PanicAlert {
  id: string;
  touristId: string;
  location: Location;
  timestamp: Date;
  audioRecording?: string;
  videoRecording?: string;
  aiAnalysis?: string;
  blockchainTxId: string;
  status: 'active' | 'responded' | 'resolved' | 'false_alarm';
  respondingAuthorities: string[];
  familyNotified: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  tripId?: string;
  amount: number;
  currency: string;
  gateway: 'razorpay' | 'upi';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionId: string;
  timestamp: Date;
  description: string;
}

export interface AIAssistantMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
  audioUrl?: string;
  isEmergency: boolean;
  sentiment: 'positive' | 'neutral' | 'distress' | 'panic';
}

export interface RiskArea {
  id: string;
  name: string;
  location: Location;
  radius: number; // in meters
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  alertMessage: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskAreaAlert {
  id: string;
  userId: string;
  riskAreaId: string;
  location: Location;
  timestamp: Date;
  isAcknowledged: boolean;
  acknowledgedAt?: Date;
  priorityMembersNotified: string[];
}