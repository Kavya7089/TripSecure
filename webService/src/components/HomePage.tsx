import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Users, Bell, Globe, Lock, Star, ArrowRight, Sun, Moon } from 'lucide-react';
import { Button } from './ui/Button';
import { useTheme } from '../lib/theme'; // <-- Add this import

interface HomePageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onLogin }) => {
  const { theme, toggleTheme } = useTheme(); // <-- Add this hook

  const features = [
    {
      icon: Shield,
      title: 'Real-time Safety Monitoring',
      description: 'Advanced location tracking with instant alerts for risky areas and emergency situations.'
    },
    {
      icon: Users,
      title: 'Priority Member System',
      description: 'Connect with up to 3 priority members who can access your location for safety.'
    },
    {
      icon: Bell,
      title: 'Smart Alert System',
      description: 'Get notified when entering high-risk areas with automatic family notifications.'
    },
    {
      icon: MapPin,
      title: 'Interactive Maps',
      description: 'Real-time maps with safety ratings, community feedback, and route planning.'
    },
    {
      icon: Globe,
      title: 'Community Safety',
      description: 'Share and receive safety information from the community and authorities.'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'End-to-end encryption with blockchain verification for all safety data.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50+', label: 'Cities Covered' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  // Handler for About Us button (scrolls to About section)
  const handleAboutUs = useCallback(() => {
    const aboutSection = document.getElementById('about-us-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900">
      {/* Navbar */}
      <nav className="w-full bg-primary-50 dark:bg-secondary-800 backdrop-blur sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-secondary-600 dark:text-white tracking-tight">
            TripSecure
          </div>
          <div className="flex items-center gap-4">
            {/* Mode Toggle Button */}
            <Button
              variant="ghost"
              className="p-2 rounded-lg"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
            </Button>
            <Button
              variant="ghost"
              className="text-secondary-600 dark:text-secondary-300 font-semibold"
              onClick={handleAboutUs}
            >
              About Us
            </Button>
            <Button
              variant="outline"
              className="border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-white font-semibold"
              onClick={onLogin}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-600/10 to-primary-600/10 dark:from-secondary-400/20 dark:to-primary-400/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
                TripSecure
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your trusted companion for safe travels. Real-time monitoring, smart alerts, and community-driven safety.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onGetStarted}
                className=" bg-secondary-700 hover:bg-secondary-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={onLogin}
                variant="outline"
                className="border-2 border-secondary-600 dark:border-primary-600 text-secondary-600 dark:text-primary-600 hover:bg-secondary-600 dark:hover:bg-primary-600 hover:text-white dark:hover:text-slate-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary-200 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose TripSecure?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced safety features designed to keep you and your loved ones secure during travels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about-us-section"
        className="py-20 bg-primary-300 dark:bg-secondary-600 border-t border-gray-100 dark:border-gray-700"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              TripSecure was founded with a mission to make travel safer for everyone. Our team is passionate about leveraging technology to provide real-time safety, smart alerts, and a supportive community for travelers worldwide.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              We believe that everyone deserves peace of mind while exploring new places. With advanced features and a user-first approach, TripSecure is your trusted companion on every journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-600 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-secondary-100 text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary-200 dark:bg-primary-200">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Travel Safely?
            </h2>
            <p className="text-xl text-gray-600  mb-8">
              Join thousands of travelers who trust TripSecure for their safety needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">TripSecure</h3>
            <p className="text-gray-400 mb-6">
              Your safety is our priority. Travel with confidence.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
