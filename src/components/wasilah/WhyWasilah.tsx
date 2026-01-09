import React from 'react';
import { 
  CheckCircle, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap, 
  FileCheck,
  BarChart3,
  Target
} from 'lucide-react';

export function WhyWasilah() {
  const values = [
    {
      icon: <FileCheck className="w-5 h-5" />,
      text: 'Fully SECP-compliant documentation'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: 'Verified NGO ecosystem'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: 'Transparent reporting & budgeting'
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: 'Strong student volunteer networks'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: 'Fast execution, zero hassle'
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: 'Audit-ready reporting'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 mb-6">
              <span>Why Choose Us</span>
            </div>
            
            <h2 className="text-slate-900 mb-6 leading-tight">
              The CSR Partner That Does<br />
              <span className="text-blue-600">All the Heavy Lifting</span>
            </h2>
            
            <p className="text-slate-600 mb-8 leading-relaxed">
              Wasilah combines operational excellence with deep CSR expertise to deliver 
              measurable impact while ensuring full compliance and transparency.
            </p>

            {/* Value Points */}
            <div className="space-y-4">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                    {value.icon}
                  </div>
                  <p className="text-slate-700 pt-2">
                    {value.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
                Learn More About Our Approach
              </button>
            </div>
          </div>

          {/* Right Column - Impact Visual */}
          <div className="relative">
            {/* Main Dashboard Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-slate-900 mb-1">Impact Metrics</h3>
                  <p className="text-slate-500">Real-time CSR performance</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div className="text-blue-600 mb-2">Compliance Score</div>
                  <div className="text-blue-900">100%</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
                  <div className="text-emerald-600 mb-2">Impact Rating</div>
                  <div className="text-emerald-900">9.4/10</div>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-slate-600 mb-2">
                  <span>Project Success Rate</span>
                  <span className="text-slate-900">98%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-600 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between text-slate-600 mb-2 mt-6">
                  <span>Stakeholder Satisfaction</span>
                  <span className="text-slate-900">96%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[96%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between text-slate-600 mb-2 mt-6">
                  <span>On-Time Delivery</span>
                  <span className="text-slate-900">94%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-44 hidden lg:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-slate-900">SDG Aligned</div>
                </div>
              </div>
              <div className="text-emerald-600">17/17 Goals</div>
            </div>

            {/* Background Decorative */}
            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
