import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

type UserRole = 'admin' | 'corporate' | 'ngo' | 'volunteer';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  onUnauthorized?: () => void;
  onUnauthenticated?: () => void;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  onUnauthorized,
  onUnauthenticated,
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // No user logged in
      if (!user) {
        if (onUnauthenticated) {
          onUnauthenticated();
        }
        return;
      }

      // User logged in but wrong role
      if (role && !allowedRoles.includes(role)) {
        if (onUnauthorized) {
          onUnauthorized();
        }
        return;
      }
    }
  }, [user, role, loading, allowedRoles, onUnauthorized, onUnauthenticated]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // No user - don't render
  if (!user) {
    return null;
  }

  // User has wrong role - don't render
  if (role && !allowedRoles.includes(role)) {
    return null;
  }

  // User is authenticated and has correct role
  return <>{children}</>;
}
