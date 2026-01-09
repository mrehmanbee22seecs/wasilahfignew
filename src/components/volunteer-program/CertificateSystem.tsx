import React from 'react';
import { Award, CheckCircle, TrendingUp } from 'lucide-react';

export function CertificateSystem() {
  const badges = [
    {
      icon: '🥉',
      title: 'Bronze Helper',
      description: '1-3 completed activities',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: '🥈',
      title: 'Silver Leader',
      description: '4-7 completed activities',
      color: 'from-slate-400 to-slate-600'
    },
    {
      icon: '🥇',
      title: 'Gold Mentor',
      description: '8+ completed activities',
      color: 'from-yellow-500 to-amber-600'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-4">
            <Award className="w-4 h-4" />
            <span>Recognition System</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Certificate & Achievement System
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Each completed activity earns you verified experience—ideal for CV, LinkedIn, and corporate interviews
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Certificate Mockup */}
          <div>
            {/* Certificate Card */}
            <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl p-8 border-4 border-teal-200 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-slate-900 mb-2">Certificate of Achievement</h3>
                <div className="text-teal-600 text-sm">Verified by Wasilah CSR Platform</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-teal-200 mb-6">
                <div className="text-center mb-4">
                  <div className="text-slate-600 text-sm mb-2">This certifies that</div>
                  <div className="text-slate-900 text-lg">Student Name</div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-slate-600 text-sm mb-2">has successfully completed</div>
                  <div className="text-teal-700">Clean Water Awareness Campaign</div>
                  <div className="text-slate-500 text-sm mt-2">Engro Corporation × Water.org</div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200 text-sm">
                  <div>
                    <div className="text-slate-500">Date</div>
                    <div className="text-slate-700">Jan 15, 2025</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Hours</div>
                    <div className="text-slate-700">24 hrs</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Cert ID</div>
                    <div className="text-slate-700">W-2025-001</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-teal-600 text-sm">
                <CheckCircle className="w-5 h-5" />
                <span>Blockchain Verified</span>
              </div>
            </div>
          </div>

          {/* Right - Badge System */}
          <div>
            <h3 className="text-slate-900 mb-6">Digital Badge System</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Progress through achievement levels as you complete more CSR activities. 
              Each badge is recognized by employers and showcases your commitment to social impact.
            </p>

            <div className="space-y-6 mb-8">
              {badges.map((badge, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                      {badge.icon}
                    </div>
                    <div>
                      <div className="text-slate-900 mb-1">{badge.title}</div>
                      <div className="text-slate-600 text-sm">{badge.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Milestone UI */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-200">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-teal-600" />
                <div>
                  <div className="text-slate-900">Your Progress</div>
                  <div className="text-slate-600 text-sm">5 activities completed</div>
                </div>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden">
                <div className="h-full w-[62%] bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full"></div>
              </div>
              <div className="text-slate-600 text-sm mt-2">3 more to reach Gold Mentor level</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
