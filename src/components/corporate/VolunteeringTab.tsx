import React, { useState } from 'react';
import { Upload, Mail, UserPlus, Download, CheckCircle, AlertCircle, X, Eye, Edit2 } from 'lucide-react';
import { VolunteerProfileModal, VolunteerProfile } from './VolunteerProfileModal';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'invited' | 'registered' | 'active';
  joinedAt?: string;
  eventsJoined: number;
}

interface VolunteeringTabProps {
  volunteers: Volunteer[];
  onInviteSingle: (email: string, message: string) => void;
  onImportCSV: (volunteers: Omit<Volunteer, 'id' | 'status' | 'eventsJoined'>[]) => void;
}

export function VolunteeringTab({ volunteers, onInviteSingle, onImportCSV }: VolunteeringTabProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerProfile | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [csvData, setCSVData] = useState<any[]>([]);
  const [csvErrors, setCSVErrors] = useState<Record<number, string>>({});
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const statusConfig = {
    invited: { label: 'Invited', color: 'bg-amber-100 text-amber-700 border-amber-300' },
    registered: { label: 'Registered', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    active: { label: 'Active', color: 'bg-green-100 text-green-700 border-green-300' }
  };

  const handleInviteSingle = () => {
    if (!inviteEmail || !validateEmail(inviteEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    onInviteSingle(inviteEmail, inviteMessage);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteMessage('');
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const row: any = { rowIndex: index };
      
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      
      return row;
    });

    // Validate
    const errors: Record<number, string> = {};
    data.forEach((row) => {
      if (!row.email || !validateEmail(row.email)) {
        errors[row.rowIndex] = `Invalid email: ${row.email}`;
      }
      if (!row.name) {
        errors[row.rowIndex] = 'Name is required';
      }
    });

    setCSVData(data);
    setCSVErrors(errors);
    setShowCSVModal(true);
  };

  const handleConfirmImport = async () => {
    if (Object.keys(csvErrors).length > 0) {
      alert('Please fix all errors before importing');
      return;
    }

    const validData = csvData.map(row => ({
      name: row.name,
      email: row.email,
      department: row.department || 'Not specified'
    }));

    // Simulate progress
    setImportProgress({ current: 0, total: validData.length });
    
    for (let i = 0; i < validData.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setImportProgress({ current: i + 1, total: validData.length });
    }

    onImportCSV(validData);
    
    // Success
    setTimeout(() => {
      setShowCSVModal(false);
      setCSVData([]);
      setCSVErrors({});
      setImportProgress(null);
    }, 1000);
  };

  const updateCSVRow = (rowIndex: number, field: string, value: string) => {
    const newData = [...csvData];
    const row = newData.find(r => r.rowIndex === rowIndex);
    if (row) {
      row[field] = value;
      
      // Revalidate
      if (field === 'email' && validateEmail(value)) {
        const newErrors = { ...csvErrors };
        delete newErrors[rowIndex];
        setCSVErrors(newErrors);
      }
    }
    setCSVData(newData);
  };

  const downloadTemplate = () => {
    const csv = 'name,email,department\nJohn Doe,john@company.com,HR\nJane Smith,jane@company.com,Finance';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'volunteer_template.csv';
    a.click();
  };

  const handleViewProfile = (volunteer: Volunteer) => {
    setSelectedVolunteer({
      id: volunteer.id,
      name: volunteer.name,
      email: volunteer.email,
      department: volunteer.department,
      status: volunteer.status,
      joinedAt: volunteer.joinedAt,
      eventsJoined: volunteer.eventsJoined
    });
    setShowProfileModal(true);
  };

  const handleEditRow = (rowIndex: number) => {
    setEditingRow(rowIndex);
  };

  const handleSaveRow = (rowIndex: number) => {
    setEditingRow(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">Volunteer Management</h1>
          <p className="text-slate-600">Invite and manage employee volunteers</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Invite Single
          </button>
          <button
            onClick={() => document.getElementById('csv-upload')?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Upload className="w-5 h-5" />
            Import CSV
          </button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Volunteer Table */}
      <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-4 px-6 text-left text-slate-700 text-sm">Name</th>
                <th className="py-4 px-6 text-left text-slate-700 text-sm">Email</th>
                <th className="py-4 px-6 text-left text-slate-700 text-sm">Department</th>
                <th className="py-4 px-6 text-left text-slate-700 text-sm">Status</th>
                <th className="py-4 px-6 text-left text-slate-700 text-sm">Events Joined</th>
                <th className="py-4 px-6 text-left text-slate-700 text-sm">Joined Date</th>
                <th className="py-4 px-6 text-left text-slate-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-slate-900">{volunteer.name}</td>
                  <td className="py-4 px-6 text-slate-600">{volunteer.email}</td>
                  <td className="py-4 px-6 text-slate-600">{volunteer.department}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full border text-xs ${statusConfig[volunteer.status].color}`}>
                      {statusConfig[volunteer.status].label}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{volunteer.eventsJoined}</td>
                  <td className="py-4 px-6 text-slate-600 text-sm">
                    {volunteer.joinedAt ? new Date(volunteer.joinedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-sm">
                    <button
                      onClick={() => handleViewProfile(volunteer)}
                      className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {volunteers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2">No volunteers yet</h3>
            <p className="text-slate-600 mb-6">Invite employees to join as volunteers</p>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Invite Volunteer
            </button>
          </div>
        )}
      </div>

      {/* Invite Single Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-8 max-w-md w-full animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900">Invite Volunteer</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="volunteer@company.com"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Personal Message (optional)</label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100 resize-none"
                  rows={3}
                  placeholder="Add a personal message..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteSingle}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Mail className="w-5 h-5" />
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-slate-900 mb-1">CSV Import Preview</h3>
                <p className="text-slate-600 text-sm">Review and fix any errors before importing</p>
              </div>
              <button 
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 rounded-lg hover:border-slate-400 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>

            {/* Progress */}
            {importProgress && (
              <div className="mb-6 p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-teal-700">Importing...</span>
                  <span className="text-teal-700">{importProgress.current} / {importProgress.total}</span>
                </div>
                <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 transition-all duration-300"
                    style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="border-2 border-slate-200 rounded-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-slate-700 text-sm">#</th>
                    <th className="py-3 px-4 text-left text-slate-700 text-sm">Name</th>
                    <th className="py-3 px-4 text-left text-slate-700 text-sm">Email</th>
                    <th className="py-3 px-4 text-left text-slate-700 text-sm">Department</th>
                    <th className="py-3 px-4 text-left text-slate-700 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map((row) => {
                    const hasError = csvErrors[row.rowIndex];
                    return (
                      <tr key={row.rowIndex} className={`border-b border-slate-200 ${hasError ? 'bg-red-50' : ''}`}>
                        <td className="py-3 px-4 text-slate-600">{row.rowIndex + 1}</td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => updateCSVRow(row.rowIndex, 'name', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="email"
                            value={row.email}
                            onChange={(e) => updateCSVRow(row.rowIndex, 'email', e.target.value)}
                            className={`w-full px-2 py-1 border rounded ${hasError ? 'border-red-500' : 'border-slate-300'}`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={row.department}
                            onChange={(e) => updateCSVRow(row.rowIndex, 'department', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          {hasError ? (
                            <div className="flex items-center gap-1 text-red-600 text-xs">
                              <AlertCircle className="w-4 h-4" />
                              {csvErrors[row.rowIndex]}
                            </div>
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {csvData.length > 10 && (
              <p className="text-slate-600 text-sm mb-6">
                Showing first 10 of {csvData.length} rows
              </p>
            )}

            {/* Summary */}
            <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-600 text-sm">Total rows:</span>
                  <span className="ml-2 text-slate-900">{csvData.length}</span>
                </div>
                <div>
                  <span className="text-slate-600 text-sm">Valid:</span>
                  <span className="ml-2 text-green-600">{csvData.length - Object.keys(csvErrors).length}</span>
                </div>
                <div>
                  <span className="text-slate-600 text-sm">Errors:</span>
                  <span className="ml-2 text-red-600">{Object.keys(csvErrors).length}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCSVModal(false);
                  setCSVData([]);
                  setCSVErrors({});
                }}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={Object.keys(csvErrors).length > 0 || importProgress !== null}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Profile Modal */}
      {showProfileModal && selectedVolunteer && (
        <VolunteerProfileModal
          isOpen={showProfileModal}
          volunteer={selectedVolunteer}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedVolunteer(null);
          }}
          onSendMessage={(id) => {
            console.log('Send message to', id);
            alert('Message sent!');
          }}
          onAssignToEvent={(id) => {
            console.log('Assign to event', id);
            alert('Volunteer assigned to event!');
          }}
        />
      )}
    </div>
  );
}