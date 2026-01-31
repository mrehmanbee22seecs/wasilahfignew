import React, { useState } from 'react';
import { Save, AlertCircle, Clock, Database, Mail, Shield, DollarSign, Code, Palette, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { FinanceThresholdsTab } from '../components/admin/settings/FinanceThresholdsTab';
import { IntegrationsTab } from '../components/admin/settings/IntegrationsTab';
import { DeveloperTab } from '../components/admin/settings/DeveloperTab';
import { PlatformBrandTab } from '../components/admin/settings/PlatformBrandTab';

/**
 * Admin Settings Page
 * 
 * Route: /admin/settings
 * 
 * Features:
 * - SLA thresholds configuration
 * - Audit log retention settings
 * - Notification preferences
 * - System configurations
 * - Security settings
 * - Finance thresholds
 * - Integrations
 * - Developer API settings
 * - Platform branding
 * 
 * API Endpoints:
 * - GET /admin/settings
 * - PATCH /admin/settings
 */

type TabType = 'general' | 'finance' | 'integrations' | 'developer' | 'branding';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSaving, setIsSaving] = useState(false);

  // SLA Settings
  const [slaVetting, setSlaVetting] = useState(7);
  const [slaCase, setSlaCase] = useState(14);
  const [slaPayment, setSlaPayment] = useState(3);

  // Audit Log Settings
  const [auditRetentionDays, setAuditRetentionDays] = useState(365);
  const [enableAutoArchive, setEnableAutoArchive] = useState(true);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [notifyOnVettingSubmit, setNotifyOnVettingSubmit] = useState(true);
  const [notifyOnCaseEscalation, setNotifyOnCaseEscalation] = useState(true);
  const [notifyOnPaymentRelease, setNotifyOnPaymentRelease] = useState(true);

  // Security Settings
  const [requireTwoFactor, setRequireTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production: POST to /admin/settings
      const settings = {
        sla: {
          vettingDays: slaVetting,
          caseDays: slaCase,
          paymentDays: slaPayment,
        },
        audit: {
          retentionDays: auditRetentionDays,
          autoArchive: enableAutoArchive,
        },
        notifications: {
          email: emailNotifications,
          slack: slackNotifications,
          onVettingSubmit: notifyOnVettingSubmit,
          onCaseEscalation: notifyOnCaseEscalation,
          onPaymentRelease: notifyOnPaymentRelease,
        },
        security: {
          twoFactor: requireTwoFactor,
          sessionTimeoutMinutes: sessionTimeout,
          maxLoginAttempts: maxLoginAttempts,
        },
      };

      console.log('Saving settings:', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Admin Settings</h1>
              <p className="text-sm text-gray-600 mt-1">
                Configure system behavior, SLAs, and security
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* SLA Thresholds */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg text-gray-900">SLA Thresholds</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Define service level agreement timeframes for different operations. Alerts will trigger when
              these thresholds are exceeded.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-gray-700 block mb-2">
                  Vetting Review (days)
                </label>
                <input
                  type="number"
                  value={slaVetting}
                  onChange={(e) => setSlaVetting(parseInt(e.target.value) || 0)}
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Time to complete NGO vetting</p>
              </div>

              <div>
                <label className="text-sm text-gray-700 block mb-2">
                  Case Resolution (days)
                </label>
                <input
                  type="number"
                  value={slaCase}
                  onChange={(e) => setSlaCase(parseInt(e.target.value) || 0)}
                  min="1"
                  max="90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Time to resolve investigation cases</p>
              </div>

              <div>
                <label className="text-sm text-gray-700 block mb-2">
                  Payment Processing (days)
                </label>
                <input
                  type="number"
                  value={slaPayment}
                  onChange={(e) => setSlaPayment(parseInt(e.target.value) || 0)}
                  min="1"
                  max="14"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Time to process payment approvals</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900">
                Changes to SLA thresholds will affect all new and pending items. Existing alerts will
                be recalculated.
              </p>
            </div>
          </div>

          {/* Audit Log Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg text-gray-900">Audit Log Retention</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Configure how long audit logs are retained and archived. Logs are immutable and cannot
              be deleted within the retention period.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 block mb-2">
                  Retention Period (days)
                </label>
                <input
                  type="number"
                  value={auditRetentionDays}
                  onChange={(e) => setAuditRetentionDays(parseInt(e.target.value) || 0)}
                  min="90"
                  max="3650"
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 90 days. Recommended: 365 days for compliance.
                </p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableAutoArchive}
                  onChange={(e) => setEnableAutoArchive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm text-gray-900 block">Enable Auto-Archive</span>
                  <span className="text-xs text-gray-500">
                    Automatically archive logs older than retention period to cold storage
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg text-gray-900">Notification Preferences</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Configure when and how admins receive notifications for important events.
            </p>

            <div className="space-y-4">
              {/* Channels */}
              <div>
                <h3 className="text-sm text-gray-700 mb-3">Notification Channels</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">Email Notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slackNotifications}
                      onChange={(e) => setSlackNotifications(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">Slack Notifications</span>
                  </label>
                </div>
              </div>

              {/* Events */}
              <div>
                <h3 className="text-sm text-gray-700 mb-3">Notify On</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnVettingSubmit}
                      onChange={(e) => setNotifyOnVettingSubmit(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">New Vetting Request Submitted</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnCaseEscalation}
                      onChange={(e) => setNotifyOnCaseEscalation(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">Case Escalated</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnPaymentRelease}
                      onChange={(e) => setNotifyOnPaymentRelease(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">Payment Released</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-red-600" />
              <h2 className="text-lg text-gray-900">Security Settings</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Configure authentication and session security parameters.
            </p>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireTwoFactor}
                  onChange={(e) => setRequireTwoFactor(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-0.5"
                />
                <div>
                  <span className="text-sm text-gray-900 block">Require Two-Factor Authentication</span>
                  <span className="text-xs text-gray-500">
                    All admin users must enable 2FA to access the dashboard
                  </span>
                </div>
              </label>

              <div>
                <label className="text-sm text-gray-700 block mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(parseInt(e.target.value) || 0)}
                  min="15"
                  max="480"
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-logout after period of inactivity
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-700 block mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value) || 0)}
                  min="3"
                  max="10"
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Account locked after exceeding failed login attempts
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-900">
                Security setting changes take effect immediately and may require users to re-authenticate.
              </p>
            </div>
          </div>

          {/* Finance Thresholds */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-lg text-gray-900">Finance Thresholds</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Configure financial thresholds for automated actions and alerts.
            </p>

            <FinanceThresholdsTab />
          </div>

          {/* Integrations */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg text-gray-900">Integrations</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Connect third-party services and APIs for enhanced functionality.
            </p>

            <IntegrationsTab />
          </div>

          {/* Developer API Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg text-gray-900">Developer API Settings</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Configure API keys and access permissions for developers.
            </p>

            <DeveloperTab />
          </div>

          {/* Platform Branding */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg text-gray-900">Platform Branding</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Customize the appearance and branding of the platform.
            </p>

            <PlatformBrandTab />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-end gap-3 pb-8">
          <button
            onClick={() => toast.info('Reset to defaults')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}