import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, MapPin, Users, Clock, X } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  projectId?: string;
  projectName?: string;
  capacity?: number;
  attendeesCount: number;
  color: string;
}

interface CalendarTabProps {
  events: CalendarEvent[];
  onCreateEvent: (event: Omit<CalendarEvent, 'id' | 'attendeesCount'>) => void;
  onEventClick: (eventId: string) => void;
  projects?: Array<{
    id: string;
    title: string;
    color: string;
  }>;
}

export function CalendarTab({ events, onCreateEvent, onEventClick, projects = [] }: CalendarTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    projectId: '',
    projectName: '',
    capacity: 0,
    color: '#0d9488'
  });

  // Default project colors
  const defaultProjectColors: Record<string, string> = {
    'p1': '#0d9488', // teal
    'p2': '#2563eb', // blue
    'p3': '#8b5cf6', // violet
    'p4': '#ec4899', // pink
    'p5': '#f59e0b', // amber
    'p6': '#10b981', // emerald
  };

  const getProjectColor = (projectId: string | undefined): string => {
    if (!projectId) return '#0d9488';
    
    // Check if project exists in provided projects list
    const project = projects.find(p => p.id === projectId);
    if (project) return project.color;
    
    // Fallback to default colors
    return defaultProjectColors[projectId] || '#0d9488';
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date.startsWith(dateStr));
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert('Please fill in all required fields');
      return;
    }
    onCreateEvent(newEvent);
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      projectId: '',
      projectName: '',
      capacity: 0,
      color: '#0d9488'
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDate(day);
    const isToday = 
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear();

    days.push(
      <div
        key={day}
        className={`min-h-[120px] p-2 border border-slate-200 ${
          isToday ? 'bg-teal-50 border-teal-600' : 'bg-white hover:bg-slate-50'
        } transition-colors`}
      >
        <div className={`text-sm mb-2 ${isToday ? 'text-teal-700' : 'text-slate-600'}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="w-full text-left px-2 py-1 rounded text-xs hover:shadow-sm transition-all truncate"
              style={{ backgroundColor: `${event.color}20`, borderLeft: `3px solid ${event.color}` }}
              title={event.title}
            >
              <div className="text-slate-900 truncate">{event.title}</div>
              <div className="text-slate-600 text-xs">{event.time}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">Event Calendar</h1>
          <p className="text-slate-600">Schedule and manage volunteer events</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-200">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>

          <h2 className="text-slate-900 text-xl">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b-2 border-slate-200 bg-slate-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-slate-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900">Create Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">Event Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Beach Cleanup Drive"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Clifton Beach, Karachi"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Linked Project</label>
                <input
                  type="text"
                  value={newEvent.projectName}
                  onChange={(e) => setNewEvent({ ...newEvent, projectName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Select or type project name"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Capacity</label>
                <input
                  type="number"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="50"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Color</label>
                <div className="flex gap-2">
                  {['#0d9488', '#2563eb', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewEvent({ ...newEvent, color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        newEvent.color === color ? 'ring-4 ring-offset-2 ring-teal-600 scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Popover */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div 
                  className="w-1 h-12 rounded-full absolute left-6"
                  style={{ backgroundColor: selectedEvent.color }}
                />
                <h3 className="text-slate-900 ml-6">{selectedEvent.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 ml-6">
              <div className="flex items-center gap-3 text-slate-600">
                <Clock className="w-5 h-5" />
                <span>{new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}</span>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.capacity && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Users className="w-5 h-5" />
                  <span>{selectedEvent.attendeesCount} / {selectedEvent.capacity} attendees</span>
                </div>
              )}

              {selectedEvent.projectName && (
                <div className="text-slate-600">
                  <span className="text-slate-500">Project:</span>{' '}
                  <span className="text-teal-600">{selectedEvent.projectName}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => console.log('Edit event', selectedEvent.id)}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onEventClick(selectedEvent.id)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                View Attendees
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}