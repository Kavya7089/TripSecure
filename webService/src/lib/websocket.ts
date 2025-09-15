import { useAppStore } from './store';
import { SafetyAlert, Location, PanicAlert } from '../types';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private readonly url = 'wss://api.tourist-safety.demo/ws';

  connect() {
    // Mock WebSocket connection for demo
    console.log('Connecting to WebSocket...');
    useAppStore.getState().setConnection(true);
    
    // Simulate real-time updates
    this.startMockUpdates();
  }

  private startMockUpdates() {
    // Simulate location updates every 30 seconds
    setInterval(() => {
      const { activeTrip } = useAppStore.getState();
      if (activeTrip) {
        const newLocation: Location = {
          id: Date.now().toString(),
          latitude: 40.7589 + (Math.random() - 0.5) * 0.01,
          longitude: -73.9851 + (Math.random() - 0.5) * 0.01,
          address: 'Times Square, NYC',
          timestamp: new Date(),
          accuracy: 10
        };
        
        useAppStore.getState().updateTripLocation(activeTrip.id, newLocation);
      }
    }, 30000);

    // Simulate safety alerts
    setTimeout(() => {
      this.simulateSafetyAlert();
    }, 45000);
  }

  private simulateSafetyAlert() {
    const alert: SafetyAlert = {
      id: Date.now().toString(),
      type: 'community',
      severity: 'medium',
      title: 'Pickpocketing Reported',
      description: 'Multiple tourists reported pickpocketing incidents in this area',
      location: {
        id: Date.now().toString(),
        latitude: 40.7589,
        longitude: -73.9851,
        address: 'Times Square, NYC',
        timestamp: new Date()
      },
      timestamp: new Date(),
      isResolved: false
    };

    useAppStore.getState().addSafetyAlert(alert);
  }

  sendPanicAlert(location: Location, audioData?: Blob) {
    const panicAlert: PanicAlert = {
      id: Date.now().toString(),
      touristId: useAppStore.getState().user?.id || '',
      location,
      timestamp: new Date(),
      audioRecording: audioData ? 'mock-audio-url' : undefined,
      blockchainTxId: '0x' + Math.random().toString(16).substr(2, 8),
      status: 'active',
      respondingAuthorities: [],
      familyNotified: false
    };

    useAppStore.getState().addPanicAlert(panicAlert);
    console.log('Panic alert sent:', panicAlert);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    useAppStore.getState().setConnection(false);
  }
}

export const wsService = new WebSocketService();