import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Clock, User, FileText, Camera, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  documentType: 'passport' | 'drivers_license' | 'national_id' | 'other';
  documentNumber: string;
  documentImages: string[];
  selfieImage: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  verificationScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const IDVerification: React.FC = () => {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([
    {
      id: '1',
      userId: 'user_1',
      userName: 'Alex Chen',
      userEmail: 'alex@example.com',
      userPhone: '+1-555-0123',
      documentType: 'passport',
      documentNumber: 'A12345678',
      documentImages: ['passport_front.jpg', 'passport_back.jpg'],
      selfieImage: 'selfie.jpg',
      status: 'under_review',
      submittedAt: new Date(Date.now() - 3600000), // 1 hour ago
      verificationScore: 87,
      riskLevel: 'low'
    },
    {
      id: '2',
      userId: 'user_2',
      userName: 'Sarah Johnson',
      userEmail: 'sarah@example.com',
      userPhone: '+1-555-0126',
      documentType: 'drivers_license',
      documentNumber: 'DL987654321',
      documentImages: ['license_front.jpg', 'license_back.jpg'],
      selfieImage: 'selfie_2.jpg',
      status: 'pending',
      submittedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      verificationScore: 92,
      riskLevel: 'low'
    },
    {
      id: '3',
      userId: 'user_3',
      userName: 'Mike Wilson',
      userEmail: 'mike@example.com',
      userPhone: '+1-555-0128',
      documentType: 'national_id',
      documentNumber: 'ID456789123',
      documentImages: ['id_front.jpg'],
      selfieImage: 'selfie_3.jpg',
      status: 'rejected',
      submittedAt: new Date(Date.now() - 7200000), // 2 hours ago
      reviewedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      reviewedBy: 'Officer Smith',
      rejectionReason: 'Document quality too low, please resubmit with clearer images',
      verificationScore: 45,
      riskLevel: 'high'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reviewNotes, setReviewNotes] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'blue' },
    { value: 'under_review', label: 'Under Review', color: 'yellow' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' }
  ];

  const filteredRequests = filterStatus === 'all' 
    ? verificationRequests 
    : verificationRequests.filter(request => request.status === filterStatus);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[risk as keyof typeof colors] || colors.medium;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleStatusUpdate = (requestId: string, newStatus: string) => {
    setVerificationRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: newStatus as any,
            reviewedAt: new Date(),
            reviewedBy: 'Current User' // In real app, get from auth context
          }
        : request
    ));
  };

  const handleApprove = (requestId: string) => {
    handleStatusUpdate(requestId, 'approved');
    setIsModalOpen(false);
  };

  const handleReject = (requestId: string) => {
    handleStatusUpdate(requestId, 'rejected');
    setIsModalOpen(false);
  };

  const stats = {
    total: verificationRequests.length,
    pending: verificationRequests.filter(r => r.status === 'pending').length,
    underReview: verificationRequests.filter(r => r.status === 'under_review').length,
    approved: verificationRequests.filter(r => r.status === 'approved').length,
    rejected: verificationRequests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ID Verification</h1>
          <p className="text-gray-600 dark:text-gray-300">Review and verify user identity documents</p>
        </div>
        <Button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-800">
          <Shield className="h-4 w-4" />
          <span>Verification Settings</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Requests</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.underReview}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Under Review</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Approved</p>
        </Card>
        
        <Card className="p-6 text-center bg-opacity-55 border-none">
          <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Rejected</p>
        </Card>
      </div>

      {/* Filter */}
      <Card className="p-4 bg-opacity-55 border-none">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Verification Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow bg-opacity-55 border-none">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{request.userName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`text-xs font-medium ${getRiskColor(request.riskLevel)}`}>
                        {request.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        <strong>Email:</strong> {request.userEmail}
                      </div>
                      <div>
                        <strong>Phone:</strong> {request.userPhone}
                      </div>
                      <div>
                        <strong>Document:</strong> {request.documentType.replace('_', ' ').toUpperCase()}
                      </div>
                      <div>
                        <strong>Document #:</strong> {request.documentNumber}
                      </div>
                      <div>
                        <strong>Submitted:</strong> {formatTimeAgo(request.submittedAt)}
                      </div>
                      <div>
                        <strong>Score:</strong> 
                        <span className={`ml-1 font-semibold ${getScoreColor(request.verificationScore)}`}>
                          {request.verificationScore}%
                        </span>
                      </div>
                    </div>
                    
                    {request.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                        <p className="text-sm text-red-800 dark:text-red-300">
                          <strong>Rejection Reason:</strong> {request.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsModalOpen(true);
                    }}
                  >
                    Review
                  </Button>
                  
                  {request.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, 'under_review')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Start Review
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Review ID Verification - ${selectedRequest.userName}`}
        >
          <div className="space-y-6">
            {/* User Information */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">User Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {selectedRequest.userName}
                </div>
                <div>
                  <strong>Email:</strong> {selectedRequest.userEmail}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedRequest.userPhone}
                </div>
                <div>
                  <strong>Document Type:</strong> {selectedRequest.documentType.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            {/* Document Images */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Document Images</h4>
              <div className="grid grid-cols-2 gap-4">
                {selectedRequest.documentImages.map((image, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">{image}</p>
                    <Button size="sm" variant="secondary" className="mt-2">
                      View Image
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selfie Image */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Selfie Image</h4>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">{selectedRequest.selfieImage}</p>
                <Button size="sm" variant="secondary" className="mt-2">
                  View Selfie
                </Button>
              </div>
            </div>

            {/* Verification Details */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Verification Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Verification Score:</strong> 
                  <span className={`ml-1 font-semibold ${getScoreColor(selectedRequest.verificationScore)}`}>
                    {selectedRequest.verificationScore}%
                  </span>
                </div>
                <div>
                  <strong>Risk Level:</strong> 
                  <span className={`ml-1 font-semibold ${getRiskColor(selectedRequest.riskLevel)}`}>
                    {selectedRequest.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div>
                  <strong>Submitted:</strong> {selectedRequest.submittedAt.toLocaleString()}
                </div>
                <div>
                  <strong>Document Number:</strong> {selectedRequest.documentNumber}
                </div>
              </div>
            </div>

            {/* Review Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Notes
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Add your review notes here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleReject(selectedRequest.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleApprove(selectedRequest.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
