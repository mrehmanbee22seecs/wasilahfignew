import React, { useState } from 'react';
import { User, Clock, MessageSquare, CheckCircle, Calendar, XCircle, FileCheck, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import type { VerificationTimelineProps } from '../../types/ngo';

export function VerificationTimeline({ timeline, currentStatus }: VerificationTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'submit':
        return { icon: FileCheck, color: 'bg-indigo-100 text-indigo-600', borderColor: 'border-indigo-300' };
      case 'approve':
        return { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600', borderColor: 'border-emerald-300' };
      case 'reject':
        return { icon: XCircle, color: 'bg-rose-100 text-rose-600', borderColor: 'border-rose-300' };
      case 'comment':
        return { icon: MessageSquare, color: 'bg-blue-100 text-blue-600', borderColor: 'border-blue-300' };
      case 'site_visit':
        return { icon: Calendar, color: 'bg-purple-100 text-purple-600', borderColor: 'border-purple-300' };
      default:
        return { icon: Clock, color: 'bg-slate-100 text-slate-600', borderColor: 'border-slate-300' };
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'submit':
        return 'Verification Submitted';
      case 'approve':
        return 'Approved';
      case 'reject':
        return 'Rejected';
      case 'comment':
        return 'Comment Added';
      case 'site_visit':
        return 'Site Visit Scheduled';
      default:
        return action.replace('_', ' ');
    }
  };

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case 'ngo_admin':
        return 'bg-indigo-100 text-indigo-700';
      case 'wasilah_ops':
        return 'bg-emerald-100 text-emerald-700';
      case 'system':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    let relativeTime = '';
    if (diffMinutes < 60) {
      relativeTime = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      relativeTime = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      relativeTime = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      relativeTime = '';
    }

    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      relativeTime
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900">Verification Timeline</h3>
        <span className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${currentStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' : ''}
          ${currentStatus === 'in_progress' ? 'bg-blue-100 text-blue-700' : ''}
          ${currentStatus === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
          ${currentStatus === 'rejected' ? 'bg-rose-100 text-rose-700' : ''}
          ${currentStatus === 'unverified' ? 'bg-slate-100 text-slate-600' : ''}
        `}>
          {currentStatus.replace('_', ' ')}
        </span>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />

        {/* Timeline Items */}
        <div className="space-y-6">
          {timeline.map((audit, index) => {
            const { icon: Icon, color, borderColor } = getActionIcon(audit.action);
            const { date, time, weekday, relativeTime } = formatTimestamp(audit.created_at);
            const isLast = index === timeline.length - 1;
            const isExpanded = expandedItems.has(audit.id);
            const hasLongNote = audit.note && audit.note.length > 150;

            return (
              <div 
                key={audit.id} 
                className="relative pl-14 animate-in fade-in slide-in-from-left-4 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Pulse indicator for most recent */}
                {index === 0 && (
                  <div className="absolute left-0 w-10 h-10 rounded-full animate-ping opacity-20 z-0" 
                       style={{ backgroundColor: color.includes('indigo') ? '#4f46e5' : color.includes('emerald') ? '#10b981' : color.includes('blue') ? '#3b82f6' : color.includes('rose') ? '#f43f5e' : color.includes('purple') ? '#a855f7' : '#64748b' }} />
                )}

                {/* Icon with border ring */}
                <div className={`
                  absolute left-0 w-10 h-10 rounded-full ${color} 
                  flex items-center justify-center z-10 
                  border-2 ${borderColor}
                  transition-all duration-300 hover:scale-110
                  ${index === 0 ? 'ring-4 ring-opacity-20' : ''}
                `}
                style={index === 0 ? { ringColor: color.includes('indigo') ? '#4f46e5' : color.includes('emerald') ? '#10b981' : color.includes('blue') ? '#3b82f6' : color.includes('rose') ? '#f43f5e' : color.includes('purple') ? '#a855f7' : '#64748b' } : {}}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content Card */}
                <div className={`
                  bg-white border-2 rounded-xl p-5 
                  transition-all duration-300
                  ${index === 0 ? 'border-indigo-200 shadow-md' : 'border-slate-200 hover:border-indigo-200 hover:shadow-sm'}
                `}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-base text-slate-900 font-medium">
                          {getActionLabel(audit.action)}
                        </h4>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span className="font-medium">{audit.user_name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-medium ${getUserRoleBadge(audit.user_role)}`}>
                          {audit.user_role === 'ngo_admin' ? 'NGO Admin' : audit.user_role === 'wasilah_ops' ? 'Wasilah Team' : 'System'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="flex flex-col items-end text-xs">
                      {relativeTime && (
                        <span className="text-indigo-600 font-medium mb-1">{relativeTime}</span>
                      )}
                      <span className="text-slate-500">{weekday}</span>
                      <span className="text-slate-500">{date}</span>
                      <span className="text-slate-400">{time}</span>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {audit.note && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500 font-medium">Admin Notes</span>
                      </div>
                      <div className={`
                        text-sm text-slate-700 bg-gradient-to-br from-slate-50 to-blue-50 
                        px-4 py-3 rounded-lg border-2 border-slate-100
                        ${hasLongNote && !isExpanded ? 'line-clamp-3' : ''}
                      `}>
                        {audit.note}
                      </div>
                      {hasLongNote && (
                        <button
                          onClick={() => toggleExpanded(audit.id)}
                          className="mt-2 flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5" />
                              Show More
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Connector line (gradient fade to next item) */}
                {!isLast && (
                  <div 
                    className="absolute left-5 top-14 w-0.5 h-6 bg-gradient-to-b from-slate-200 to-transparent"
                    style={{ height: '2rem' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {timeline.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600">No timeline activity yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Submit a verification request to get started
          </p>
        </div>
      )}
    </div>
  );
}