import React, { useState } from 'react';
import { MapPin, User, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { ProfilePhotoCropper } from './ProfilePhotoCropper';
import { OnboardingData } from './OnboardingWizard';

const cities = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Other'
];

interface OnboardingStep1Props {
  role: string;
  initialData: Partial<OnboardingData>;
  onContinue: (data: Partial<OnboardingData>) => void;
  onBack?: () => void;
}

export function OnboardingStep1({ role, initialData, onContinue, onBack }: OnboardingStep1Props) {
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    displayName: initialData.displayName || '',
    organizationName: initialData.organizationName || '',
    location: initialData.location || '',
    profilePhoto: initialData.profilePhoto || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.displayName?.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    if (role === 'corporate' || role === 'ngo') {
      if (!formData.organizationName?.trim()) {
        newErrors.organizationName = 'Organization name is required';
      }
    }
    
    if (!formData.location) {
      newErrors.location = 'Please select your city';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onContinue(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div>
        <label className="block text-slate-900 mb-3">
          Profile Photo
        </label>
        <ProfilePhotoCropper
          currentImage={formData.profilePhoto || ''}
          onImageCropped={(croppedImage) => handleChange('profilePhoto', croppedImage)}
        />
      </div>

      {/* Display Name */}
      <div>
        <label htmlFor="displayName" className="block text-slate-700 mb-2">
          Display name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            id="displayName"
            value={formData.displayName || ''}
            onChange={(e) => handleChange('displayName', e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors ${
              errors.displayName 
                ? 'border-red-500 focus:border-red-600' 
                : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
            }`}
            placeholder="How should we address you?"
            aria-invalid={!!errors.displayName}
          />
        </div>
        {errors.displayName && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.displayName}
          </p>
        )}
      </div>

      {/* Organization Name (for Corporate/NGO) */}
      {(role === 'corporate' || role === 'ngo') && (
        <div>
          <label htmlFor="organizationName" className="block text-slate-700 mb-2">
            {role === 'corporate' ? 'Company name' : 'Organization name'}
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              id="organizationName"
              value={formData.organizationName || ''}
              onChange={(e) => handleChange('organizationName', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors ${
                errors.organizationName 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              }`}
              placeholder={role === 'corporate' ? 'Your company name' : 'Your organization name'}
              aria-invalid={!!errors.organizationName}
            />
          </div>
          {errors.organizationName && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.organizationName}
            </p>
          )}
        </div>
      )}

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-slate-700 mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            id="location"
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors appearance-none ${
              errors.location 
                ? 'border-red-500 focus:border-red-600' 
                : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
            }`}
          >
            <option value="">Select your city</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        {errors.location && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.location}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}
        <button
          onClick={handleContinue}
          className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}