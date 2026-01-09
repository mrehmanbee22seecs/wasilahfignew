import React from 'react';
import { X, User, Mail, Building2, Calendar, Award, TrendingUp, Phone, MapPin } from 'lucide-react';

export interface VolunteerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  status: 'invited' | 'registered' | 'active';
  joinedAt?: string;
  eventsJoined: number;
  totalHours?: number;
  skills?: string[];
  location?: string;
  bio?: string;
  availability?: string[];
  recentEvents?: Array<{
    id: string;
    title: string;
    date: string;
    hoursContributed: number;
  }>;
  badges?: Array<{
    id: string;
    name: string;
    icon: string;
    earnedAt: string;
  }>;
}

interface VolunteerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: VolunteerProfile;
  onSendMessage?: (volunteerId: string) => void;
  onAssignToEvent?: (volunteerId: string) => void;
}

export function VolunteerProfileModal({
  isOpen,
  onClose,
  volunteer,
  onSendMessage,
  onAssignToEvent
}: VolunteerProfileModalProps) {
  if (!isOpen) return null;

  const statusConfig = {
    invited: { label: 'Invited', color: 'bg-amber-100 text-amber-700 border-amber-300' },
    registered: { label: 'Registered', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    active: { label: 'Active', color: 'bg-green-100 text-green-700 border-green-300' }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-teal-600 to-blue-600 p-8 rounded-t-xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                aria-label="Close profile"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-teal-600 flex-shrink-0 shadow-lg">
                  {volunteer.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 text-white">
                  <h2 className="text-2xl font-bold mb-2">{volunteer.name}</h2>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full border text-sm ${statusConfig[volunteer.status].color}`}>
                      {statusConfig[volunteer.status].label}
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                      {volunteer.department}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-white/90 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{volunteer.email}</span>
                    </div>
                    {volunteer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{volunteer.phone}</span>
                      </div>
                    )}
                    {volunteer.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{volunteer.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4 text-center">
                  <Calendar className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-teal-700">{volunteer.eventsJoined}</div>
                  <div className="text-teal-600 text-sm">Events Joined</div>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">{volunteer.totalHours || 0}</div>
                  <div className="text-blue-600 text-sm">Total Hours</div>
                </div>
                <div className="bg-violet-50 border-2 border-violet-200 rounded-lg p-4 text-center">
                  <Award className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-violet-700">{volunteer.badges?.length || 0}</div>
                  <div className="text-violet-600 text-sm">Badges Earned</div>
                </div>
              </div>

              {/* Bio */}
              {volunteer.bio && (
                <div className="mb-6">
                  <h3 className="text-slate-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-600" />
                    About
                  </h3>
                  <p className="text-slate-600 bg-slate-50 rounded-lg p-4 border-2 border-slate-200">
                    {volunteer.bio}
                  </p>
                </div>
              )}

              {/* Skills */}
              {volunteer.skills && volunteer.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-slate-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-teal-600" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm border border-teal-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {volunteer.availability && volunteer.availability.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-slate-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    Availability
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.availability.map((day, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm border border-blue-300"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Events */}
              {volunteer.recentEvents && volunteer.recentEvents.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-slate-900 mb-3">Recent Events</h3>
                  <div className="space-y-2">
                    {volunteer.recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex-1">
                          <div className="text-slate-900 font-medium">{event.title}</div>
                          <div className="text-slate-600 text-sm">
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-teal-600 font-medium text-sm">
                          {event.hoursContributed}h
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges */}
              {volunteer.badges && volunteer.badges.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-slate-900 mb-3">Achievements</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {volunteer.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-300"
                      >
                        <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-2xl">
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-slate-900 font-medium text-sm">{badge.name}</div>
                          <div className="text-slate-600 text-xs">
                            {new Date(badge.earnedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Joined Date */}
              {volunteer.joinedAt && (
                <p className="text-slate-500 text-sm mb-6">
                  Member since {new Date(volunteer.joinedAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {onSendMessage && (
                  <button
                    onClick={() => onSendMessage(volunteer.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    Send Message
                  </button>
                )}
                {onAssignToEvent && (
                  <button
                    onClick={() => onAssignToEvent(volunteer.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Calendar className="w-5 h-5" />
                    Assign to Event
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
