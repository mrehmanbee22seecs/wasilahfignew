import React from 'react';
import { MapPin, Users, Clock, ArrowRight } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function PortfolioSection() {
  const projects = [
    {
      title: 'Clean Water Initiative',
      description: 'Providing sustainable water filtration systems to 50 villages in rural Sindh',
      location: 'Sindh',
      volunteers: '320',
      hours: '2,400',
      category: 'Health'
    },
    {
      title: 'Digital Literacy Program',
      description: 'Teaching computer skills to 1,000 students in underserved communities',
      location: 'Punjab',
      volunteers: '150',
      hours: '1,800',
      category: 'Education'
    },
    {
      title: 'Tree Plantation Drive',
      description: 'Planting 10,000 trees across urban areas to combat climate change',
      location: 'Islamabad',
      volunteers: '500',
      hours: '1,200',
      category: 'Environment'
    },
    {
      title: 'Women Empowerment Workshop',
      description: 'Skills training and entrepreneurship workshops for 200 women',
      location: 'KPK',
      volunteers: '80',
      hours: '960',
      category: 'Economic'
    },
    {
      title: 'Health Screening Camp',
      description: 'Free medical checkups and consultations for 3,000 patients',
      location: 'Balochistan',
      volunteers: '120',
      hours: '720',
      category: 'Health'
    },
    {
      title: 'Youth Mentorship Program',
      description: 'Connecting corporate professionals with students for career guidance',
      location: 'Karachi',
      volunteers: '200',
      hours: '3,200',
      category: 'Education'
    }
  ];

  const categoryColors: Record<string, { bg: string; text: string }> = {
    Health: { bg: `${BRAND.teal}15`, text: BRAND.teal },
    Education: { bg: `${BRAND.navy}10`, text: BRAND.navy },
    Environment: { bg: '#10B98115', text: '#10B981' },
    Economic: { bg: '#8B5CF615', text: '#8B5CF6' }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <span className="font-medium">Our Impact</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: BRAND.navy }}
          >
            CSR Projects Portfolio
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Real projects delivering measurable impact across Pakistan
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const categoryStyle = categoryColors[project.category] || { bg: `${BRAND.teal}15`, text: BRAND.teal };
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Project Image Placeholder */}
                <div 
                  className="h-48 flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${BRAND.cream}, white)` }}
                >
                  <div className="text-center p-6">
                    <div className="text-gray-400 text-sm mb-2">Project Image</div>
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text }}
                    >
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 
                    className="text-lg font-semibold mb-3 transition-colors"
                    style={{ color: BRAND.navy }}
                  >
                    {project.title}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Project Metrics */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" style={{ color: BRAND.teal }} />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Users className="w-4 h-4" style={{ color: BRAND.navy }} />
                      <span>{project.volunteers} Volunteers</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="w-4 h-4" style={{ color: BRAND.teal }} />
                      <span>{project.hours} Hours</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <button 
            className="inline-flex items-center gap-2 px-8 py-4 border-2 rounded-xl transition-all group font-semibold"
            style={{ borderColor: BRAND.navy, color: BRAND.navy }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = BRAND.navy;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = BRAND.navy;
            }}
          >
            View Full Portfolio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}