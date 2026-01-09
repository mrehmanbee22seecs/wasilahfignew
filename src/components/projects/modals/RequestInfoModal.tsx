import React, { useState } from 'react';
import { X, Info, Mail, Send } from 'lucide-react';

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngo: {
    name: string;
    contact: {
      email: string;
      person: string;
    };
  };
}

const REQUEST_TEMPLATES = [
  {
    id: 'documents',
    title: 'Missing Documents',
    body: 'Dear {ngo_contact},\n\nWe are reviewing your application for our project and require additional documentation:\n\n• Updated registration certificate\n• Most recent financial audit report\n• References from previous corporate partners\n\nPlease provide these documents within 7 business days.\n\nBest regards,\n{user_name}'
  },
  {
    id: 'references',
    title: 'Reference Verification',
    body: 'Dear {ngo_contact},\n\nAs part of our vetting process, we need to verify your references from previous projects:\n\n• Contact details for 2-3 previous corporate partners\n• Brief description of projects completed\n• Timeline and outcomes\n\nPlease share this information at your earliest convenience.\n\nBest regards,\n{user_name}'
  },
  {
    id: 'capacity',
    title: 'Capacity Assessment',
    body: 'Dear {ngo_contact},\n\nWe would like to better understand your organization\'s capacity for this project:\n\n• Current active projects and commitments\n• Team size and expertise\n• Geographic reach in the project area\n• Previous experience with similar initiatives\n\nPlease schedule a call or provide a written response.\n\nBest regards,\n{user_name}'
  },
  {
    id: 'custom',
    title: 'Custom Request',
    body: 'Dear {ngo_contact},\n\n\n\nBest regards,\n{user_name}'
  }
];

export function RequestInfoModal({ isOpen, onClose, ngo }: RequestInfoModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(REQUEST_TEMPLATES[0].id);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const template = REQUEST_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        const formattedBody = template.body
          .replace('{ngo_contact}', ngo.contact.person)
          .replace('{user_name}', 'CSR Manager'); // This would come from auth context
        setMessage(formattedBody);
      }
    }
  }, [isOpen, selectedTemplate, ngo]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to send email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Success notification would go here
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedTemplate(REQUEST_TEMPLATES[0].id);
      setMessage('');
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Request More Information</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Send a request to <span className="font-medium">{ngo.name}</span>
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
              {/* Recipient Info */}
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Mail className="w-4 h-4" />
                  <span>To: {ngo.contact.person} ({ngo.contact.email})</span>
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Select Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REQUEST_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      disabled={isSubmitting}
                      className={`px-4 py-2 text-sm rounded-lg border-2 transition-colors text-left ${
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

              {/* Message */}
              <div>
                <label htmlFor="request-message" className="block text-sm text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="request-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={12}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm resize-none disabled:opacity-50 font-mono"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Edit the message as needed before sending
                </p>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  This request will be sent via email and logged in the project activity feed. 
                  The NGO will have 7 business days to respond by default.
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
                disabled={isSubmitting || !message.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
