import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardSkeleton } from '../skeletons';

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

  // Show loading skeleton while checking auth
  if (loading) {
    return <DashboardSkeleton />;
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
