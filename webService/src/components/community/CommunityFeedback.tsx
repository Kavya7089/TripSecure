import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, MapPin, ThumbsUp, ThumbsDown, Plus, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAppStore } from '../../lib/store';
import { sampleCommunityFeedback } from '../../lib/sample-data';

export const CommunityFeedback: React.FC = () => {
  const [showNewFeedbackModal, setShowNewFeedbackModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    location: '',
    category: 'safe' as any,
    safetyRating: 5,
    description: ''
  });
  const { communityFeedback, user } = useAppStore();

  const allFeedback = [...communityFeedback, ...sampleCommunityFeedback];

  const categories = [
    { id: 'safe', label: 'Safe Area', color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'crime', label: 'Crime Report', color: 'text-red-600', bgColor: 'bg-red-100' },
    { id: 'scam', label: 'Scam Alert', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { id: 'harassment', label: 'Harassment', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 'theft', label: 'Theft', color: 'text-red-600', bgColor: 'bg-red-100' },
    { id: 'helpful_locals', label: 'Helpful Locals', color: 'text-secondary-600', bgColor: 'bg-secondary-100' },
    { id: 'good_food', label: 'Good Food', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { id: 'clean', label: 'Clean Area', color: 'text-green-600', bgColor: 'bg-green-100' }
  ];

  const handleSubmitFeedback = () => {
    const feedback = {
      id: Date.now().toString(),
      userId: user?.id || '',
      location: {
        id: Date.now().toString(),
        latitude: 40.7589,
        longitude: -73.9851,
        address: newFeedback.location,
        timestamp: new Date()
      },
      safetyRating: newFeedback.safetyRating as 1 | 2 | 3 | 4 | 5,
      category: newFeedback.category,
      description: newFeedback.description,
      timestamp: new Date(),
      upvotes: 0,
      downvotes: 0,
      isVerified: false
    };

    console.log('New feedback:', feedback);
    setShowNewFeedbackModal(false);
    setNewFeedback({
      location: '',
      category: 'safe',
      safetyRating: 5,
      description: ''
    });
  };

  const getCategoryStyle = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? { color: cat.color, bgColor: cat.bgColor } : { color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Feedback</h1>
          <p className="text-gray-600">Share and discover safety information from fellow travelers</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNewFeedbackModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Feedback</span>
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => {
          const count = allFeedback.filter(f => f.category === category.id).length;
          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              className={`${category.bgColor} rounded-lg p-3 text-center cursor-pointer`}
            >
              <p className={`font-semibold text-lg ${category.color}`}>{count}</p>
              <p className={`text-xs ${category.color}`}>{category.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {allFeedback.map((feedback, index) => {
          const categoryStyle = getCategoryStyle(feedback.category);
          const category = categories.find(c => c.id === feedback.category);
          
          return (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className='bg-opacity-55 border-none'hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryStyle.bgColor} ${categoryStyle.color}`}>
                        {category?.label}
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < feedback.safetyRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {feedback.isVerified && (
                        <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full font-medium">
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="text-gray-900 mb-2">{feedback.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{feedback.location.address}</span>
                      </div>
                      <span>{feedback.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{feedback.upvotes}</span>
                    </Button>
                    <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                      <ThumbsDown className="h-3 w-3" />
                      <span>{feedback.downvotes}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* New Feedback Modal */}
      <Modal
        isOpen={showNewFeedbackModal}
        onClose={() => setShowNewFeedbackModal(false)}
        title="Share Your Experience"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={newFeedback.location}
              onChange={(e) => setNewFeedback(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
              placeholder="Times Square, New York"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={newFeedback.category}
              onChange={(e) => setNewFeedback(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Safety Rating
            </label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setNewFeedback(prev => ({ ...prev, safetyRating: i + 1 }))}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      i < newFeedback.safetyRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {newFeedback.safetyRating}/5 stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newFeedback.description}
              onChange={(e) => setNewFeedback(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
              rows={4}
              placeholder="Share your experience and help other travelers..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowNewFeedbackModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitFeedback}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Submit Feedback</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};