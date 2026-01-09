import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertCircle } from 'lucide-react';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowBanner(true);
        // Auto-hide "back online" banner after 5 seconds
        setTimeout(() => setShowBanner(false), 5000);
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  if (!showBanner) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`
        fixed top-0 left-0 right-0 z-[90] px-4 py-3 text-sm
        flex items-center justify-center gap-2
        transition-all duration-300
        ${isOnline 
          ? 'bg-green-600 text-white' 
          : 'bg-red-600 text-white'
        }
      `}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>You're back online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>No internet connection. Some features may be unavailable.</span>
        </>
      )}
      
      <button
        onClick={() => setShowBanner(false)}
        className="ml-2 px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded transition-colors text-xs"
        aria-label="Dismiss"
      >
        Dismiss
      </button>
    </div>
  );
}

// Hook for components to check network status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
