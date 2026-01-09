import React, { useState } from 'react';
import { 
  Clock, MapPin, Camera, CheckCircle, Play, Square, 
  Calendar, TrendingUp, Award, FileText, AlertCircle 
} from 'lucide-react';
import type { VolunteerHoursSession, VolunteerHoursSummary, CheckInRequest, CheckOutRequest } from '../../types/volunteer-verification';
import { toast } from 'sonner@2.0.3';

interface HoursTrackingTabProps {
  sessions: VolunteerHoursSession[];
  summary: VolunteerHoursSummary;
  activeSession: VolunteerHoursSession | null;
  availableProjects: { id: string; name: string; ngoName: string; location: string }[];
  onCheckIn: (request: CheckInRequest) => Promise<void>;
  onCheckOut: (request: CheckOutRequest) => Promise<void>;
}

export function HoursTrackingTab({
  sessions,
  summary,
  activeSession,
  availableProjects,
  onCheckIn,
  onCheckOut
}: HoursTrackingTabProps) {
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) return `${wholeHours}h`;
    return `${wholeHours}h ${minutes}m`;
  };

  const getSessionDuration = (session: VolunteerHoursSession) => {
    if (session.totalHours) return formatDuration(session.totalHours);
    
    const start = new Date(session.checkInTime);
    const end = session.checkOutTime ? new Date(session.checkOutTime) : new Date();
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return formatDuration(hours);
  };

  const getStatusBadge = (status: VolunteerHoursSession['status']) => {
    const configs = {
      checked_in: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Active', icon: Play },
      checked_out: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending Verification', icon: Clock },
      verified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified', icon: CheckCircle },
      disputed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Disputed', icon: AlertCircle }
    };
    
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl text-gray-900 mb-1">Hours Tracking</h2>
        <p className="text-sm text-gray-600">
          Check in/out and track your volunteer hours
        </p>
      </div>

      {/* Active Session Card */}
      {activeSession ? (
        <div className="mb-6 bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center animate-pulse">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Active Session</h3>
                <p className="text-sm text-gray-600">{activeSession.projectName}</p>
                <p className="text-xs text-gray-500">{activeSession.ngoName}</p>
              </div>
            </div>
            <button
              onClick={() => setShowCheckOutModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Check Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Check-in Time</p>
              <p className="text-sm text-gray-900">{formatTime(activeSession.checkInTime)}</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Duration</p>
              <p className="text-sm text-gray-900">{getSessionDuration(activeSession)}</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Location</p>
              <p className="text-sm text-gray-900">{activeSession.checkInLocation?.address || 'No location'}</p>
            </div>
          </div>

          {activeSession.taskDescription && (
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Task</p>
              <p className="text-sm text-gray-900">{activeSession.taskDescription}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">No Active Session</h3>
          <p className="text-sm text-gray-600 mb-4">
            Check in to a project to start tracking your volunteer hours
          </p>
          <button
            onClick={() => setShowCheckInModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <Play className="w-4 h-4" />
            Check In
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">This Week</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl text-gray-900">{summary.thisWeek}h</div>
          <div className="text-xs text-gray-600 mt-1">Last 7 days</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">This Month</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl text-gray-900">{summary.thisMonth}h</div>
          <div className="text-xs text-gray-600 mt-1">January 2025</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Verified</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl text-gray-900">{summary.verifiedHours}h</div>
          <div className="text-xs text-gray-600 mt-1">Out of {summary.totalHours}h total</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">All Time</span>
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl text-gray-900">{summary.allTime}h</div>
          <div className="text-xs text-gray-600 mt-1">Total contribution</div>
        </div>
      </div>

      {/* Hours by Project */}
      {summary.byProject.length > 0 && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-gray-900 mb-4">Hours by Project</h3>
          <div className="space-y-3">
            {summary.byProject.map((project) => {
              const percentage = (project.hours / summary.totalHours) * 100;
              return (
                <div key={project.projectId}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">{project.projectName}</span>
                    <span className="text-sm text-gray-600">{project.hours}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-600 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-gray-900">Recent Sessions</h3>
          {!activeSession && (
            <button
              onClick={() => setShowCheckInModal(true)}
              className="px-3 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" />
              Check In
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600 text-sm mb-4">
              Check in to a project to start tracking your hours
            </p>
            <button
              onClick={() => setShowCheckInModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Check In Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sessions.slice(0, 10).map((session) => (
              <div key={session.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm text-gray-900">{session.projectName}</h4>
                      {getStatusBadge(session.status)}
                    </div>
                    <p className="text-xs text-gray-600">{session.ngoName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{getSessionDuration(session)}</p>
                    <p className="text-xs text-gray-600">{formatDate(session.checkInTime)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-600">Check-in</p>
                    <p className="text-gray-900">{formatTime(session.checkInTime)}</p>
                  </div>
                  {session.checkOutTime && (
                    <div>
                      <p className="text-gray-600">Check-out</p>
                      <p className="text-gray-900">{formatTime(session.checkOutTime)}</p>
                    </div>
                  )}
                </div>

                {session.taskDescription && (
                  <p className="text-xs text-gray-600 mt-2">{session.taskDescription}</p>
                )}

                {session.verifiedBy && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified by {session.verifiedBy}</span>
                  </div>
                )}

                {session.notes && (
                  <p className="text-xs text-gray-500 mt-2 italic">{session.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Check-in Modal */}
      {showCheckInModal && (
        <CheckInModal
          onClose={() => setShowCheckInModal(false)}
          onCheckIn={onCheckIn}
          availableProjects={availableProjects}
        />
      )}

      {/* Check-out Modal */}
      {showCheckOutModal && activeSession && (
        <CheckOutModal
          onClose={() => setShowCheckOutModal(false)}
          onCheckOut={onCheckOut}
          session={activeSession}
        />
      )}
    </div>
  );
}

// Check-in Modal
function CheckInModal({
  onClose,
  onCheckIn,
  availableProjects
}: {
  onClose: () => void;
  onCheckIn: (request: CheckInRequest) => Promise<void>;
  availableProjects: { id: string; name: string; ngoName: string; location: string }[];
}) {
  const [projectId, setProjectId] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [useLocation, setUseLocation] = useState(true);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [processing, setProcessing] = useState(false);

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // Mock reverse geocoding (in production, use Google Maps API)
      const address = 'Current Location';
      
      setLocation({ latitude, longitude, address });
      toast.success('Location captured');
    } catch (error) {
      toast.error('Could not get location. Please enable location services.');
      setUseLocation(false);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!projectId) {
      toast.error('Please select a project');
      return;
    }

    setProcessing(true);

    try {
      const request: CheckInRequest = {
        projectId,
        taskDescription: taskDescription || undefined,
        ...(location && {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address
        })
      };

      await onCheckIn(request);
      toast.success('Checked in successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to check in');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h3 className="text-xl text-gray-900 mb-4">Check In</h3>

        {/* Project Selection */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">
            Select Project <span className="text-red-600">*</span>
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Choose a project...</option>
            {availableProjects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} - {project.ngoName}
              </option>
            ))}
          </select>
        </div>

        {/* Task Description */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">
            What will you be doing? (Optional)
          </label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={3}
            placeholder="e.g., Beach cleanup and waste collection"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={useLocation}
              onChange={(e) => setUseLocation(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Capture my location</span>
          </label>

          {useLocation && (
            <div>
              {location ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-900">Location captured</span>
                </div>
              ) : (
                <button
                  onClick={getLocation}
                  disabled={loadingLocation}
                  className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  {loadingLocation ? 'Getting location...' : 'Get Current Location'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900">
            <strong>Tip:</strong> Make sure to check out when you finish to accurately track your hours.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={processing || !projectId}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {processing ? 'Checking In...' : 'Check In'}
          </button>
          <button
            onClick={onClose}
            disabled={processing}
            className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Check-out Modal
function CheckOutModal({
  onClose,
  onCheckOut,
  session
}: {
  onClose: () => void;
  onCheckOut: (request: CheckOutRequest) => Promise<void>;
  session: VolunteerHoursSession;
}) {
  const [notes, setNotes] = useState('');
  const [useLocation, setUseLocation] = useState(true);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [processing, setProcessing] = useState(false);

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const address = 'Current Location';
      
      setLocation({ latitude, longitude, address });
      toast.success('Location captured');
    } catch (error) {
      toast.error('Could not get location');
      setUseLocation(false);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = async () => {
    setProcessing(true);

    try {
      const request: CheckOutRequest = {
        sessionId: session.id,
        notes: notes || undefined,
        ...(location && {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address
        })
      };

      await onCheckOut(request);
      toast.success('Checked out successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to check out');
    } finally {
      setProcessing(false);
    }
  };

  const startTime = new Date(session.checkInTime);
  const duration = (new Date().getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h3 className="text-xl text-gray-900 mb-4">Check Out</h3>

        {/* Session Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Project</p>
          <p className="text-gray-900 mb-3">{session.projectName}</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">Check-in Time</p>
              <p className="text-sm text-gray-900">
                {startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Duration</p>
              <p className="text-sm font-medium text-gray-900">{hours}h {minutes}m</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">
            Session Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={3}
            placeholder="What did you accomplish today?"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={useLocation}
              onChange={(e) => setUseLocation(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Capture checkout location</span>
          </label>

          {useLocation && (
            <div>
              {location ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-900">Location captured</span>
                </div>
              ) : (
                <button
                  onClick={getLocation}
                  disabled={loadingLocation}
                  className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  {loadingLocation ? 'Getting location...' : 'Get Current Location'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={processing}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Square className="w-4 h-4" />
            {processing ? 'Checking Out...' : 'Check Out'}
          </button>
          <button
            onClick={onClose}
            disabled={processing}
            className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
