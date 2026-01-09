import React from 'react';
import { Users, Target, Calendar, TrendingUp, Building2 } from 'lucide-react';

export function ImpactDashboard() {
  const sdgData = [
    { sdg: 'SDG 4', percentage: 35, color: 'text-red-600' },
    { sdg: 'SDG 3', percentage: 25, color: 'text-green-600' },
    { sdg: 'SDG 13', percentage: 20, color: 'text-emerald-600' },
    { sdg: 'SDG 8', percentage: 20, color: 'text-blue-600' }
  ];

  const recentProjects = [
    { title: 'Digital Literacy Program', status: 'Completed', impact: '1,200 students' },
    { title: 'Tree Plantation Drive', status: 'In Progress', impact: '15,000 trees' },
    { title: 'Women Empowerment', status: 'Completed', impact: '250 beneficiaries' }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Real-Time Insights</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Corporate Impact Dashboard
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Track your CSR performance with real-time metrics, SDG alignment, and comprehensive impact data
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-200">
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg mb-1">CSR Impact Dashboard</h3>
                <p className="text-blue-100 text-sm">Q4 2024 Performance Overview</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm hover:bg-white/30 transition-all">
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-8 bg-white">
            {/* Top Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-blue-600 text-sm">Volunteers</span>
                </div>
                <div className="text-slate-900 text-3xl mb-1">2,450</div>
                <div className="text-slate-600 text-xs">Total deployed</div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border-2 border-emerald-200">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-emerald-600" />
                  <span className="text-emerald-600 text-sm">Beneficiaries</span>
                </div>
                <div className="text-slate-900 text-3xl mb-1">85,400</div>
                <div className="text-slate-600 text-xs">Lives impacted</div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 border-2 border-violet-200">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-6 h-6 text-violet-600" />
                  <span className="text-violet-600 text-sm">Events</span>
                </div>
                <div className="text-slate-900 text-3xl mb-1">18</div>
                <div className="text-slate-600 text-xs">Successfully executed</div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border-2 border-teal-200">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-6 h-6 text-teal-600" />
                  <span className="text-teal-600 text-sm">NGO Partners</span>
                </div>
                <div className="text-slate-900 text-3xl mb-1">12</div>
                <div className="text-slate-600 text-xs">Active partnerships</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* SDG Alignment */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h4 className="text-slate-900 mb-4">SDG Alignment</h4>
                <div className="space-y-4">
                  {sdgData.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${item.color}`}>{item.sdg}</span>
                        <span className="text-slate-700">{item.percentage}%</span>
                      </div>
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color.replace('text-', 'bg-')} rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h4 className="text-slate-900 mb-4">Recent Projects</h4>
                <div className="space-y-3">
                  {recentProjects.map((project, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-900 text-sm">{project.title}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          project.status === 'Completed' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="text-slate-600 text-xs">{project.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
