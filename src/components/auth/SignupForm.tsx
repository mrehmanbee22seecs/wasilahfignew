import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Building2, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { SocialLoginButtons } from './SocialLoginButtons';
import { signup } from '../../services/authService';
import { TermsModal } from './TermsModal';
import { validateInput } from '../../lib/security/inputValidator';
import { logger } from '../../lib/security/secureLogger';

interface SignupFormProps {
  onSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation with secure input validator
    const newErrors: Record<string, string> = {};
    
    // Validate full name
    const nameValidation = validateInput.string(formData.fullName, {
      minLength: 2,
      maxLength: 100,
      allowSpecialChars: true
    });
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (!nameValidation.valid) {
      newErrors.fullName = nameValidation.errors[0] || 'Invalid name format.';
    }
    
    // Validate email
    const emailValidation = validateInput.email(formData.email);
    if (!formData.email) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailValidation.valid) {
      newErrors.email = emailValidation.errors[0] || 'Please enter a valid email address.';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Please create a password.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords don\'t match.';
    }
    
    // Validate company name if provided
    let companyValidation = null;
    if (formData.companyName.trim()) {
      companyValidation = validateInput.string(formData.companyName, {
        minLength: 2,
        maxLength: 200,
        allowSpecialChars: true
      });
      if (!companyValidation.valid) {
        newErrors.companyName = companyValidation.errors[0] || 'Invalid company name.';
      }
    }
    
    // Validate terms acceptance
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms & Conditions to continue.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Real Supabase signup with sanitized inputs
      const result = await signup({
        email: emailValidation.sanitized,
        password: formData.password, // Don't sanitize password
        fullName: nameValidation.sanitized,
        companyName: companyValidation?.sanitized || formData.companyName || undefined
      });
      
      if (!result.success) {
        setErrors({
          general: result.error || 'Signup failed. Please try again.'
        });
        return;
      }
      
      // Pass sanitized email to parent for verification step
      onSuccess(emailValidation.sanitized);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      logger.error('Signup error', { error: error.message });
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTerms = () => {
    setFormData({ ...formData, acceptTerms: true });
    setErrors({ ...errors, acceptTerms: '' });
  };

  const handleSocialSignup = (provider: string) => {
    console.log('Social signup with:', provider);
  };

  const passwordsMatch = formData.password && formData.confirmPassword && 
    formData.password === formData.confirmPassword;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-slate-900 mb-2">Create your Wasilah account</h1>
          <p className="text-slate-600">Join to start making social impact</p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3" role="alert">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-slate-700 mb-2">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors
                  ${errors.fullName ? 'border-red-500' : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'}
                `}
                placeholder="John Doe"
                autoComplete="name"
                disabled={isLoading}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
            </div>
            {errors.fullName && (
              <p id="fullName-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-slate-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors
                  ${errors.email ? 'border-red-500' : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'}
                `}
                placeholder="you@company.com"
                autoComplete="email"
                disabled={isLoading}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 transition-colors
                  ${errors.password ? 'border-red-500' : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'}
                `}
                placeholder="Create a strong password"
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Meter */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  <div className={`h-1 flex-1 rounded ${passwordStrength.color}`} />
                </div>
                <p className="text-xs text-slate-600">
                  Strength: <span className={`
                    ${passwordStrength.color.replace('bg-', 'text-')}
                  `}>
                    {passwordStrength.label}
                  </span>
                </p>
              </div>
            )}
            
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
            
            <p className="mt-2 text-xs text-slate-500">
              Use at least 8 characters. For stronger security, add numbers or symbols.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-slate-700 mb-2">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 transition-colors
                  ${errors.confirmPassword ? 'border-red-500' : passwordsMatch ? 'border-green-500' : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'}
                `}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {passwordsMatch && (
                <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
              )}
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
            {passwordsMatch && (
              <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Passwords match
              </p>
            )}
          </div>

          {/* Company Name (Optional) */}
          <div>
            <label htmlFor="companyName" className="block text-slate-700 mb-2">
              Company name <span className="text-slate-500">(optional)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-colors"
                placeholder="Acme Corporation"
                autoComplete="organization"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleAcceptTerms}
                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-100"
                disabled={isLoading}
              />
              <span className="text-slate-700 text-sm">
                I accept the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  Terms & Conditions
                </button>{' '}
                and{' '}
                <a href="/privacy" className="text-teal-600 hover:text-teal-700 underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.acceptTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            data-analytics="auth_signup_submit"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create account</span>
            )}
          </button>

          {/* Rate Limit Note */}
          <p className="text-xs text-slate-500 text-center">
            You can request a verification code 3 times per hour.
          </p>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-500 text-sm">Or sign up with</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Social Signup */}
        <SocialLoginButtons onSocialLogin={handleSocialSignup} />

        {/* Login Link */}
        <p className="mt-8 text-center text-slate-600 text-sm">
          Already registered?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-teal-600 hover:text-teal-700 transition-colors"
            data-analytics="auth_switch_to_login"
          >
            Log in
          </button>
        </p>
      </div>
      {showTermsModal && (
        <TermsModal 
          isOpen={showTermsModal} 
          onClose={() => setShowTermsModal(false)}
          onAccept={handleAcceptTerms}
          mode="accept"
        />
      )}
    </div>
  );
}