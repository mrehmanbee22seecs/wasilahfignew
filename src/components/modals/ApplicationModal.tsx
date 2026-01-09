import React, { useState } from 'react';
import { X, Briefcase, User, Mail, Phone, MessageSquare, CheckCircle, Loader } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityTitle: string;
  ngoName: string;
}

export function ApplicationModal({
  isOpen,
  onClose,
  opportunityTitle,
  ngoName
}: ApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    motivation: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleClose = () => {
    setFormData({ fullName: '', email: '', phone: '', motivation: '' });
    setIsSubmitted(false);
    onClose();
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-slate-900 mb-3">Application Submitted!</h3>
            <p className="text-slate-600 mb-6">
              Your application for <span className="font-medium text-slate-900">{opportunityTitle}</span> at {ngoName} has been submitted successfully.
            </p>
            <p className="text-slate-600 text-sm mb-6">
              Our team will review your application within 2-3 business days. You'll receive an email confirmation shortly.
            </p>
            <button
              onClick={handleClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-slate-900">Apply to Opportunity</h3>
              <p className="text-slate-600 text-sm">{opportunityTitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-slate-700 mb-2">
                <User className="w-4 h-4" />
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-slate-700 mb-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-slate-700 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900"
                placeholder="+92 XXX XXXXXXX"
              />
            </div>

            {/* Motivation */}
            <div>
              <label className="flex items-center gap-2 text-slate-700 mb-2">
                <MessageSquare className="w-4 h-4" />
                Why do you want to volunteer for this opportunity? *
              </label>
              <textarea
                required
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 resize-none"
                placeholder="Tell us why you're interested in this opportunity and what you hope to contribute..."
              />
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-sm">
                By applying, you agree to Wasilah's Terms of Service and Privacy Policy. 
                Your information will be shared with {ngoName} for review.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
