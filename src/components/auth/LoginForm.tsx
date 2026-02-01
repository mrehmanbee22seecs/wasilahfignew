import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { SocialLoginButtons } from './SocialLoginButtons';
import { login } from '../../services/authService';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { enableRememberMe } from '../../services/sessionPersistenceService';
import { AuthEvents } from '../../services/analyticsService';
import { validateInput } from '../../lib/security/inputValidator';
import { logger } from '../../lib/security/secureLogger';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignup, onForgotPassword }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation with secure input validator
    const newErrors: typeof errors = {};
    
    // Validate email
    const emailValidation = validateInput.email(formData.email);
    if (!formData.email) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailValidation.valid) {
      newErrors.email = emailValidation.errors[0] || 'Please enter a valid email address.';
    }
    
    // Validate password
    const passwordValidation = validateInput.string(formData.password, {
      minLength: 1,
      maxLength: 1000,
      allowSpecialChars: true
    });
    if (!formData.password) {
      newErrors.password = 'Please enter your password.';
    } else if (!passwordValidation.valid) {
      newErrors.password = 'Invalid password format.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Track login attempt
    AuthEvents.loginStarted('email');

    try {
      // Real Supabase authentication with sanitized inputs
      const result = await login({
        email: emailValidation.sanitized,
        password: passwordValidation.sanitized,
        rememberMe: formData.rememberMe
      });
      
      if (!result.success) {
        setErrors({
          general: result.error || 'Login failed. Please try again.'
        });
        AuthEvents.loginFailed(result.error || 'Unknown error');
        return;
      }
      
      // Enable remember me if checked
      if (formData.rememberMe && result.data?.user) {
        await enableRememberMe(result.data.user.id, emailValidation.sanitized);
      }

      // Track successful login
      AuthEvents.loginCompleted('email');
      
      onSuccess();
    } catch (error) {
      logger.error('Login error', { error });
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      });
      AuthEvents.loginFailed('Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // OAuth handled by SocialLoginButtons component
    logger.info('OAuth login initiated', { provider });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-600">Log in to continue managing CSR projects</p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div 
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-200"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors
                  ${errors.email 
                    ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100' 
                    : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                placeholder="you@company.com"
                autoComplete="email"
                disabled={isLoading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
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
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 transition-colors
                  ${errors.password 
                    ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100' 
                    : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-100 focus:ring-offset-0"
                disabled={isLoading}
              />
              <span className="text-slate-700 text-sm">Remember me</span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            data-analytics="auth_login_submit"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Log in</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-500 text-sm">Or continue with</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Social Login */}
        <SocialLoginButtons onSocialLogin={handleSocialLogin} />

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-slate-600 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-teal-600 hover:text-teal-700 transition-colors"
            data-analytics="auth_switch_to_signup"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}