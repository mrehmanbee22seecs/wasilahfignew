import React from 'react';
import { 
  Building2, 
  Heart, 
  Users, 
  BarChart3, 
  FileText, 
  Calendar,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Award,
  Target,
  Briefcase
} from 'lucide-react';

interface RolePreviewPanelProps {
  selectedRole: 'corporate' | 'ngo' | 'volunteer' | null;
}

export function RolePreviewPanel({ selectedRole }: RolePreviewPanelProps) {
  if (!selectedRole) {
    return (
      <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Target className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Select a role to preview
          </h3>
          <p className="text-slate-600 text-sm">
            See what your dashboard will look like and what features you'll have access to
          </p>
        </div>
      </div>
    );
  }

  const previews = {
    corporate: {
      title: 'Corporate Dashboard Preview',
      description: 'Manage CSR initiatives, track impact, and connect with NGOs',
      color: 'from-blue-600 to-teal-600',
      icon: Building2,
      features: [
        { icon: BarChart3, label: 'Impact Analytics', desc: 'Real-time CSR metrics' },
        { icon: Users, label: 'NGO Partnerships', desc: 'Vetted organizations' },
        { icon: Calendar, label: 'Events & Campaigns', desc: 'Employee volunteering' },
        { icon: FileText, label: 'Compliance Reports', desc: 'ESG & SDG tracking' },
      ],
      screenshot: (
        <div className="bg-white rounded-lg shadow-xl p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg"></div>
              <div>
                <div className="h-2 w-24 bg-slate-300 rounded"></div>
                <div className="h-2 w-16 bg-slate-200 rounded mt-1"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded"></div>
              <div className="w-8 h-8 bg-slate-100 rounded"></div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 border border-slate-200">
                <div className="h-2 w-12 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 w-16 bg-blue-600 rounded mb-1"></div>
                <div className="h-1.5 w-10 bg-green-500 rounded"></div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 border border-slate-200">
            <div className="h-2 w-20 bg-slate-300 rounded mb-3"></div>
            <div className="flex items-end gap-1 h-20">
              {[40, 65, 45, 80, 55, 70, 85, 60].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-600 to-teal-500 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 rounded"></div>
                <div className="flex-1">
                  <div className="h-2 w-32 bg-slate-300 rounded mb-1"></div>
                  <div className="h-1.5 w-24 bg-slate-200 rounded"></div>
                </div>
                <div className="w-16 h-6 bg-green-100 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      ),
      benefits: [
        'Track ESG & SDG alignment',
        'Employee engagement tools',
        'Compliance reporting',
        'Partnership management',
      ],
    },
    ngo: {
      title: 'NGO Dashboard Preview',
      description: 'Manage projects, showcase impact, and connect with corporates',
      color: 'from-emerald-600 to-teal-600',
      icon: Heart,
      features: [
        { icon: CheckCircle2, label: 'Verification Status', desc: 'Build credibility' },
        { icon: Briefcase, label: 'Project Management', desc: 'Track deliverables' },
        { icon: TrendingUp, label: 'Impact Metrics', desc: 'Showcase results' },
        { icon: MessageSquare, label: 'Corporate Outreach', desc: 'Find partnerships' },
      ],
      screenshot: (
        <div className="bg-white rounded-lg shadow-xl p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg"></div>
              <div>
                <div className="h-2 w-24 bg-slate-300 rounded"></div>
                <div className="h-2 w-16 bg-slate-200 rounded mt-1"></div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <div className="h-1.5 w-12 bg-green-600 rounded"></div>
            </div>
          </div>

          {/* Verification Progress */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-200">
            <div className="h-2 w-28 bg-emerald-700 rounded mb-2"></div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded ${
                    i <= 3 ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                ></div>
              ))}
            </div>
            <div className="h-1.5 w-20 bg-slate-300 rounded"></div>
          </div>

          {/* Active Projects */}
          <div className="space-y-2">
            <div className="h-2 w-24 bg-slate-300 rounded"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded"></div>
                <div className="flex-1">
                  <div className="h-2 w-28 bg-slate-300 rounded mb-1"></div>
                  <div className="h-1.5 w-20 bg-slate-200 rounded"></div>
                </div>
                <div className="text-right">
                  <div className="h-1.5 w-12 bg-emerald-600 rounded mb-1"></div>
                  <div className="h-1.5 w-8 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg p-2 text-center">
                <div className="h-3 w-12 bg-emerald-600 rounded mx-auto mb-1"></div>
                <div className="h-1.5 w-16 bg-slate-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      ),
      benefits: [
        'Get verified & build trust',
        'Access corporate funding',
        'Showcase your impact',
        'Manage volunteers',
      ],
    },
    volunteer: {
      title: 'Volunteer Dashboard Preview',
      description: 'Discover opportunities, track hours, and earn certificates',
      color: 'from-purple-600 to-pink-600',
      icon: Users,
      features: [
        { icon: Target, label: 'Find Opportunities', desc: 'Match your skills' },
        { icon: Calendar, label: 'Schedule Activities', desc: 'Track commitments' },
        { icon: Award, label: 'Earn Certificates', desc: 'Build your portfolio' },
        { icon: TrendingUp, label: 'Track Impact', desc: 'See your contribution' },
      ],
      screenshot: (
        <div className="bg-white rounded-lg shadow-xl p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <div>
                <div className="h-2 w-24 bg-slate-300 rounded"></div>
                <div className="h-2 w-16 bg-slate-200 rounded mt-1"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full"></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Hours', value: '48', color: 'purple' },
              { label: 'Projects', value: '12', color: 'pink' },
              { label: 'Certs', value: '5', color: 'purple' },
            ].map((stat, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-2 border border-slate-200 text-center">
                <div className={`h-3 w-10 bg-${stat.color}-600 rounded mx-auto mb-1`}></div>
                <div className="h-1.5 w-12 bg-slate-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>

          {/* Available Opportunities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-2 w-32 bg-slate-300 rounded"></div>
              <div className="h-1.5 w-12 bg-purple-600 rounded"></div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="h-2 w-32 bg-purple-700 rounded mb-1"></div>
                    <div className="h-1.5 w-24 bg-slate-300 rounded"></div>
                  </div>
                  <div className="w-16 h-5 bg-purple-600 rounded-full"></div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 w-12 bg-white/60 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-2">
            <div className="h-2 w-20 bg-slate-300 rounded mb-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded"></div>
              <div className="flex-1">
                <div className="h-2 w-28 bg-slate-300 rounded mb-1"></div>
                <div className="h-1.5 w-20 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ),
      benefits: [
        'Flexible scheduling',
        'Skill-based matching',
        'Earn certificates',
        'Track your impact',
      ],
    },
  };

  const preview = previews[selectedRole];
  const Icon = preview.icon;

  return (
    <div className="hidden lg:block">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${preview.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900 mb-1">
              {preview.title}
            </h3>
            <p className="text-slate-600 text-sm">
              {preview.description}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          {preview.features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div className={`w-8 h-8 bg-gradient-to-r ${preview.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <FeatureIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {feature.label}
                    </h4>
                    <p className="text-xs text-slate-600 truncate">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Screenshot Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              Dashboard Preview
            </h4>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              Live Preview
            </span>
          </div>
          <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl p-4 border-2 border-slate-200">
            {preview.screenshot}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200">
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            What you'll get:
          </h4>
          <ul className="space-y-2">
            {preview.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-slate-700">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${preview.color}`}></div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className={`bg-gradient-to-r ${preview.color} rounded-xl p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1">Ready to get started?</p>
              <p className="text-xs text-white/80">
                Complete your profile in the next step
              </p>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
