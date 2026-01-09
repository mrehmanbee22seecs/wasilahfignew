import React, { useState, useRef, useEffect } from 'react';
import { Mail, AlertCircle, CheckCircle, Loader, RefreshCw } from 'lucide-react';
import { verifyOTP, resendOTP } from '../../services/authService';
import { maskEmailForVerification } from '../../utils/emailMasking';

interface OTPFormProps {
  email: string;
  onSuccess: () => void;
  onChangeEmail: () => void;
}

export function OTPForm({ email, onSuccess, onChangeEmail }: OTPFormProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields filled
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setError('');
      inputRefs.current[5]?.focus();
      
      // Auto-verify after paste
      setTimeout(() => handleVerify(pastedData), 100);
    }
  };

  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    setError('');

    try {
      // Real Supabase OTP verification
      const result = await verifyOTP({
        email,
        token: code,
        type: 'signup'
      });
      
      if (!result.success) {
        const newAttemptsLeft = Math.max(0, attemptsLeft - 1);
        setAttemptsLeft(newAttemptsLeft);
        
        if (newAttemptsLeft === 0) {
          setError('Too many failed attempts. Please request a new code or contact support.');
        } else {
          setError(result.error || `Invalid code. ${newAttemptsLeft} attempts remaining.`);
        }
        
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }
      
      onSuccess();
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError('');

    try {
      // Real Supabase OTP resend
      const result = await resendOTP(email, 'signup');
      
      if (!result.success) {
        setError(result.error || 'Failed to resend code. Please try again.');
        return;
      }
      
      // Reset cooldown
      setResendCooldown(30);
      setError('');
      
      // Show success message briefly
      const successMsg = 'Code resent! Check your email.';
      setError(successMsg);
      setTimeout(() => {
        if (error === successMsg) setError('');
      }, 3000);
    } catch (err: any) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-slate-900 mb-2">Verify your email</h1>
          <p className="text-slate-600">
            We sent a 6-digit code to<br />
            <span className="text-slate-900">{maskEmailForVerification(email)}</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-14 h-14 text-center text-2xl rounded-lg border-2 transition-all
                  ${error 
                    ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100' 
                    : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                disabled={isVerifying || attemptsLeft === 0}
                aria-label={`Digit ${index + 1} of 6`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2" role="alert">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify(otp.join(''))}
          disabled={isVerifying || otp.some(d => d === '') || attemptsLeft === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-6"
          data-analytics="auth_verify_otp"
        >
          {isVerifying ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Verify</span>
            </>
          )}
        </button>

        {/* Resend Code */}
        <div className="text-center space-y-4">
          <div>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors disabled:text-slate-400 disabled:cursor-not-allowed"
              data-analytics="auth_resend_otp"
            >
              <RefreshCw className={`w-4 h-4 ${resendCooldown === 0 ? '' : 'opacity-50'}`} />
              <span>
                {resendCooldown > 0 
                  ? `Resend available in ${resendCooldown}s` 
                  : 'Resend code'
                }
              </span>
            </button>
          </div>

          <p className="text-slate-600 text-sm">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="text-teal-600 hover:text-teal-700 transition-colors disabled:text-slate-400"
            >
              Resend
            </button>
            {' '}or check your spam folder.
          </p>

          <button
            onClick={onChangeEmail}
            className="text-slate-600 hover:text-slate-900 text-sm transition-colors"
            data-analytics="auth_change_email"
          >
            Change email address
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700 text-xs text-center">
            🔒 This code expires in 10 minutes. For security, you have {attemptsLeft} verification attempts remaining.
          </p>
        </div>
      </div>
    </div>
  );
}