# TripSecure - Smart Tourist Safety Platform

TripSecure is a comprehensive safety platform designed to keep travelers secure during their journeys. The application provides real-time monitoring, smart alerts, priority member management, and community-driven safety features.

## 🌟 Features

### Core Safety Features
- **Real-time Location Tracking** - Advanced GPS monitoring with geofencing
- **Smart Alert System** - Instant notifications for risky areas and emergencies
- **Priority Members** - Connect with up to 3 priority members for safety monitoring
- **Risk Area Detection** - Automatic alerts when entering high-risk zones
- **Emergency Response** - Direct integration with police and travel departments

### User Experience
- **Dark/Light Mode** - Beautiful theme switching with smooth transitions
- **Page Transitions** - Elegant book-opening animations between pages
- **Responsive Design** - Works seamlessly on all devices
- **Modern UI** - Clean, intuitive interface with accessibility in mind

### Database Integration
- **SQL Server Support** - Full database integration with local SQL Server
- **Real-time Sync** - Live data synchronization across all devices
- **Secure Storage** - Encrypted data storage with privacy protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- SQL Server 2019+ (Local or Azure)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TripSecure
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up SQL Server Database**
   ```bash
   # Run the database schema
   sqlcmd -S localhost -i database_schema.sql
   ```

4. **Configure Database Connection**
   Update the database configuration in `src/lib/database.ts`:
   ```typescript
   await databaseService.connect({
     server: 'localhost',
     database: 'TripSecure',
     username: 'your_username',
     password: 'your_password',
     port: 1433,
     encrypt: false
   });
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication forms
│   ├── dashboard/       # Dashboard components
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── map/             # Map and location components
│   ├── trips/           # Trip planning components
│   ├── community/       # Community features
│   └── ui/              # Reusable UI components
├── lib/                 # Core utilities
│   ├── auth.ts          # Authentication service
│   ├── database.ts      # Database service
│   ├── store.ts         # State management
│   ├── theme.tsx        # Theme context
│   └── websocket.ts     # WebSocket service
├── types/               # TypeScript type definitions
└── App.tsx              # Main application component
```

## 🎨 Theme System

TripSecure includes a comprehensive theme system with:

- **Automatic Theme Detection** - Respects system preferences
- **Manual Theme Switching** - Toggle between light and dark modes
- **Persistent Storage** - Remembers user preference
- **Smooth Transitions** - Animated theme changes

### Using the Theme
```typescript
import { useTheme } from './lib/theme';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

## 🔐 Priority Members System

The Priority Members system allows users to:

- **Add up to 3 priority members** who can access location data
- **Default members** include Police and Travel Department
- **Location access control** for each member
- **Real-time notifications** when entering risk areas

### Adding Priority Members
```typescript
const handleAddMember = async (member: PriorityMember) => {
  await databaseService.createPriorityMember({
    ...member,
    userId: currentUser.id
  });
};
```

## 🚨 Risk Area Alert System

The Risk Area Alert System provides:

- **Geofenced risk areas** with configurable radius
- **Automatic detection** when users enter risk zones
- **Priority member notifications** for immediate response
- **Alert acknowledgment** system

### Creating Risk Areas
```typescript
const riskArea = {
  name: 'High Crime Area',
  location: { latitude: 40.7128, longitude: -74.0060 },
  radius: 500, // meters
  riskLevel: 'high',
  alertMessage: 'You have entered a high-risk area. Stay alert!'
};
```

## 🗄️ Database Schema

The application uses SQL Server with the following key tables:

- **users** - User accounts and profiles
- **priority_members** - Priority member relationships
- **risk_areas** - Geofenced risk zones
- **risk_area_alerts** - Alert history and acknowledgments
- **trips** - Trip planning and tracking
- **safety_alerts** - Safety incident reports
- **community_feedback** - Community safety ratings

## 🎭 Page Transitions

TripSecure features beautiful page transitions:

- **Book-opening animation** for main content
- **Slide transitions** for navigation
- **Fade effects** for modal dialogs
- **Smooth scrolling** and micro-interactions

### Using Page Transitions
```typescript
import { PageTransition } from './components/PageTransition';

function MyPage() {
  return (
    <PageTransition>
      <div>Your page content</div>
    </PageTransition>
  );
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_DATABASE_SERVER=localhost
VITE_DATABASE_NAME=TripSecure
VITE_DATABASE_USERNAME=your_username
VITE_DATABASE_PASSWORD=your_password
VITE_MAPBOX_TOKEN=your_mapbox_token
```

### Database Configuration
Update `src/lib/database.ts` with your SQL Server credentials:

```typescript
const config = {
  server: process.env.VITE_DATABASE_SERVER || 'localhost',
  database: process.env.VITE_DATABASE_NAME || 'TripSecure',
  username: process.env.VITE_DATABASE_USERNAME || 'sa',
  password: process.env.VITE_DATABASE_PASSWORD || 'YourPassword123!',
  port: 1433,
  encrypt: false
};
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Azure
1. Create an Azure SQL Database
2. Update connection string
3. Deploy to Azure App Service
4. Configure environment variables

### Deploy to AWS
1. Set up RDS SQL Server instance
2. Configure security groups
3. Deploy using AWS Amplify or EC2
4. Update database configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 Email: support@tripsecure.com
- 📱 Phone: +1-800-TRIP-SECURE
- 💬 Discord: [TripSecure Community](https://discord.gg/tripsecure)
- 📖 Documentation: [docs.tripsecure.com](https://docs.tripsecure.com)

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **Tailwind CSS** for beautiful styling
- **React** for the amazing framework
- **SQL Server** for robust data storage
- **Mapbox** for location services

---

**Made with ❤️ for safer travels**
