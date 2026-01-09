import React, { useState } from 'react';
import { X, MessageSquare, Send, Mail, MessageCircle } from 'lucide-react';

interface QuickMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: {
    name: string;
    email: string;
  };
}

const MESSAGE_TEMPLATES = [
  {
    id: 'approval',
    title: 'Application Approved',
    body: `Dear {volunteer_name},\n\nCongratulations! Your application for our volunteer project has been approved.\n\nNext Steps:\n1. Check your email for onboarding instructions\n2. Complete safety training (if required)\n3. Mark your calendar for the project dates\n\nWe're excited to have you on board!\n\nBest regards,\nProject Team`
  },
  {
    id: 'details',
    title: 'Request Additional Details',
    body: `Dear {volunteer_name},\n\nThank you for your application. We'd like to learn more about:\n\n• Your availability during project dates\n• Relevant skills or certifications\n• Previous volunteer experience\n\nPlease reply at your earliest convenience.\n\nBest regards,\nProject Team`
  },
  {
    id: 'reminder',
    title: 'Project Reminder',
    body: `Dear {volunteer_name},\n\nThis is a friendly reminder about our upcoming project:\n\nDate: [Add date]\nTime: [Add time]\nLocation: [Add location]\n\nPlease confirm your attendance.\n\nBest regards,\nProject Team`
  },
  {
    id: 'thanks',
    title: 'Thank You',
    body: `Dear {volunteer_name},\n\nThank you for your incredible contribution to our project! Your dedication and hard work made a real difference.\n\nYour volunteer certificate will be issued shortly.\n\nWe hope to work with you again in future projects.\n\nWith gratitude,\nProject Team`
  },
  {
    id: 'custom',
    title: 'Custom Message',
    body: `Dear {volunteer_name},\n\n\n\nBest regards,\nProject Team`
  }
];

export function QuickMessageModal({ isOpen, onClose, volunteer }: QuickMessageModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(MESSAGE_TEMPLATES[0].id);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'email' | 'sms'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const template = MESSAGE_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        const formattedBody = template.body.replace('{volunteer_name}', volunteer.name);
        setMessage(formattedBody);
      }
    }
  }, [isOpen, selectedTemplate, volunteer.name]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Success would show toast notification
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedTemplate(MESSAGE_TEMPLATES[0].id);
      setMessage('');
      setChannel('email');
      onClose();
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Send Message</h3>
                <p className="text-sm text-slate-600 mt-1">
                  To: <span className="font-medium">{volunteer.name}</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {/* Channel Selection */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Send via
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border-2 transition-colors ${
                      channel === 'email'
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    } disabled:opacity-50`}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border-2 transition-colors ${
                      channel === 'sms'
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    } disabled:opacity-50`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    SMS
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {channel === 'email' ? `Will be sent to ${volunteer.email}` : 'SMS integration coming soon'}
                </p>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Message Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MESSAGE_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      disabled={isSubmitting}
                      className={`px-3 py-2 text-sm rounded-lg border-2 transition-colors text-left ${
                        selectedTemplate === template.id
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      } disabled:opacity-50`}
                    >
                      {template.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Body */}
              <div>
                <label htmlFor="message-body" className="block text-sm text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message-body"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={channel === 'sms' ? 4 : 12}
                  disabled={isSubmitting}
                  maxLength={channel === 'sms' ? 160 : undefined}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm resize-none disabled:opacity-50 font-mono"
                  required
                />
                {channel === 'sms' && (
                  <p className="text-xs text-slate-500 mt-1">
                    {message.length} / 160 characters
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  You can edit the message before sending
                </p>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  This message will be sent immediately and logged in the project activity feed.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t-2 border-slate-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim() || (channel === 'sms' && message.length > 160)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
