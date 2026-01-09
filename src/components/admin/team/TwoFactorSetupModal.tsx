import React, { useState } from 'react';
import { X, Shield, Copy, Check, Smartphone, Key } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type TwoFactorSetupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onComplete: (userId: string, backupCodes: string[]) => Promise<void>;
};

export function TwoFactorSetupModal({
  isOpen,
  onClose,
  userId,
  userName,
  onComplete,
}: TwoFactorSetupModalProps) {
  const [step, setStep] = useState<'qr' | 'verify' | 'backup'>('qr');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  if (!isOpen) return null;

  // Mock data - in production, generate from backend
  const mockSecret = 'JBSWY3DPEHPK3PXP';
  const mockQRCode = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';

  const handleCopySecret = () => {
    navigator.clipboard.writeText(mockSecret);
    setCopiedSecret(true);
    toast.success('Secret key copied to clipboard');
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Mock verification - in production, verify with backend
      if (verificationCode === '123456' || verificationCode.length === 6) {
        // Generate backup codes
        const codes = Array.from({ length: 8 }, () =>
          Math.random().toString(36).substring(2, 10).toUpperCase()
        );
        setBackupCodes(codes);
        setStep('backup');
        toast.success('2FA verified successfully!');
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setCopiedCodes(true);
    toast.success('Backup codes copied to clipboard');
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleComplete = async () => {
    try {
      await onComplete(userId, backupCodes);
      toast.success('2FA enabled successfully for ' + userName);
      onClose();
    } catch (error) {
      console.error('Error completing 2FA setup:', error);
      toast.error('Failed to complete 2FA setup');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3 text-white">
            <Shield className="w-6 h-6" />
            <div>
              <h2 className="text-lg">Enable Two-Factor Authentication</h2>
              <p className="text-xs text-blue-100 mt-0.5">For {userName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === 'qr'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {step === 'qr' ? '1' : '✓'}
              </div>
              <span className="text-sm text-gray-700">Scan QR</span>
            </div>

            <div className="flex-1 h-0.5 bg-gray-300 mx-2" />

            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === 'qr'
                    ? 'bg-gray-300 text-gray-600'
                    : step === 'verify'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {step === 'backup' ? '✓' : '2'}
              </div>
              <span className="text-sm text-gray-700">Verify</span>
            </div>

            <div className="flex-1 h-0.5 bg-gray-300 mx-2" />

            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === 'backup' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                3
              </div>
              <span className="text-sm text-gray-700">Backup</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: QR Code */}
          {step === 'qr' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-4">
                  Scan this QR code with your authenticator app
                </p>
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                    <Smartphone className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2">Or enter this key manually:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 font-mono">
                    {mockSecret}
                  </code>
                  <button
                    onClick={handleCopySecret}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                  >
                    {copiedSecret ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  <strong>Recommended apps:</strong> Google Authenticator, Authy, Microsoft
                  Authenticator
                </p>
              </div>

              <button
                onClick={() => setStep('verify')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Verification
              </button>
            </div>
          )}

          {/* Step 2: Verify Code */}
          {step === 'verify' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Key className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="text-sm text-gray-700">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono"
                  autoFocus
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </button>

              <button
                onClick={() => setStep('qr')}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Back to QR Code
              </button>
            </div>
          )}

          {/* Step 3: Backup Codes */}
          {step === 'backup' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-emerald-700" />
                </div>
                <p className="text-sm text-gray-700">
                  Save these backup codes in a safe place
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  You can use them if you lose access to your authenticator app
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {backupCodes.map((code, index) => (
                    <code
                      key={index}
                      className="px-3 py-2 bg-white border border-gray-300 rounded text-xs text-gray-900 font-mono text-center"
                    >
                      {code}
                    </code>
                  ))}
                </div>
                <button
                  onClick={handleCopyBackupCodes}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedCodes ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy All Codes</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-900">
                  <strong>Important:</strong> Each backup code can only be used once. Store them
                  securely offline.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Complete Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
