import React, { useState } from 'react';
import { DollarSign, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type ThresholdSettings = {
  autoApprovalLimit: number;
  dualApprovalThreshold: number;
  largeTransactionAlert: number;
  monthlyBudgetCap: number;
  paymentHoldDuration: number;
  currency: string;
};

export function FinanceThresholdsTab() {
  const [settings, setSettings] = useState<ThresholdSettings>({
    autoApprovalLimit: 50000,
    dualApprovalThreshold: 200000,
    largeTransactionAlert: 500000,
    monthlyBudgetCap: 5000000,
    paymentHoldDuration: 7,
    currency: 'PKR',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof ThresholdSettings, value: number | string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success('Finance thresholds updated successfully');
      setHasChanges(false);
      console.log('Settings saved:', settings);
      // In production: PATCH to /admin/settings/finance
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      autoApprovalLimit: 50000,
      dualApprovalThreshold: 200000,
      largeTransactionAlert: 500000,
      monthlyBudgetCap: 5000000,
      paymentHoldDuration: 7,
      currency: 'PKR',
    });
    setHasChanges(false);
    toast.info('Reset to default values');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Important</p>
          <p className="text-blue-700">
            These thresholds control automated payment workflows. Changes take effect immediately
            and apply to all new transactions.
          </p>
        </div>
      </div>

      {/* Auto-Approval Limit */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">Auto-Approval Limit</h3>
            <p className="text-sm text-gray-600 mb-4">
              Payments below this amount are automatically approved without manual review
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={settings.autoApprovalLimit}
                onChange={(e) => handleChange('autoApprovalLimit', Number(e.target.value))}
                className="w-48 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                min={0}
              />
              <span className="text-sm text-gray-500">{settings.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Approval Threshold */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-blue-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">Dual Approval Threshold</h3>
            <p className="text-sm text-gray-600 mb-4">
              Payments above this amount require two admin approvals before release
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={settings.dualApprovalThreshold}
                onChange={(e) => handleChange('dualApprovalThreshold', Number(e.target.value))}
                className="w-48 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                min={settings.autoApprovalLimit}
              />
              <span className="text-sm text-gray-500">{settings.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Large Transaction Alert */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">Large Transaction Alert</h3>
            <p className="text-sm text-gray-600 mb-4">
              Send email notifications to all admins when a transaction exceeds this amount
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={settings.largeTransactionAlert}
                onChange={(e) => handleChange('largeTransactionAlert', Number(e.target.value))}
                className="w-48 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                min={settings.dualApprovalThreshold}
              />
              <span className="text-sm text-gray-500">{settings.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Budget Cap */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-purple-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">Monthly Budget Cap</h3>
            <p className="text-sm text-gray-600 mb-4">
              Maximum total disbursements allowed per month across all projects
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={settings.monthlyBudgetCap}
                onChange={(e) => handleChange('monthlyBudgetCap', Number(e.target.value))}
                className="w-48 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                min={0}
              />
              <span className="text-sm text-gray-500">{settings.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Hold Duration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-red-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">Payment Hold Duration</h3>
            <p className="text-sm text-gray-600 mb-4">
              Default number of days a payment can be held before requiring resolution
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={settings.paymentHoldDuration}
                onChange={(e) => handleChange('paymentHoldDuration', Number(e.target.value))}
                className="w-48 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                min={1}
                max={30}
              />
              <span className="text-sm text-gray-500">days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          disabled={isSaving}
          className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
