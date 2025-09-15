import React, { useState } from 'react';
import { User, MapPin, Shield, Edit, Save, X, Camera, Bell, Lock, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAppStore } from '../../lib/store';

export const Profile: React.FC = () => {
  const { user } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'tourist',
    locationAccess: user?.locationAccess || false,
    notifications: {
      email: true,
      sms: true,
      push: true,
      emergency: true
    },
    privacy: {
      shareLocation: true,
      shareWithFamily: true,
      shareWithAuthorities: true
    }
  });

  const [tempData, setTempData] = useState(profileData);

  const handleEdit = () => {
    setTempData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
    // In real app, save to backend
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setTempData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const handlePrivacyChange = (type: string, value: boolean) => {
    setTempData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: value
      }
    }));
  };

  const getRoleColor = (role: string) => {
    const colors = {
      tourist: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      family: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      authority: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[role as keyof typeof colors] || colors.tourist;
  };

  const getRoleDescription = (role: string) => {
    const descriptions = {
      tourist: 'Traveler using TripSecure for safety during trips',
      family: 'Family member monitoring loved ones\' safety',
      authority: 'Law enforcement or emergency response personnel'
    };
    return descriptions[role as keyof typeof descriptions] || descriptions.tourist;
  };

  return (
    <div className="space-y-6 p-6 bg-primary-200 dark:bg-secondary-600">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account information and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit} className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={handleCancel} className="flex items-center space-x-2">
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            <Button onClick={handleSave} className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800 ">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6 bg-opacity-35 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(profileData.role)}`}>
                      {profileData.role.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {getRoleDescription(profileData.role)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Location Settings */}
          <Card className="p-6  bg-opacity-35 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Location Access</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Allow TripSecure to access your location for safety features
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEditing ? tempData.locationAccess : profileData.locationAccess}
                    onChange={(e) => handleInputChange('locationAccess', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6  bg-opacity-35 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {Object.entries(profileData.notifications).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                      {type.replace('_', ' ')} Notifications
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {type === 'email' && 'Receive notifications via email'}
                      {type === 'sms' && 'Receive notifications via SMS'}
                      {type === 'push' && 'Receive push notifications on your device'}
                      {type === 'emergency' && 'Receive emergency alerts and updates'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEditing ? tempData.notifications[type as keyof typeof tempData.notifications] : enabled}
                      onChange={(e) => handleNotificationChange(type, e.target.checked)}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-6  bg-opacity-35 border-none ">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Share Location with Family</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Allow family members to see your location for safety monitoring
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEditing ? tempData.privacy.shareWithFamily : profileData.privacy.shareWithFamily}
                    onChange={(e) => handlePrivacyChange('shareWithFamily', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Share Location with Authorities</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Allow emergency services to access your location during incidents
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEditing ? tempData.privacy.shareWithAuthorities : profileData.privacy.shareWithAuthorities}
                    onChange={(e) => handlePrivacyChange('shareWithAuthorities', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card className="p-6 text-center  bg-opacity-35 border-none">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-white dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-primary-600 dark:text-primary-300" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-800 transition-colors">
                  <Camera className="h-4 w-4 bg-primary-600 hover:bg-primary-800" />
                </button>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{profileData.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{profileData.email}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(profileData.role)}`}>
              {profileData.role.toUpperCase()}
            </span>
          </Card>

          {/* Account Status */}
          <Card className="p-6  bg-opacity-35 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Verification Status</span>
                <span className="flex items-center text-green-400">
                  <Shield className="h-4 w-4 mr-1" />
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Location Sharing</span>
                <span className={`flex items-center ${profileData.locationAccess ? 'text-green-600' : 'text-red-600'}`}>
                  <MapPin className="h-4 w-4 mr-1" />
                  {profileData.locationAccess ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Member Since</span>
                <span className="text-sm text-gray-900 dark:text-white">January 2024</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6  bg-opacity-35 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
