import React, { useState } from 'react';
import { Building2, Heart, Users, ArrowRight, Check, CheckCircle } from 'lucide-react';
import { RolePreviewPanel } from './RolePreviewPanel';

interface RoleSelectorProps {
  onSelect: (role: string, organizationName?: string) => void;
  onSkip?: () => void;
}

export function RoleSelector({ onSelect, onSkip }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<'corporate' | 'ngo' | 'volunteer' | null>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [showOrgField, setShowOrgField] = useState(false);

  const roles = [
    {
      id: 'corporate' as 'corporate' | 'ngo' | 'volunteer',
      icon: <Building2 className="w-8 h-8" />,
      name: 'Corporate',
      description: 'I represent a company with CSR goals',
      benefits: [
        'Access vetted NGO partners',
        'End-to-end project management',
        'Impact reporting & ESG documentation'
      ],
      recommended: true,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300'
    },
    {
      id: 'ngo' as 'corporate' | 'ngo' | 'volunteer',
      icon: <Heart className="w-8 h-8" />,
      name: 'NGO',
      description: 'I run a non-profit organization',
      benefits: [
        'List volunteer opportunities',
        'Connect with corporate partners',
        'Showcase impact stories'
      ],
      recommended: false,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-300'
    },
    {
      id: 'volunteer' as 'corporate' | 'ngo' | 'volunteer',
      icon: <Users className="w-8 h-8" />,
      name: 'Volunteer',
      description: 'I want to contribute my time & skills',
      benefits: [
        'Browse verified opportunities',
        'Track volunteer hours',
        'Build your impact portfolio'
      ],
      recommended: false,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-300'
    }
  ];

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  const handleContinue = () => {
    if (!selectedRole) return;
    
    if (showOrgField && !organizationName.trim()) {
      // Could show error
      return;
    }
    
    onSelect(selectedRole, showOrgField ? organizationName : undefined);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-slate-900 mb-3">Choose your role</h1>
        <p className="text-slate-600 text-lg">
          Pick the role that best describes you. You can add others later.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRole(role.id);
                }
              }}
              className={`relative p-6 rounded-xl border-2 transition-all text-left
                ${isSelected 
                  ? `${role.borderColor} ring-4 ring-offset-2 ${role.borderColor.replace('border', 'ring')} shadow-lg scale-105` 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-102'
                }
              `}
              data-analytics="auth_role_select"
              data-role={role.id}
              aria-pressed={isSelected}
              role="radio"
            >
              {/* Recommended Badge */}
              {role.recommended && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full shadow-sm">
                  Recommended
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-md transition-transform ${isSelected ? 'scale-110' : ''}`}>
                {role.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-slate-900 mb-2 flex items-center gap-2">
                  {role.name}
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  )}
                </h3>
                <p className="text-slate-600 text-sm mb-4">{role.description}</p>

                {/* Benefits */}
                <ul className="space-y-2">
                  {role.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>

      {/* Organization Toggle */}
      {selectedRole && (
        <div className="max-w-2xl mx-auto mb-8 animate-in slide-in-from-bottom-2 duration-200">
          <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={showOrgField}
              onChange={(e) => setShowOrgField(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-100"
            />
            <div className="flex-1">
              <span className="text-slate-900 block mb-1">I represent an organization</span>
              <span className="text-slate-600 text-sm">
                Add your organization's name to help us personalize your experience
              </span>
            </div>
          </label>

          {/* Organization Name Input */}
          {showOrgField && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
              <label htmlFor="orgName" className="block text-slate-700 mb-2">
                Organization name
              </label>
              <input
                type="text"
                id="orgName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-colors"
                placeholder="Enter your organization's name"
                autoFocus
              />
            </div>
          )}
        </div>
      )}

      {/* Preview Panel (Desktop) */}
      {selectedRole && selectedRoleData && (
        <div className="hidden lg:block max-w-2xl mx-auto mb-8 p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-right-4 duration-300">
          <h4 className="text-slate-900 mb-3">What you'll see next</h4>
          <div className={`p-4 ${selectedRoleData.bgColor} rounded-lg border ${selectedRoleData.borderColor}`}>
            <p className="text-slate-700 text-sm mb-3">
              {selectedRole === 'corporate' && 'Access your CSR dashboard with project management tools, NGO directory, and impact analytics.'}
              {selectedRole === 'ngo' && 'Set up your NGO profile, list volunteer opportunities, and connect with corporate partners.'}
              {selectedRole === 'volunteer' && 'Browse opportunities, set your availability, and start tracking your volunteer hours.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" />
              <span>You can add multiple roles later from your profile settings</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleContinue}
          disabled={!selectedRole || (showOrgField && !organizationName.trim())}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          data-analytics="auth_role_continue"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {onSkip && (
          <button
            onClick={onSkip}
            className="px-8 py-4 text-slate-600 hover:text-slate-900 transition-colors"
            data-analytics="auth_role_skip"
          >
            Not sure? Skip for now
          </button>
        )}
      </div>

      {/* Note */}
      <p className="mt-6 text-center text-slate-500 text-sm">
        This helps us customize your dashboard and show relevant opportunities
      </p>
    </div>
  );
}