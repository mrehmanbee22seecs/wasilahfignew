import React, { useState } from 'react';
import { X, Mail, UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type Role = 'super_admin' | 'admin' | 'moderator' | 'viewer';

type InviteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    role: Role;
    name: string;
    message?: string;
  }) => Promise<void>;
};

const roleOptions = [
  {
    value: 'admin' as Role,
    label: 'Admin',
    description: 'Can manage users, approve payments, view all data',
    icon: '⚡',
  },
  {
    value: 'moderator' as Role,
    label: 'Moderator',
    description: 'Can moderate content, limited financial access',
    icon: '🛡️',
  },
  {
    value: 'viewer' as Role,
    label: 'Viewer',
    description: 'Read-only access to reports and analytics',
    icon: '👁️',
  },
];

export function InviteUserModal({ isOpen, onClose, onSubmit }: InviteUserModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter the user\'s name');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        email: email.trim(),
        role: selectedRole,
        name: name.trim(),
        message: message.trim() || undefined,
      });
      
      toast.success(`Invitation sent to ${email}`);
      
      // Reset form
      setEmail('');
      setName('');
      setSelectedRole('admin');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-gray-900">Invite Team Member</h2>
            <p className="text-sm text-gray-600 mt-1">
              Send an invitation to join the Wasilah admin team
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Ahmed Khan"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400"
              autoFocus
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed.khan@example.com"
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              They will receive an invitation email with setup instructions
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-3">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {roleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      selectedRole === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={selectedRole === option.value}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm text-gray-900">{option.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to the invitation email..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="text-blue-700 space-y-1 text-xs">
                <li>• User receives an invitation email with a secure link</li>
                <li>• They can set up their password and enable 2FA</li>
                <li>• Account becomes active once they complete setup</li>
                <li>• Invitation expires after 7 days if not accepted</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !email.trim() || !name.trim()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Send Invitation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
