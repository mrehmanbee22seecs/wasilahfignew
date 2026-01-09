import React, { useState } from 'react';
import { Code, Key, Copy, Check, Plus, Trash2, Eye, EyeOff, Terminal } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type APIKey = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
};

export function DeveloperTab() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 'key-001',
      name: 'Production API',
      key: 'wsl_live_1a2b3c4d5e6f7g8h9i0j',
      createdAt: '2024-11-15T00:00:00Z',
      lastUsed: '2025-12-16T07:30:00Z',
      permissions: ['read', 'write'],
    },
    {
      id: 'key-002',
      name: 'Development API',
      key: 'wsl_test_9z8y7x6w5v4u3t2s1r0q',
      createdAt: '2024-12-01T00:00:00Z',
      lastUsed: '2025-12-15T14:00:00Z',
      permissions: ['read'],
    },
  ]);

  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleToggleReveal = (keyId: string) => {
    setRevealedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const handleCopyKey = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateKey = () => {
    const newKey: APIKey = {
      id: 'key-' + Date.now(),
      name: 'New API Key',
      key: 'wsl_live_' + Math.random().toString(36).substring(2, 22),
      createdAt: new Date().toISOString(),
      permissions: ['read'],
    };

    setApiKeys((prev) => [newKey, ...prev]);
    toast.success('API key created successfully');
  };

  const handleDeleteKey = (keyId: string) => {
    if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
    toast.success('API key deleted');
  };

  const maskKey = (key: string) => {
    if (key.length < 10) return key;
    const prefix = key.substring(0, 8);
    return prefix + '•'.repeat(key.length - 8);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <Terminal className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-medium mb-1">Developer Settings</p>
          <p className="text-amber-700">
            API keys provide programmatic access to Wasilah. Keep them secure and never share
            them publicly. Each key can be scoped with specific permissions.
          </p>
        </div>
      </div>

      {/* Create New Key Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900">API Keys</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage API keys for programmatic access
          </p>
        </div>
        <button
          onClick={handleCreateKey}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create API Key
        </button>
      </div>

      {/* API Keys List */}
      <div className="space-y-3">
        {apiKeys.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No API keys created yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Create your first API key to get started
            </p>
          </div>
        ) : (
          apiKeys.map((apiKey) => {
            const isRevealed = revealedKeys.has(apiKey.id);
            const isCopied = copiedKey === apiKey.id;

            return (
              <div
                key={apiKey.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-gray-900">{apiKey.name}</h4>
                      <div className="flex items-center gap-1">
                        {apiKey.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Created {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                      {apiKey.lastUsed && (
                        <>
                          <span>•</span>
                          <span>Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteKey(apiKey.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete API key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* API Key Display */}
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 font-mono">
                    {isRevealed ? apiKey.key : maskKey(apiKey.key)}
                  </code>

                  <button
                    onClick={() => handleToggleReveal(apiKey.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title={isRevealed ? 'Hide key' : 'Reveal key'}
                  >
                    {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* API Documentation */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h3 className="text-gray-900">API Documentation</h3>
            <p className="text-sm text-gray-600 mt-1">
              Learn how to integrate with Wasilah's API
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast.info('Opening API documentation...');
            }}
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">API Reference</p>
                <p className="text-xs text-gray-500">Complete endpoint documentation</p>
              </div>
              <Code className="w-4 h-4 text-gray-400" />
            </div>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast.info('Opening quickstart guide...');
            }}
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Quickstart Guide</p>
                <p className="text-xs text-gray-500">Get started in 5 minutes</p>
              </div>
              <Terminal className="w-4 h-4 text-gray-400" />
            </div>
          </a>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Terminal className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-gray-900">Webhooks</h3>
            <p className="text-sm text-gray-600 mt-1">
              Receive real-time notifications for platform events
            </p>
          </div>
        </div>

        <button
          onClick={() => toast.info('Webhook configuration coming soon')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Configure Webhooks
        </button>
      </div>
    </div>
  );
}
