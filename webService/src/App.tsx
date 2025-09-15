import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { TouristDashboard } from './components/dashboard/TouristDashboard';
import { FamilyDashboard } from './components/dashboard/FamilyDashboard';
import { AuthorityDashboard } from './components/dashboard/AuthorityDashboard';
import { MapView } from './components/map/MapView';
import { TripPlanner } from './components/trips/TripPlanner';
import { CommunityFeedback } from './components/community/CommunityFeedback';
import { HomePage } from './components/HomePage';
import { PriorityMembers } from './components/PriorityMembers';
import { RiskAreaAlertSystem } from './components/RiskAreaAlert';
import { ExpenseTracking } from './components/expenses/ExpenseTracking';
import { TrackLovedOnes } from './components/tracking/TrackLovedOnes';
import { IncidentManagement } from './components/incidents/IncidentManagement';
import { Analytics } from './components/analytics/Analytics';
import { IDVerification } from './components/verification/IDVerification';
import { Profile } from './components/profile/Profile';
import { Notifications } from './components/notifications/Notifications';
import { SafetyAlerts } from './components/alerts/SafetyAlerts';
import { PageTransition } from './components/PageTransition';
import { ThemeProvider, useTheme } from './lib/theme';
import { useAppStore } from './lib/store';
import { authService } from './lib/auth';
import { wsService } from './lib/websocket';
import { databaseService } from './lib/database';
import { sampleTrips, sampleSafetyAlerts } from './lib/sample-data';
import { User, PriorityMember, RiskArea, RiskAreaAlert } from './types';

function AppContent() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeView, setActiveView] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showHome, setShowHome] = useState(true);
  const [priorityMembers, setPriorityMembers] = useState<PriorityMember[]>([]);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  const [riskAreaAlerts, setRiskAreaAlerts] = useState<RiskAreaAlert[]>([]);
  
  const { user, setUser, setTrips, addSafetyAlert, setActiveTrip } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database connection
      await databaseService.connect({
        server: 'localhost',
        database: 'TripSecure',
        username: 'sa',
        password: 'YourPassword123!',
        port: 1433,
        encrypt: false
      });

      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        loadSampleData();
        loadUserData(currentUser.id);
        wsService.connect();
        setShowHome(false);
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Load priority members
      const members = await databaseService.getPriorityMembers(userId);
      setPriorityMembers(members);

      // Load risk areas
      const areas = await databaseService.getRiskAreas();
      setRiskAreas(areas);

      // Load risk area alerts
      const alerts = await databaseService.getRiskAreaAlerts(userId);
      setRiskAreaAlerts(alerts);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadSampleData = () => {
    // Load sample data for demonstration
    setTrips(sampleTrips);
    setActiveTrip(sampleTrips[0]);
    
    // Load sample safety alerts
    sampleSafetyAlerts.forEach(alert => {
      addSafetyAlert(alert);
    });
  };

  const handleLogin = async (userData: User) => {
    setUser(userData);
    loadSampleData();
    await loadUserData(userData.id);
    wsService.connect();
    setShowHome(false);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('home');
    setShowHome(true);
    wsService.disconnect();
  };

  const handleGetStarted = () => {
    setAuthMode('register');
    setShowHome(false);
  };

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowHome(false);
  };

  const handleBackToHome = () => {
    setShowHome(true);
    setActiveView('home');
  };

  // Priority Members handlers
  const handleAddPriorityMember = async (member: Omit<PriorityMember, 'id'>) => {
    try {
      const newMember = {
        ...member,
        id: `pm_${Date.now()}`,
        userId: user?.id || ''
      };
      
      await databaseService.createPriorityMember(newMember);
      setPriorityMembers([...priorityMembers, newMember]);
    } catch (error) {
      console.error('Failed to add priority member:', error);
    }
  };

  const handleUpdatePriorityMember = async (id: string, updates: Partial<PriorityMember>) => {
    try {
      await databaseService.query(
        'UPDATE priority_members SET name = ?, phone = ?, email = ?, relationship = ?, has_location_access = ? WHERE id = ?',
        [updates.name, updates.phone, updates.email, updates.relationship, updates.hasLocationAccess, id]
      );
      
      setPriorityMembers(members => 
        members.map(member => 
          member.id === id ? { ...member, ...updates } : member
        )
      );
    } catch (error) {
      console.error('Failed to update priority member:', error);
    }
  };

  const handleDeletePriorityMember = async (id: string) => {
    try {
      await databaseService.deletePriorityMember(id);
      setPriorityMembers(members => members.filter(member => member.id !== id));
    } catch (error) {
      console.error('Failed to delete priority member:', error);
    }
  };

  // Risk Area Alert handlers
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await databaseService.acknowledgeRiskAreaAlert(alertId);
      setRiskAreaAlerts(alerts => 
        alerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, isAcknowledged: true, acknowledgedAt: new Date() }
            : alert
        )
      );
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setRiskAreaAlerts(alerts => alerts.filter(alert => alert.id !== alertId));
  };

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'tourist':
        return <TouristDashboard />;
      case 'family':
        return <FamilyDashboard />;
      case 'authority':
        return <AuthorityDashboard />;
      default:
        return <TouristDashboard />;
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomePage 
            onGetStarted={handleGetStarted}
            onLogin={handleLoginClick}
          />
        );
      case 'dashboard':
        return renderDashboard();
      case 'map':
        return <MapView />;
      case 'trips':
        return <TripPlanner />;
      case 'community':
        return <CommunityFeedback />;
      case 'priority-members':
        return (
          <PriorityMembers
            members={priorityMembers}
            onAddMember={handleAddPriorityMember}
            onUpdateMember={handleUpdatePriorityMember}
            onDeleteMember={handleDeletePriorityMember}
            maxMembers={3}
          />
        );
      case 'risk-alerts':
        return (
          <RiskAreaAlertSystem
            alerts={riskAreaAlerts}
            riskAreas={riskAreas}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onDismissAlert={handleDismissAlert}
          />
        );
      case 'expenses':
        return <ExpenseTracking />;
      case 'alerts':
        return <SafetyAlerts />;
      case 'tracking':
        return <TrackLovedOnes />;
      case 'incidents':
        return <IncidentManagement />;
      case 'analytics':
        return <Analytics />;
      case 'verification':
        return <IDVerification />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      default:
        return renderDashboard();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-secondary-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (showHome) {
    return (
      <PageTransition>
        {renderContent()}
      </PageTransition>
    );
  }

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        {authMode === 'login' ? (
          <LoginForm
            key="login"
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthMode('register')}
            onBackToHome={handleBackToHome}
          />
        ) : (
          <RegisterForm
            key="register"
            onRegister={handleLogin}
            onSwitchToLogin={() => setAuthMode('login')}
            onBackToHome={handleBackToHome}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onLogout={handleLogout} onBackToHome={handleBackToHome} />
      
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 bg-primary-200 dark:bg-secondary-600 p-6">
          <PageTransition>
            {renderContent()}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

