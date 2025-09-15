import { User } from '../types';

// Mock authentication service
export class AuthService {
  private static instance: AuthService;
  private users: User[] = [
    {
      id: '1',
      email: 'tourist@demo.com',
      name: 'Alex Chen',
      role: 'tourist',
      phone: '+1234567890',
      isVerified: true,
      digitalId: 'did:eth:0x123...abc',
      emergencyContacts: [
        {
          id: '1',
          name: 'Sarah Chen',
          phone: '+1234567891',
          relationship: 'Sister',
          isNotifiable: true
        }
      ]
    },
    {
      id: '2',
      email: 'family@demo.com',
      name: 'Sarah Chen',
      role: 'family',
      phone: '+1234567891',
      isVerified: true
    },
    {
      id: '3',
      email: 'authority@demo.com',
      name: 'Officer Rodriguez',
      role: 'authority',
      phone: '+1234567892',
      isVerified: true
    }
  ];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<User | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = this.users.find(u => u.email === email);
    if (user && password === 'demo123') {
      localStorage.setItem('authToken', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid credentials');
  }

  async register(userData: Partial<User> & { email: string; password: string }): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      name: userData.name || 'New User',
      email: userData.email,
      role: userData.role || 'tourist',
      phone: userData.phone,
      isVerified: false,
      emergencyContacts: []
    };
    
    this.users.push(user);
    localStorage.setItem('authToken', JSON.stringify(user));
    return user;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('authToken');
    if (token) {
      return JSON.parse(token);
    }
    return null;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
  }
}

export const authService = AuthService.getInstance();