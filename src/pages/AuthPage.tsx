import React, { useState } from 'react';
import { AuthShell } from '../components/auth/AuthShell';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { OTPForm } from '../components/auth/OTPForm';
import { RoleSelector } from '../components/auth/RoleSelector';
import { OnboardingWizard, OnboardingData } from '../components/auth/OnboardingWizard';
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal';
import { CheckCircle, Sparkles } from 'lucide-react';

type AuthState = 'login' | 'signup' | 'verify' | 'role' | 'onboarding' | 'complete';

export function AuthPage({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [userEmail, setUserEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [organizationName, setOrganizationName] = useState<string | undefined>();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // State transitions with animations
  const transitionTo = (newState: AuthState) => {
    // Could add page transition animations here
    setAuthState(newState);
    
    // Analytics tracking
    trackAuthEvent(`auth_state_${newState}`);
  };

  const trackAuthEvent = (eventName: string, data?: any) => {
    // In production, connect to analytics service
    console.log('[Analytics]', eventName, data);
  };

  // Handler: Login Success
  const handleLoginSuccess = () => {
    trackAuthEvent('auth_login_success');
    transitionTo('complete');
  };

  // Handler: Signup Success → Email Verification
  const handleSignupSuccess = (email: string) => {
    setUserEmail(email);
    trackAuthEvent('auth_signup_success', { email_masked: email.replace(/^(.{2}).*(@.*)$/, '$1***$2') });
    transitionTo('verify');
  };

  // Handler: OTP Verification Success → Role Selection
  const handleVerifySuccess = () => {
    trackAuthEvent('auth_verify_success');
    transitionTo('role');
  };

  // Handler: Role Selection → Onboarding
  const handleRoleSelection = (role: string, orgName?: string) => {
    setSelectedRole(role);
    setOrganizationName(orgName);
    trackAuthEvent('auth_role_selected', { role, has_org: !!orgName });
    transitionTo('onboarding');
  };

  // Handler: Onboarding Complete → Success
  const handleOnboardingComplete = (data: OnboardingData) => {
    trackAuthEvent('auth_onboarding_complete', {
      role: selectedRole,
      interests_count: data.interests.length,
      sdgs_count: data.sdgs.length,
      has_photo: !!data.profilePhoto
    });
    transitionTo('complete');
  };

  // Handler: Go back to site
  const handleBackToSite = () => {
    // Navigate to homepage or previous page
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <AuthShell showBackToSite={authState !== 'complete'} onBackToSite={handleBackToSite}>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        {/* State: Login */}
        {authState === 'login' && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToSignup={() => transitionTo('signup')}
              onForgotPassword={() => setShowForgotPassword(true)}
            />
          </div>
        )}

        {/* State: Signup */}
        {authState === 'signup' && (
          <div className="w-full animate-in fade-in slide-in-from-left-4 duration-300">
            <SignupForm
              onSuccess={handleSignupSuccess}
              onSwitchToLogin={() => transitionTo('login')}
            />
          </div>
        )}

        {/* State: Email Verification */}
        {authState === 'verify' && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <OTPForm
              email={userEmail}
              onSuccess={handleVerifySuccess}
              onChangeEmail={() => transitionTo('signup')}
            />
          </div>
        )}

        {/* State: Role Selection */}
        {authState === 'role' && (
          <div className="w-full animate-in fade-in zoom-in-95 duration-300">
            <RoleSelector
              onContinue={handleRoleSelection}
              onSkip={() => transitionTo('complete')}
            />
          </div>
        )}

        {/* State: Onboarding Wizard */}
        {authState === 'onboarding' && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <OnboardingWizard
              role={selectedRole}
              initialData={{ 
                displayName: '',
                organizationName: organizationName
              }}
              onComplete={handleOnboardingComplete}
              onBack={() => transitionTo('role')}
            />
          </div>
        )}

        {/* State: Complete (Success Screen) */}
        {authState === 'complete' && (
          <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-12 text-center">
              {/* Success Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-in zoom-in-50 duration-500 delay-150">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>

              {/* Title */}
              <h1 className="text-slate-900 mb-3 animate-in slide-in-from-bottom-2 duration-300 delay-300">
                Welcome to Wasilah! 🎉
              </h1>

              <p className="text-slate-600 text-lg mb-8 animate-in slide-in-from-bottom-2 duration-300 delay-500">
                Your account is ready. Let's start making an impact together.
              </p>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8 animate-in slide-in-from-bottom-2 duration-300 delay-700">
                <div className="p-6 bg-teal-50 rounded-xl border border-teal-200">
                  <div className="text-teal-600 text-3xl mb-2">🎯</div>
                  <h3 className="text-slate-900 text-sm mb-2">
                    {selectedRole === 'corporate' && 'Create your first project'}
                    {selectedRole === 'ngo' && 'List an opportunity'}
                    {selectedRole === 'volunteer' && 'Browse opportunities'}
                  </h3>
                  <p className="text-slate-600 text-xs">
                    {selectedRole === 'corporate' && 'Launch a CSR initiative with vetted NGOs'}
                    {selectedRole === 'ngo' && 'Connect with volunteers and corporates'}
                    {selectedRole === 'volunteer' && 'Find causes you care about'}
                  </p>
                </div>

                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-blue-600 text-3xl mb-2">📊</div>
                  <h3 className="text-slate-900 text-sm mb-2">Explore your dashboard</h3>
                  <p className="text-slate-600 text-xs">
                    View insights, track impact, and manage your activity
                  </p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => window.location.href = `/${selectedRole || 'home'}`}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 mx-auto animate-in slide-in-from-bottom-2 duration-300 delay-1000"
                data-analytics="auth_complete_goto_dashboard"
              >
                <Sparkles className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </button>

              {/* Skip Link */}
              <button
                onClick={() => window.location.href = '/'}
                className="mt-6 text-slate-600 hover:text-slate-900 text-sm transition-colors"
              >
                I'll explore later
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Debug State Switcher (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white p-4 rounded-lg shadow-lg text-xs">
          <div className="mb-2 text-slate-400">Debug: Switch States</div>
          <div className="flex flex-wrap gap-2">
            {(['login', 'signup', 'verify', 'role', 'onboarding', 'complete'] as AuthState[]).map(state => (
              <button
                key={state}
                onClick={() => setAuthState(state)}
                className={`px-3 py-1 rounded ${
                  authState === state ? 'bg-teal-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      )}
    </AuthShell>
  );
}