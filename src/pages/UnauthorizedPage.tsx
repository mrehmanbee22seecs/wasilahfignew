import React from 'react';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UnauthorizedPageProps {
  onNavigate: (page: string) => void;
}

export function UnauthorizedPage({ onNavigate }: UnauthorizedPageProps) {
  const { role, user } = useAuth();

  const handleGoToDashboard = () => {
    if (!role) {
      onNavigate('home');
      return;
    }

    switch (role) {
      case 'admin':
        onNavigate('admin-dashboard');
        break;
      case 'corporate':
        onNavigate('corporate-dashboard');
        break;
      case 'ngo':
        onNavigate('ngo-dashboard');
        break;
      case 'volunteer':
        onNavigate('volunteer-dashboard');
        break;
      default:
        onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>

          {/* User Info */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8 inline-block">
              <p className="text-sm text-gray-500 mb-1">You're logged in as:</p>
              <p className="text-base font-semibold text-gray-900">{user.email}</p>
              {role && (
                <p className="text-sm text-gray-600 mt-1">
                  Role: <span className="font-medium capitalize">{role}</span>
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 mb-8 text-left">
            <p className="text-sm text-blue-800">
              <strong>Why am I seeing this?</strong>
              <br />
              This page is restricted to specific user roles. You may have tried to access:
            </p>
            <ul className="mt-2 ml-4 text-sm text-blue-700 list-disc">
              <li>An admin-only page</li>
              <li>A dashboard for a different role</li>
              <li>A page that requires special permissions</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoToDashboard}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Go to My Dashboard
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </button>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@wasilah.pk" className="text-teal-600 hover:underline">
                support@wasilah.pk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
