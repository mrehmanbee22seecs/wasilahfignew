import React, { useState } from 'react';
import { Mail, MessageSquare, Code, CheckCircle, XCircle, Settings, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  config?: Record<string, any>;
};

export function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: 'Email service for transactional emails and notifications',
      icon: <Mail className="w-5 h-5" />,
      status: 'connected',
      lastSync: '2025-12-16T08:00:00Z',
      config: { apiKey: '••••••••••••7a3f', fromEmail: 'noreply@wasilah.pk' },
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team notifications for critical admin alerts',
      icon: <MessageSquare className="w-5 h-5" />,
      status: 'connected',
      lastSync: '2025-12-16T07:45:00Z',
      config: { webhookUrl: 'https://hooks.slack.com/services/T...', channel: '#wasilah-admin' },
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing for corporate donations',
      icon: <Code className="w-5 h-5" />,
      status: 'disconnected',
    },
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'SMS notifications for urgent approvals',
      icon: <MessageSquare className="w-5 h-5" />,
      status: 'error',
      config: { accountSid: 'AC••••••••••••••', error: 'Invalid credentials' },
    },
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const handleConnect = async (integrationId: string) => {
    toast.info(`Connecting to ${integrationId}...`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId
          ? { ...int, status: 'connected' as const, lastSync: new Date().toISOString() }
          : int
      )
    );

    toast.success('Integration connected successfully');
  };

  const handleDisconnect = async (integrationId: string) => {
    if (!window.confirm('Are you sure you want to disconnect this integration?')) return;

    toast.info('Disconnecting...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId ? { ...int, status: 'disconnected' as const, lastSync: undefined } : int
      )
    );

    toast.success('Integration disconnected');
  };

  const handleTestConnection = async (integrationId: string) => {
    toast.info('Testing connection...');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Connection test successful!');
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Connected
          </span>
        );
      case 'disconnected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            Disconnected
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 border border-red-200 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            Error
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Integrations</strong> connect Wasilah with third-party services for enhanced
          functionality. Configure API keys and webhooks to enable automated workflows.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-gray-900">{integration.name}</h3>
                  {getStatusBadge(integration.status)}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

            {/* Config Info */}
            {integration.config && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                {integration.status === 'error' && integration.config.error && (
                  <p className="text-xs text-red-700 mb-2">
                    <strong>Error:</strong> {integration.config.error}
                  </p>
                )}
                {Object.entries(integration.config)
                  .filter(([key]) => key !== 'error')
                  .map(([key, value]) => (
                    <div key={key} className="text-xs text-gray-600 mb-1">
                      <span className="text-gray-500">{key}:</span>{' '}
                      <code className="text-gray-900">{value}</code>
                    </div>
                  ))}
              </div>
            )}

            {/* Last Sync */}
            {integration.lastSync && (
              <p className="text-xs text-gray-500 mb-4">
                Last synced: {new Date(integration.lastSync).toLocaleString()}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {integration.status === 'disconnected' ? (
                <button
                  onClick={() => handleConnect(integration.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Connect
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleTestConnection(integration.id)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => {
                      setSelectedIntegration(integration);
                      setConfigModalOpen(true);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    title="Configure"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    Disconnect
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Integration */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
        <Code className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-gray-900 mb-1">Request New Integration</h3>
        <p className="text-sm text-gray-600 mb-4">
          Need to connect a service not listed here?
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm inline-flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Contact Support
        </button>
      </div>

      {/* Simple Config Modal */}
      {configModalOpen && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-gray-900">Configure {selectedIntegration.name}</h3>
              <button
                onClick={() => setConfigModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Integration settings can be managed in the platform's configuration panel.
            </p>
            <button
              onClick={() => {
                toast.info('Opening configuration...');
                setConfigModalOpen(false);
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
