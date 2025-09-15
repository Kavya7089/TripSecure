import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Shield, Users, Phone, Mail, UserCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { PriorityMember } from '../types';

interface PriorityMembersProps {
  members: PriorityMember[];
  onAddMember: (member: Omit<PriorityMember, 'id'>) => void;
  onUpdateMember: (id: string, member: Partial<PriorityMember>) => void;
  onDeleteMember: (id: string) => void;
  maxMembers?: number;
}

export const PriorityMembers: React.FC<PriorityMembersProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  maxMembers = 3
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<PriorityMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: '',
    hasLocationAccess: true,
    isDefault: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMember) {
      onUpdateMember(editingMember.id, formData);
    } else {
      onAddMember(formData);
    }
    
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      relationship: '',
      hasLocationAccess: true,
      isDefault: false
    });
    setEditingMember(null);
  };

  const handleEdit = (member: PriorityMember) => {
    setFormData({
      name: member.name,
      phone: member.phone,
      email: member.email,
      relationship: member.relationship,
      hasLocationAccess: member.hasLocationAccess,
      isDefault: member.isDefault
    });
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this priority member?')) {
      onDeleteMember(id);
    }
  };

  const canAddMore = members.length < maxMembers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2 text-secondary-600" />
            Priority Members
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage up to {maxMembers} priority members who can access your location for safety
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={!canAddMore}
          className="bg-secondary-600 hover:bg-secondary-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Default Members Info */}
      <div className="bg-secondary-50 dark:bg-secondary-900/20  bg-opacity-55 border-none border border-secondary-200 dark:border-secondary-800 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-secondary-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100">
              Default Priority Members
            </h4>
            <p className="text-sm text-secondary-700 dark:text-secondary-300 mt-1">
              Police and Travel Department automatically have location access for emergency response.
            </p>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-secondary-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary-600 to-primary-600 rounded-full flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">
                      {member.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {member.relationship}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-1 text-gray-400 hover:text-secondary-600 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="h-4 w-4 mr-2" />
                  {member.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 mr-2" />
                  {member.email}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Location Access
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.hasLocationAccess
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  }`}>
                    {member.hasLocationAccess ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                {member.isDefault && (
                  <div className="flex items-center text-xs text-secondary-600 dark:text-secondary-400">
                    <Shield className="h-3 w-3 mr-1" />
                    Default Member
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingMember ? 'Edit Priority Member' : 'Add Priority Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600  mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              <option value="">Select relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="child">Child</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="locationAccess"
              checked={formData.hasLocationAccess}
              onChange={(e) => setFormData({ ...formData, hasLocationAccess: e.target.checked })}
              className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-gray-300 rounded"
            />
            <label htmlFor="locationAccess" className="ml-2 text-sm text-gray-700 ">
              Allow location access for safety monitoring
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-secondary-600 hover:bg-secondary-700 text-white">
              {editingMember ? 'Update' : 'Add'} Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
