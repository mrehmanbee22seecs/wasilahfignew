import React, { useState } from 'react';
import { Heart, Globe, CheckCircle, ArrowLeft, Sparkles, Bell } from 'lucide-react';
import type { OnboardingData } from './OnboardingWizard';

interface OnboardingStep2Props {
  role: string;
  initialData: Partial<OnboardingData>;
  onComplete: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

export function OnboardingStep2({ role, initialData, onComplete, onBack }: OnboardingStep2Props) {
  const [formData, setFormData] = useState({
    interests: initialData.interests || [],
    sdgs: initialData.sdgs || [],
    availability: initialData.availability || '',
    emailNotifications: initialData.emailNotifications ?? true,
    weeklyDigest: initialData.weeklyDigest ?? true
  });

  const allInterests = [
    'Education',
    'Health',
    'Environment',
    'Women Empowerment',
    'Skills Development',
    'Disaster Relief',
    'Animal Welfare',
    'Clean Water',
    'Food Security',
    'Youth Development'
  ];

  const sdgData = [
    { id: 1, name: 'No Poverty', color: 'bg-red-500' },
    { id: 2, name: 'Zero Hunger', color: 'bg-yellow-500' },
    { id: 3, name: 'Good Health', color: 'bg-green-500' },
    { id: 4, name: 'Quality Education', color: 'bg-red-600' },
    { id: 5, name: 'Gender Equality', color: 'bg-orange-500' },
    { id: 6, name: 'Clean Water', color: 'bg-cyan-500' },
    { id: 7, name: 'Clean Energy', color: 'bg-yellow-400' },
    { id: 8, name: 'Decent Work', color: 'bg-red-700' },
    { id: 9, name: 'Industry', color: 'bg-orange-600' },
    { id: 10, name: 'Reduced Inequalities', color: 'bg-pink-500' },
    { id: 11, name: 'Sustainable Cities', color: 'bg-orange-400' },
    { id: 12, name: 'Responsible Consumption', color: 'bg-yellow-600' },
    { id: 13, name: 'Climate Action', color: 'bg-green-600' },
    { id: 14, name: 'Life Below Water', color: 'bg-blue-500' },
    { id: 15, name: 'Life on Land', color: 'bg-green-700' },
    { id: 16, name: 'Peace & Justice', color: 'bg-blue-600' },
    { id: 17, name: 'Partnerships', color: 'bg-blue-700' }
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleSDG = (sdgId: number) => {
    setFormData(prev => ({
      ...prev,
      sdgs: prev.sdgs.includes(sdgId)
        ? prev.sdgs.filter(id => id !== sdgId)
        : prev.sdgs.length < 5
          ? [...prev.sdgs, sdgId]
          : prev.sdgs
    }));
  };

  const handleFinish = () => {
    onComplete(formData);
  };

  const handleSkip = () => {
    onComplete({
      ...formData,
      interests: formData.interests.length > 0 ? formData.interests : ['Education'],
      sdgs: formData.sdgs.length > 0 ? formData.sdgs : [4]
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-slate-900 mb-2">Preferences & interests</h2>
        <p className="text-slate-600">Help us match you with relevant opportunities and content</p>
      </div>

      <div className="space-y-8">
        {/* Interests */}
        <div>
          <label className="flex items-center gap-2 text-slate-700 mb-3">
            <Heart className="w-5 h-5 text-teal-600" />
            <span>Causes you care about</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {allInterests.map((interest) => {
              const isSelected = formData.interests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full border-2 transition-all text-sm ${
                    isSelected
                      ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-teal-600'
                  }`}
                  data-analytics="onboarding_interest_toggle"
                >
                  {interest}
                  {isSelected && <CheckCircle className="w-4 h-4 inline ml-2" />}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Select all that apply — we'll use this to recommend projects
          </p>
        </div>

        {/* SDG Preferences */}
        <div>
          <label className="flex items-center gap-2 text-slate-700 mb-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>SDG preferences (max 5)</span>
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
            {sdgData.map((sdg) => {
              const isSelected = formData.sdgs.includes(sdg.id);
              const isDisabled = !isSelected && formData.sdgs.length >= 5;
              
              return (
                <button
                  key={sdg.id}
                  onClick={() => !isDisabled && toggleSDG(sdg.id)}
                  className={`aspect-square rounded-lg ${sdg.color} text-white flex items-center justify-center text-sm transition-all relative ${
                    isSelected 
                      ? 'ring-4 ring-teal-600 ring-offset-2 shadow-lg scale-110' 
                      : isDisabled
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:scale-105 shadow-sm'
                  }`}
                  title={sdg.name}
                  disabled={isDisabled}
                  data-analytics="onboarding_sdg_toggle"
                >
                  {sdg.id}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {formData.sdgs.length}/5 selected — Click to select up to 5 SDGs you want to focus on
          </p>
        </div>

        {/* Availability (Volunteer only) */}
        {role === 'volunteer' && (
          <div>
            <label htmlFor="availability" className="block text-slate-700 mb-2">
              Availability
            </label>
            <select
              id="availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-colors"
            >
              <option value="">Select your typical availability</option>
              <option value="weekends">Weekends only</option>
              <option value="weekdays">Weekday evenings</option>
              <option value="flexible">Flexible schedule</option>
              <option value="occasional">Occasional / project-based</option>
            </select>
            <p className="mt-2 text-xs text-slate-500">
              This helps us show opportunities that match your schedule
            </p>
          </div>
        )}

        {/* Notification Preferences */}
        <div>
          <label className="flex items-center gap-2 text-slate-700 mb-3">
            <Bell className="w-5 h-5 text-violet-600" />
            <span>Notification preferences</span>
          </label>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-100"
              />
              <div>
                <span className="text-slate-900 block mb-1">Email notifications</span>
                <span className="text-slate-600 text-sm">
                  Get notified about new opportunities, project updates, and important announcements
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.weeklyDigest}
                onChange={(e) => setFormData({ ...formData, weeklyDigest: e.target.checked })}
                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-100"
              />
              <div>
                <span className="text-slate-900 block mb-1">Weekly digest</span>
                <span className="text-slate-600 text-sm">
                  Receive a curated summary of opportunities and updates every Monday
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 transition-colors"
          data-analytics="onboarding_step2_back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex-1 flex gap-3">
          <button
            onClick={handleSkip}
            className="px-6 py-3 text-slate-600 hover:text-slate-900 transition-colors"
            data-analytics="onboarding_skip"
          >
            Finish later
          </button>

          <button
            onClick={handleFinish}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02]"
            data-analytics="onboarding_complete"
          >
            <Sparkles className="w-5 h-5" />
            <span>Finish & Go to dashboard</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-teal-50 rounded-lg">
        <p className="text-teal-700 text-sm text-center">
          ✨ You can update these preferences anytime from your profile settings
        </p>
      </div>
    </div>
  );
}
