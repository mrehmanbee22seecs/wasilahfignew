import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

/**
 * SLA Timer Component
 * 
 * Displays time remaining until SLA deadline
 * Color-coded based on urgency:
 * - Green: > 48 hours remaining
 * - Amber: 24-48 hours remaining
 * - Red: < 24 hours remaining
 * - Critical Red: Overdue
 */

export type SLATimerProps = {
  deadline: string; // ISO 8601 timestamp
  compact?: boolean;
  showIcon?: boolean;
  className?: string;
};

export function SLATimer({ deadline, compact = false, showIcon = true, className = '' }: SLATimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    isOverdue: boolean;
    urgency: 'normal' | 'warning' | 'critical' | 'overdue';
  }>({
    hours: 0,
    minutes: 0,
    isOverdue: false,
    urgency: 'normal',
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const diff = deadlineTime - now;

      if (diff <= 0) {
        const overdueDiff = Math.abs(diff);
        const hours = Math.floor(overdueDiff / (1000 * 60 * 60));
        const minutes = Math.floor((overdueDiff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining({
          hours,
          minutes,
          isOverdue: true,
          urgency: 'overdue',
        });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      let urgency: 'normal' | 'warning' | 'critical' | 'overdue' = 'normal';
      if (hours < 24) {
        urgency = 'critical';
      } else if (hours < 48) {
        urgency = 'warning';
      }

      setTimeRemaining({
        hours,
        minutes,
        isOverdue: false,
        urgency,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [deadline]);

  const getColorClasses = () => {
    switch (timeRemaining.urgency) {
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const formatTime = () => {
    if (compact) {
      if (timeRemaining.isOverdue) {
        return `${timeRemaining.hours}h overdue`;
      }
      if (timeRemaining.hours >= 24) {
        const days = Math.floor(timeRemaining.hours / 24);
        return `${days}d ${timeRemaining.hours % 24}h`;
      }
      return `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
    }

    if (timeRemaining.isOverdue) {
      return `${timeRemaining.hours}h ${timeRemaining.minutes}m overdue`;
    }
    if (timeRemaining.hours >= 24) {
      const days = Math.floor(timeRemaining.hours / 24);
      const remainingHours = timeRemaining.hours % 24;
      return `${days} day${days > 1 ? 's' : ''} ${remainingHours}h remaining`;
    }
    return `${timeRemaining.hours}h ${timeRemaining.minutes}m remaining`;
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 border rounded-full
        ${getColorClasses()}
        ${compact ? 'text-xs' : 'text-sm'}
        ${className}
      `}
      title={`SLA deadline: ${new Date(deadline).toLocaleString()}`}
      aria-label={`SLA timer: ${formatTime()}`}
    >
      {showIcon && (
        <>
          {timeRemaining.urgency === 'overdue' || timeRemaining.urgency === 'critical' ? (
            <AlertTriangle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
        </>
      )}
      <span>{formatTime()}</span>
    </div>
  );
}
