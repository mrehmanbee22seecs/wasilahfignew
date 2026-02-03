import React from 'react';
import { Users, Target, Heart, Globe, Award, Briefcase, ArrowLeft, CheckCircle } from 'lucide-react';
import { BRAND } from '../../constants/brand';

interface AboutPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function AboutPage({ onBack, onNavigate }: AboutPageProps) {
  const stats = [
    { value: '5,240+', label: 'Volunteers Engaged' },
    { value: '180+', label: 'NGO Partners' },
    { value: '48', label: 'Active Projects' },
    { value: '45,000+', label: 'CSR Hours Delivered' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Impact First',
      description: 'Every decision we make is guided by the question: "Will this create real, measurable impact for the communities we serve?"'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We believe the best outcomes happen when corporates, NGOs, and volunteers work together towards shared goals.'
    },
    {
      icon: Target,
      title: 'Transparency',
      description: 'We maintain complete transparency in our operations, impact metrics, and financial transactions.'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'We design programs that create lasting change, not just one-time events.'
    }
  ];

  const milestones = [
    { year: '2022', title: 'Founded', description: 'Wasilah was founded with a vision to transform CSR in Pakistan' },
    { year: '2023', title: 'First 100 Volunteers', description: 'Reached our first milestone of 100 active volunteers' },
    { year: '2024', title: 'NGO Network', description: 'Expanded to partner with 100+ verified NGOs across Pakistan' },
    { year: '2025', title: 'Corporate Partnerships', description: 'Partnered with Pakistan\'s leading corporations for CSR initiatives' },
    { year: '2026', title: '5,000+ Volunteers', description: 'Grew our volunteer base to over 5,000 skilled individuals' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: BRAND.creamLight }}>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors"
            style={{ color: BRAND.navy }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        )}

        <div className="text-center max-w-3xl mx-auto">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <Globe className="w-4 h-4" />
            About Wasilah
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.navy }}>
            Building Bridges for
            <span style={{ color: BRAND.teal }}> Social Impact</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: BRAND.gray600 }}>
            Wasilah (وصلہ) means "connection" in Urdu. We are Pakistan's premier CSR platform, 
            connecting corporations with skilled student volunteers and verified NGOs to create 
            meaningful, measurable social impact.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-12 mb-16"
        style={{ backgroundColor: BRAND.navy }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: BRAND.navy }}>
              Our Mission
            </h2>
            <p className="text-lg mb-6 leading-relaxed" style={{ color: BRAND.gray600 }}>
              To revolutionize corporate social responsibility in Pakistan by creating a seamless 
              ecosystem where businesses can engage meaningfully with social causes, students can 
              gain valuable experience while giving back, and NGOs can access the resources they 
              need to maximize their impact.
            </p>
            <div className="space-y-4">
              {[
                'Connect corporates with verified NGOs for impactful CSR initiatives',
                'Provide students with meaningful volunteer opportunities',
                'Ensure transparency and measurable outcomes for all stakeholders',
                'Build a culture of giving back in Pakistan\'s corporate sector'
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.teal }} />
                  <span style={{ color: BRAND.gray600 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div 
            className="rounded-2xl p-8"
            style={{ backgroundColor: `${BRAND.teal}10` }}
          >
            <div className="text-center">
              <Award className="w-16 h-16 mx-auto mb-4" style={{ color: BRAND.teal }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: BRAND.navy }}>
                Trusted Platform
              </h3>
              <p style={{ color: BRAND.gray600 }}>
                Wasilah is trusted by Pakistan's leading corporations and NGOs to deliver 
                high-quality CSR programs with measurable impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: BRAND.navy }}>
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div 
                key={value.title}
                className="bg-white rounded-xl p-6 border transition-all hover:shadow-lg"
                style={{ borderColor: `${BRAND.navy}15` }}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${BRAND.teal}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: BRAND.teal }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: BRAND.navy }}>
                  {value.title}
                </h3>
                <p className="text-sm" style={{ color: BRAND.gray600 }}>
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: BRAND.navy }}>
          Our Journey
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 hidden md:block"
            style={{ backgroundColor: `${BRAND.teal}30` }}
          />
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div 
                key={milestone.year}
                className={`flex flex-col md:flex-row gap-4 md:gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 text-center md:text-right md:pr-8">
                  {index % 2 === 0 && (
                    <div 
                      className="bg-white rounded-xl p-6 border inline-block"
                      style={{ borderColor: `${BRAND.navy}15` }}
                    >
                      <div className="font-bold text-lg mb-1" style={{ color: BRAND.teal }}>
                        {milestone.year}
                      </div>
                      <div className="font-semibold mb-1" style={{ color: BRAND.navy }}>
                        {milestone.title}
                      </div>
                      <div className="text-sm" style={{ color: BRAND.gray600 }}>
                        {milestone.description}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Center dot */}
                <div className="hidden md:flex items-center justify-center">
                  <div 
                    className="w-4 h-4 rounded-full border-4"
                    style={{ 
                      backgroundColor: BRAND.white, 
                      borderColor: BRAND.teal 
                    }}
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left md:pl-8">
                  {index % 2 !== 0 && (
                    <div 
                      className="bg-white rounded-xl p-6 border inline-block"
                      style={{ borderColor: `${BRAND.navy}15` }}
                    >
                      <div className="font-bold text-lg mb-1" style={{ color: BRAND.teal }}>
                        {milestone.year}
                      </div>
                      <div className="font-semibold mb-1" style={{ color: BRAND.navy }}>
                        {milestone.title}
                      </div>
                      <div className="text-sm" style={{ color: BRAND.gray600 }}>
                        {milestone.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div 
          className="rounded-2xl p-12 text-center"
          style={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)` }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Whether you're a corporation looking to strengthen your CSR initiatives, an NGO seeking 
            partnerships, or a volunteer wanting to give back – Wasilah is your platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate?.('contact')}
              className="px-8 py-3 bg-white rounded-lg font-semibold transition-all hover:shadow-lg"
              style={{ color: BRAND.navy }}
            >
              Get in Touch
            </button>
            <button
              onClick={() => onNavigate?.('csr-solutions')}
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold transition-all hover:bg-white/10"
            >
              Explore Solutions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
