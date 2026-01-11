import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface RealtimeIndicatorProps {
  isConnected: boolean;
  className?: string;
}

export function RealtimeIndicator({ isConnected, className = '' }: RealtimeIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-emerald-600" />
          <span className="text-xs text-slate-600">Live</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Offline</span>
        </>
      )}
    </div>
  );
}
