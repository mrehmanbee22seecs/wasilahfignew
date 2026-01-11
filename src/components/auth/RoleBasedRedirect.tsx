import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface RoleBasedRedirectProps {
  onRedirect: (page: string) => void;
  returnTo?: string;
}

export function RoleBasedRedirect({ onRedirect, returnTo }: RoleBasedRedirectProps) {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && role) {
      // If there's a return URL, use it
      if (returnTo) {
        onRedirect(returnTo);
        return;
      }

      // Otherwise redirect based on role
      switch (role) {
        case 'admin':
          onRedirect('admin-dashboard');
          break;
        case 'corporate':
          onRedirect('corporate-dashboard');
          break;
        case 'ngo':
          onRedirect('ngo-dashboard');
          break;
        case 'volunteer':
          onRedirect('volunteer-dashboard');
          break;
        default:
          onRedirect('home');
      }
    }
  }, [user, role, loading, onRedirect, returnTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
}
