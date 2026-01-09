import React from 'react';
import { Briefcase, Users, BarChart3, Award, MessageSquare, Layout } from 'lucide-react';

export function DashboardFeatures() {
  const features = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Opportunity Management',
      description: 'Browse and apply to corporate CSR projects matched to your mission'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Volunteers List & Attendance',
      description: 'Track volunteer assignments, attendance, and performance ratings'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Impact Reporting Tools',
      description: 'Generate comprehensive reports with metrics, photos, and testimonials'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Certificate Issuance Support',
      description: 'Issue verified certificates to volunteers and document achievements'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Communication Center',
      description: 'Direct chat with Wasilah operations team and corporate partners'
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: 'Project Dashboard',
      description: 'Real-time tracking of active projects, milestones, and deliverables'
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            NGO Tools & Dashboard Features
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Powerful tools to manage partnerships, volunteers, and impact reporting seamlessly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Dashboard Mockup */}
          <div>
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">NGO Dashboard</h3>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Layout className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-blue-100 text-sm">Welcome back, Partner NGO</p>
              </div>

              {/* Stats Cards */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="text-blue-600 text-sm mb-1">Active Projects</div>
                    <div className="text-blue-900 text-2xl">8</div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <div className="text-emerald-600 text-sm mb-1">Volunteers</div>
                    <div className="text-emerald-900 text-2xl">124</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-3">
                  <div className="text-slate-700 mb-3">Recent Activity</div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-900 text-sm">New Opportunity</div>
                      <div className="text-slate-500 text-xs">Tree Plantation Drive</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-900 text-sm">Volunteers Assigned</div>
                      <div className="text-slate-500 text-xs">45 students confirmed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-900 text-sm">Report Submitted</div>
                      <div className="text-slate-500 text-xs">Health Camp Project</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Features List */}
          <div>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-violet-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-slate-900 mb-2">{feature.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
