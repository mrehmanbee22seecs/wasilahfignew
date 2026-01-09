import React, { useState } from 'react';
import { OnboardingStep1 } from './OnboardingStep1';
import { OnboardingStep2 } from './OnboardingStep2';
import { ArrowLeft, Check } from 'lucide-react';

interface OnboardingWizardProps {
  role: string;
  initialData?: Partial<OnboardingData>;
  onComplete: (data: OnboardingData) => void;
  onBack?: () => void;
}

export interface OnboardingData {
  displayName: string;
  organizationName?: string;
  location: string;
  profilePhoto?: string;
  interests: string[];
  sdgs: number[];
  availability?: string;
  emailNotifications: boolean;
  weeklyDigest: boolean;
}

export function OnboardingWizard({ role, initialData, onComplete, onBack }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>(initialData || {
    displayName: '',
    organizationName: '',
    location: '',
    interests: [],
    sdgs: [],
    emailNotifications: true,
    weeklyDigest: true
  });

  const handleStep1Complete = (data: Partial<OnboardingData>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: Partial<OnboardingData>) => {
    const completeData = { ...formData, ...data } as OnboardingData;
    onComplete(completeData);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentStep >= 1
                ? 'bg-gradient-to-br from-teal-600 to-blue-600 text-white shadow-lg'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className="hidden sm:block">
              <div className="text-slate-900 text-sm">Step 1</div>
              <div className="text-slate-600 text-xs">Profile Info</div>
            </div>
          </div>

          <div className={`w-24 h-1 rounded transition-all ${
            currentStep >= 2 ? 'bg-teal-600' : 'bg-slate-200'
          }`} />

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentStep >= 2
                ? 'bg-gradient-to-br from-teal-600 to-blue-600 text-white shadow-lg'
                : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </div>
            <div className="hidden sm:block">
              <div className="text-slate-900 text-sm">Step 2</div>
              <div className="text-slate-600 text-xs">Preferences</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          {currentStep === 1 && (
            <OnboardingStep1
              role={role}
              initialData={formData}
              onContinue={handleStep1Complete}
              onBack={onBack}
            />
          )}

          {currentStep === 2 && (
            <OnboardingStep2
              role={role}
              initialData={formData}
              onComplete={handleStep2Complete}
              onBack={handleBackToStep1}
            />
          )}
        </div>

        {/* Right: Preview Card (Desktop Only) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200 p-8 shadow-lg">
            <h3 className="text-slate-900 mb-4">Your profile preview</h3>
            
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                  {formData.displayName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <div className="text-slate-900">
                    {formData.displayName || 'Your name'}
                  </div>
                  {formData.organizationName && (
                    <div className="text-slate-600 text-sm">{formData.organizationName}</div>
                  )}
                  {formData.location && (
                    <div className="text-slate-500 text-xs mt-1">📍 {formData.location}</div>
                  )}
                </div>
              </div>

              {/* Interests */}
              {formData.interests && formData.interests.length > 0 && (
                <div className="mb-4">
                  <div className="text-slate-700 text-sm mb-2">Interests:</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SDGs */}
              {formData.sdgs && formData.sdgs.length > 0 && (
                <div>
                  <div className="text-slate-700 text-sm mb-2">SDG Focus:</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.sdgs.map((sdg) => (
                      <div key={sdg} className="w-8 h-8 bg-teal-600 text-white rounded flex items-center justify-center text-xs">
                        {sdg}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700 text-sm">
                💡 This is how others will see your profile. You can edit it anytime from your settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
