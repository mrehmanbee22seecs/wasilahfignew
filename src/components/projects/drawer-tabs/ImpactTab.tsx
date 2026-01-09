import React, { useState } from 'react';
import { 
  TrendingUp, Users, Clock, Target, FileText, Download,
  Calendar, CheckCircle, Globe, Heart, Sparkles, Table, BarChart3, Loader2, Mail
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GenerateReportModal } from '../modals/GenerateReportModal';

interface ImpactTabProps {
  projectId: string;
}

interface GeneratingReport {
  id: string;
  title: string;
  type: string;
  status: 'generating' | 'ready' | 'failed';
  progress: number;
  startedAt: string;
  emailOnReady: boolean;
}

// Mock data
const BENEFICIARIES_TREND = [
  { month: 'Week 1', count: 0 },
  { month: 'Week 2', count: 120 },
  { month: 'Week 3', count: 285 },
  { month: 'Week 4', count: 450 }
];

const ACTIVITY_BREAKDOWN = [
  { name: 'Cleanup Activities', value: 45, color: '#14b8a6' },
  { name: 'Awareness Sessions', value: 25, color: '#3b82f6' },
  { name: 'Training Workshops', value: 20, color: '#8b5cf6' },
  { name: 'Community Events', value: 10, color: '#f59e0b' }
];

const VOLUNTEER_HOURS = [
  { month: 'Jan', hours: 0 },
  { month: 'Feb Week 1', hours: 64 },
  { month: 'Feb Week 2', hours: 142 },
  { month: 'Feb Week 3', hours: 218 }
];

const GENERATED_REPORTS: GeneratingReport[] = [
  {
    id: 'rep_1',
    title: 'Mid-Project Impact Report',
    type: 'Full Report',
    status: 'ready',
    progress: 100,
    startedAt: '2026-02-12T10:30:00Z',
    emailOnReady: false
  },
  {
    id: 'rep_2',
    title: 'Weekly Summary - Week 2',
    type: 'Short Summary',
    status: 'ready',
    progress: 100,
    startedAt: '2026-02-08T14:15:00Z',
    emailOnReady: false
  }
];

export function ImpactTab({ projectId }: ImpactTabProps) {
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [showBeneficiariesTable, setShowBeneficiariesTable] = useState(false);
  const [showActivityTable, setShowActivityTable] = useState(false);
  const [showVolunteerHoursTable, setShowVolunteerHoursTable] = useState(false);
  const [generatingReports, setGeneratingReports] = useState<GeneratingReport[]>([]);
  const [previousReports, setPreviousReports] = useState<GeneratingReport[]>(GENERATED_REPORTS);

  // Poll for generating reports
  React.useEffect(() => {
    if (generatingReports.length === 0) return;

    const interval = setInterval(() => {
      setGeneratingReports(prev => prev.map(report => {
        if (report.status === 'generating') {
          const newProgress = Math.min(report.progress + 10, 100);
          
          if (newProgress >= 100) {
            // Report is ready
            const readyReport = { ...report, status: 'ready' as const, progress: 100 };
            
            // Move to previous reports
            setPreviousReports(prevReports => [readyReport, ...prevReports]);
            
            // Show notification if email enabled
            if (report.emailOnReady) {
              // In production, backend would send email
              console.log(`Email notification sent for: ${report.title}`);
            }
            
            return null; // Will be filtered out
          }
          
          return { ...report, progress: newProgress };
        }
        return report;
      }).filter(Boolean) as GeneratingReport[]);
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, [generatingReports]);

  const handleGenerateReport = (title: string, type: string, emailOnReady: boolean) => {
    const newReport: GeneratingReport = {
      id: `rep_${Date.now()}`,
      title,
      type,
      status: 'generating',
      progress: 0,
      startedAt: new Date().toISOString(),
      emailOnReady
    };
    
    setGeneratingReports(prev => [...prev, newReport]);
    setGenerateModalOpen(false);
  };

  const kpis = {
    beneficiariesReached: 450,
    beneficiariesTarget: 500,
    hoursContributed: 218,
    hoursTarget: 300,
    improvementPercent: 67,
    activitiesCompleted: 8,
    activitiesTotal: 12
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const CustomLineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border-2 border-slate-200 rounded-lg shadow-lg">
          <p className="text-sm text-slate-900 mb-1">{payload[0].payload.month}</p>
          <p className="text-xs text-teal-600">
            Beneficiaries: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border-2 border-slate-200 rounded-lg shadow-lg">
          <p className="text-sm text-slate-900 mb-1">{payload[0].payload.month}</p>
          <p className="text-xs text-blue-600">
            Hours: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Key Impact Metrics */}
      <div>
        <h3 className="text-sm text-slate-700 mb-3">Key Impact Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Beneficiaries */}
          <div className="p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border-2 border-teal-100">
            <div className="flex items-center gap-2 text-teal-700 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs">Beneficiaries Reached</span>
            </div>
            <p className="text-3xl text-slate-900 mb-1">
              {kpis.beneficiariesReached}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Target: {kpis.beneficiariesTarget}</span>
              <span className="text-xs text-green-600">
                {Math.round((kpis.beneficiariesReached / kpis.beneficiariesTarget) * 100)}%
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500"
                style={{ width: `${(kpis.beneficiariesReached / kpis.beneficiariesTarget) * 100}%` }}
              />
            </div>
          </div>

          {/* Volunteer Hours */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Hours Contributed</span>
            </div>
            <p className="text-3xl text-slate-900 mb-1">
              {kpis.hoursContributed}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Target: {kpis.hoursTarget}</span>
              <span className="text-xs text-green-600">
                {Math.round((kpis.hoursContributed / kpis.hoursTarget) * 100)}%
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(kpis.hoursContributed / kpis.hoursTarget) * 100}%` }}
              />
            </div>
          </div>

          {/* Improvement */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Impact Score</span>
            </div>
            <p className="text-3xl text-slate-900 mb-1">
              {kpis.improvementPercent}%
            </p>
            <p className="text-xs text-slate-600">Positive community feedback</p>
          </div>

          {/* Activities */}
          <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-100">
            <div className="flex items-center gap-2 text-orange-700 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Activities Completed</span>
            </div>
            <p className="text-3xl text-slate-900 mb-1">
              {kpis.activitiesCompleted}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Total: {kpis.activitiesTotal}</span>
              <span className="text-xs text-green-600">
                {Math.round((kpis.activitiesCompleted / kpis.activitiesTotal) * 100)}%
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                style={{ width: `${(kpis.activitiesCompleted / kpis.activitiesTotal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Beneficiaries Trend Chart */}
      <div>
        <h3 className="text-sm text-slate-700 mb-3">Beneficiaries Reached Over Time</h3>
        <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={BENEFICIARIES_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#14b8a6" 
                strokeWidth={3}
                dot={{ fill: '#14b8a6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <button
          onClick={() => setShowBeneficiariesTable(!showBeneficiariesTable)}
          className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          {showBeneficiariesTable ? 'Hide Table' : 'Show Table'}
        </button>
        {showBeneficiariesTable && (
          <div className="mt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-slate-100 text-left text-xs font-bold">Month</th>
                  <th className="px-4 py-2 bg-slate-100 text-left text-xs font-bold">Beneficiaries</th>
                </tr>
              </thead>
              <tbody>
                {BENEFICIARIES_TREND.map((data, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-2 text-xs text-slate-700">{data.month}</td>
                    <td className="px-4 py-2 text-xs text-slate-700">{data.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Activity Breakdown & Volunteer Hours */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Activity Breakdown Pie Chart */}
        <div>
          <h3 className="text-sm text-slate-700 mb-3">Activity Type Breakdown</h3>
          <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ACTIVITY_BREAKDOWN}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {ACTIVITY_BREAKDOWN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 mt-3">
              {ACTIVITY_BREAKDOWN.map(activity => (
                <div key={activity.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activity.color }}
                    />
                    <span className="text-slate-700">{activity.name}</span>
                  </div>
                  <span className="text-slate-600">{activity.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowActivityTable(!showActivityTable)}
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            {showActivityTable ? 'Hide Table' : 'Show Table'}
          </button>
          {showActivityTable && (
            <div className="mt-2">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-slate-100 text-left text-xs font-bold">Activity Type</th>
                    <th className="px-4 py-2 bg-slate-100 text-left text-xs font-bold">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {ACTIVITY_BREAKDOWN.map((data, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-4 py-2 text-xs text-slate-700">{data.name}</td>
                      <td className="px-4 py-2 text-xs text-slate-700">{data.value}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Volunteer Hours Trend */}
        <div>
          <h3 className="text-sm text-slate-700 mb-3">Volunteer Hours Trend</h3>
          <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={VOLUNTEER_HOURS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <button
            onClick={() => setShowVolunteerHoursTable(!showVolunteerHoursTable)}
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            {showVolunteerHoursTable ? 'Hide Table' : 'Show Table'}
          </button>
          {showVolunteerHoursTable && (
            <div className="mt-2">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-slate-100 text-left text-xs font-bold">Month</th>
                    <th className="px-4 py-2 bg-slate-100 text-left text-xs font-bold">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {VOLUNTEER_HOURS.map((data, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-4 py-2 text-xs text-slate-700">{data.month}</td>
                      <td className="px-4 py-2 text-xs text-slate-700">{data.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Impact Highlights */}
      <div>
        <h3 className="text-sm text-slate-700 mb-3">Impact Highlights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-slate-900 mb-1">Environmental Impact</h4>
              <p className="text-xs text-slate-600">
                Collected 2.8 tons of waste from Clifton beach area, preventing ocean pollution and improving coastal ecosystem health.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-slate-900 mb-1">Community Engagement</h4>
              <p className="text-xs text-slate-600">
                Trained 120+ volunteers in environmental awareness, with 87% reporting increased commitment to sustainability.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-slate-900 mb-1">Skills Development</h4>
              <p className="text-xs text-slate-600">
                Provided hands-on experience in project management, teamwork, and community organizing to student volunteers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report CTA */}
      <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 text-center">
        <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
        <h4 className="text-slate-900 mb-2">Ready to Share Your Impact?</h4>
        <p className="text-sm text-slate-600 mb-4">
          Generate a comprehensive impact report with charts, photos, and metrics for stakeholders.
        </p>
        <button
          onClick={() => setGenerateModalOpen(true)}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          Generate Impact Report
        </button>
      </div>

      {/* Generating Reports (Polling) */}
      {generatingReports.length > 0 && (
        <div>
          <h3 className="text-sm text-slate-700 mb-3">Generating Reports</h3>
          <div className="space-y-2">
            {generatingReports.map(report => (
              <div 
                key={report.id}
                className="p-4 bg-white border-2 border-blue-200 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <div>
                      <p className="text-sm text-slate-900">{report.title}</p>
                      <p className="text-xs text-slate-600">
                        {report.type} • Started {formatDate(report.startedAt)}
                        {report.emailOnReady && (
                          <>
                            {' • '}
                            <span className="inline-flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              Email on ready
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-600">{report.progress}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${report.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previously Generated Reports */}
      {previousReports.length > 0 && (
        <div>
          <h3 className="text-sm text-slate-700 mb-3">Previously Generated Reports</h3>
          <div className="space-y-2">
            {previousReports.map(report => (
              <div 
                key={report.id}
                className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-900">{report.title}</p>
                    <p className="text-xs text-slate-600">
                      {report.type} • {formatDate(report.startedAt)} • {report.status === 'ready' ? 'Ready' : 'Generating'}
                    </p>
                  </div>
                </div>
                {report.status === 'ready' && (
                  <button className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
                {report.status === 'generating' && (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        projectId={projectId}
        onGenerate={handleGenerateReport}
      />
    </div>
  );
}