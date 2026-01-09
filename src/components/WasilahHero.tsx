import React from 'react';
import { 
  CheckCircle, 
  Users, 
  FileCheck, 
  Network,
  ArrowRight,
  Calendar,
  Target,
  TrendingUp,
  Globe,
  Building2
} from 'lucide-react';

export function WasilahHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <span className="text-slate-900 tracking-tight">Wasilah</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#services" className="text-slate-700 hover:text-blue-600 transition-colors">
                Services
              </a>
              <a href="#sdg" className="text-slate-700 hover:text-blue-600 transition-colors">
                SDG Alignment
              </a>
              <a href="#impact" className="text-slate-700 hover:text-blue-600 transition-colors">
                Impact Engine
              </a>
              <a href="#corporate" className="text-slate-700 hover:text-blue-600 transition-colors">
                Corporate Programs
              </a>
              <a href="#universities" className="text-slate-700 hover:text-blue-600 transition-colors">
                For Universities
              </a>
              <a href="#about" className="text-slate-700 hover:text-blue-600 transition-colors">
                About Us
              </a>
              <a href="#contact" className="text-slate-700 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </div>

            {/* CTA Button */}
            <button className="hidden lg:flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
              <Calendar className="w-4 h-4" />
              Book a Consultation
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700">
              <CheckCircle className="w-4 h-4" />
              <span>Trusted by Pakistan's Leading Corporates</span>
            </div>

            {/* Headline */}
            <h1 className="text-slate-900 leading-tight">
              Pakistan's First<br />
              <span className="text-blue-600">CSR Operations Partner</span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 max-w-xl leading-relaxed">
              Wasilah helps companies design, execute, and document CSR initiatives with full compliance, 
              transparency, and real measurable impact. We build bridges between corporates, NGOs, and 
              real student-driven volunteer ecosystems.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
                Schedule Strategy Call
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all bg-white">
                Explore Services
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-slate-900">SDG Aligned</div>
                  <div className="text-slate-500">UN Goals Integration</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-slate-900">SECP-Compliant</div>
                  <div className="text-slate-500">CSR Reporting</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <div className="text-slate-900">Verified NGO Network</div>
                  <div className="text-slate-500">Pre-vetted Partners</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <div className="text-slate-900">Volunteer Ecosystem</div>
                  <div className="text-slate-500">Student-Driven Impact</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Main Dashboard Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-slate-900 mb-1">CSR Impact Dashboard</div>
                  <div className="text-slate-500">Real-time metrics & compliance</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="text-blue-600 mb-1">Active Projects</div>
                  <div className="text-blue-900">24</div>
                  <div className="text-blue-500 mt-2">+12% this quarter</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <div className="text-emerald-600 mb-1">Lives Impacted</div>
                  <div className="text-emerald-900">45,280</div>
                  <div className="text-emerald-500 mt-2">Across 8 provinces</div>
                </div>
                <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                  <div className="text-violet-600 mb-1">SDG Goals</div>
                  <div className="text-violet-900">12/17</div>
                  <div className="text-violet-500 mt-2">Actively tracked</div>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                  <div className="text-cyan-600 mb-1">Volunteers</div>
                  <div className="text-cyan-900">1,240</div>
                  <div className="text-cyan-500 mt-2">Student network</div>
                </div>
              </div>

              {/* SDG Progress Bars */}
              <div className="space-y-4">
                <div className="text-slate-700 mb-3">SDG Alignment Progress</div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Quality Education</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Zero Hunger</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Clean Water</span>
                    <span>78%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-48 hidden xl:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-slate-500">Corporate</div>
                  <div className="text-slate-900">Partners</div>
                </div>
              </div>
              <div className="mt-3 flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-violet-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-cyan-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                  +12
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-56 hidden xl:block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-slate-900">NGO Network</div>
                  <div className="text-slate-500">Verified Partners</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-emerald-900">156</div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">Active</div>
              </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -z-10 top-20 right-0 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -z-10 bottom-20 left-0 w-72 h-72 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Subtle Stats Bar */}
      <div className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-slate-900 mb-1">PKR 2.4B+</div>
              <div className="text-slate-500">CSR Deployed</div>
            </div>
            <div>
              <div className="text-slate-900 mb-1">50+</div>
              <div className="text-slate-500">Corporate Clients</div>
            </div>
            <div>
              <div className="text-slate-900 mb-1">200+</div>
              <div className="text-slate-500">Projects Delivered</div>
            </div>
            <div>
              <div className="text-slate-900 mb-1">100%</div>
              <div className="text-slate-500">Compliance Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
