import React, { useState } from 'react';
import { X, MapPinned, Calendar, Clock, User, Mail } from 'lucide-react';

interface RequestSiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function RequestSiteVisitModal({ isOpen, onClose, projectId }: RequestSiteVisitModalProps) {
  const [selectedNGOs, setSelectedNGOs] = useState<string[]>([]);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [visitType, setVisitType] = useState<'in-person' | 'virtual'>('in-person');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const mockNGOs = [
    { id: 'ngo_1', name: 'Al-Khidmat Foundation' },
    { id: 'ngo_2', name: 'The Citizens Foundation' },
    { id: 'ngo_3', name: 'Edhi Foundation' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setSelectedNGOs([]);
    setPreferredDate('');
    setPreferredTime('');
    setVisitType('in-person');
    setContactPerson('');
    setContactEmail('');
    setNotes('');
    setIsSubmitting(false);
    
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const toggleNGO = (ngoId: string) => {
    setSelectedNGOs(prev => 
      prev.includes(ngoId) 
        ? prev.filter(id => id !== ngoId)
        : [...prev, ngoId]
    );
  };

  const isFormValid = selectedNGOs.length > 0 && preferredDate && preferredTime && contactPerson && contactEmail;

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
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <MapPinned className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Request Site Visit</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Schedule an on-site or virtual visit to evaluate NGO facilities
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
            <div className="p-6 space-y-5">
              {/* NGO Selection */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Select NGOs to Visit <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {mockNGOs.map(ngo => (
                    <label 
                      key={ngo.id}
                      className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:border-teal-300 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedNGOs.includes(ngo.id)}
                        onChange={() => toggleNGO(ngo.id)}
                        disabled={isSubmitting}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-300"
                      />
                      <span className="text-sm text-slate-700">{ngo.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Visit Type */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Visit Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label 
                    className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      visitType === 'in-person' 
                        ? 'border-teal-300 bg-teal-50 text-teal-700' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visitType"
                      value="in-person"
                      checked={visitType === 'in-person'}
                      onChange={(e) => setVisitType(e.target.value as 'in-person' | 'virtual')}
                      disabled={isSubmitting}
                      className="sr-only"
                    />
                    <MapPinned className="w-4 h-4" />
                    <span className="text-sm">In-Person</span>
                  </label>
                  <label 
                    className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      visitType === 'virtual' 
                        ? 'border-teal-300 bg-teal-50 text-teal-700' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visitType"
                      value="virtual"
                      checked={visitType === 'virtual'}
                      onChange={(e) => setVisitType(e.target.value as 'in-person' | 'virtual')}
                      disabled={isSubmitting}
                      className="sr-only"
                    />
                    <span className="text-sm">Virtual</span>
                  </label>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferred-date" className="block text-sm text-slate-700 mb-2">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="preferred-date"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      disabled={isSubmitting}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="preferred-time" className="block text-sm text-slate-700 mb-2">
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="preferred-time"
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-person" className="block text-sm text-slate-700 mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="contact-person"
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Your name"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm text-slate-700 mb-2">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="contact-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your.email@company.com"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm text-slate-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific areas or aspects you want to focus on during the visit..."
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm resize-none disabled:opacity-50"
                />
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  The selected NGOs will receive an email notification with the visit request. 
                  They will need to confirm availability for the proposed date and time.
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
                disabled={!isFormValid || isSubmitting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Request...' : 'Send Visit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
