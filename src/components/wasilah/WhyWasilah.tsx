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

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

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
    <section className="py-24" style={{ backgroundColor: BRAND.cream }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
            >
              <span className="font-medium">Why Choose Us</span>
            </div>
            
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-6 leading-tight"
              style={{ color: BRAND.navy }}
            >
              The CSR Partner That Does<br />
              <span style={{ color: BRAND.teal }}>All the Heavy Lifting</span>
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
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
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
                  >
                    {value.icon}
                  </div>
                  <p className="pt-2 font-medium" style={{ color: BRAND.navy }}>
                    {value.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button 
                className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
                style={{ backgroundColor: BRAND.navy }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.teal;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.navy;
                }}
              >
                Learn More About Our Approach
              </button>
            </div>
          </div>

          {/* Right Column - Impact Visual */}
          <div className="relative">
            {/* Main Dashboard Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1" style={{ color: BRAND.navy }}>Impact Metrics</h3>
                  <p className="text-gray-500">Real-time CSR performance</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: BRAND.navy }}
                >
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div 
                  className="rounded-xl p-5 border"
                  style={{ backgroundColor: `${BRAND.teal}10`, borderColor: `${BRAND.teal}30` }}
                >
                  <div className="text-sm mb-2" style={{ color: BRAND.teal }}>Compliance Score</div>
                  <div className="text-2xl font-bold" style={{ color: BRAND.navy }}>100%</div>
                </div>
                <div 
                  className="rounded-xl p-5 border"
                  style={{ backgroundColor: `${BRAND.navy}08`, borderColor: `${BRAND.navy}20` }}
                >
                  <div className="text-sm mb-2" style={{ color: BRAND.navy }}>Impact Rating</div>
                  <div className="text-2xl font-bold" style={{ color: BRAND.navy }}>9.4/10</div>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-600 mb-2">
                  <span>Project Success Rate</span>
                  <span className="font-semibold" style={{ color: BRAND.navy }}>98%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full w-[98%] rounded-full"
                    style={{ background: `linear-gradient(90deg, ${BRAND.navy}, ${BRAND.teal})` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-gray-600 mb-2 mt-6">
                  <span>Stakeholder Satisfaction</span>
                  <span className="font-semibold" style={{ color: BRAND.navy }}>96%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full w-[96%] rounded-full"
                    style={{ backgroundColor: BRAND.teal }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-gray-600 mb-2 mt-6">
                  <span>On-Time Delivery</span>
                  <span className="font-semibold" style={{ color: BRAND.navy }}>94%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full w-[94%] rounded-full"
                    style={{ backgroundColor: BRAND.navy }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-44 hidden lg:block">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${BRAND.teal}15` }}
                >
                  <Target className="w-5 h-5" style={{ color: BRAND.teal }} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: BRAND.navy }}>SDG Aligned</div>
                </div>
              </div>
              <div className="font-bold" style={{ color: BRAND.teal }}>17/17 Goals</div>
            </div>

            {/* Background Decorative */}
            <div 
              className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: BRAND.teal }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
