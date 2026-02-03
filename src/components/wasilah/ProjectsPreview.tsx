import React from 'react';
import { ArrowRight, MapPin, Users, Calendar } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function ProjectsPreview() {
  const projects = [
    {
      title: 'Clean Water Initiative',
      corporate: 'Engro Corporation',
      ngo: 'Water.org Pakistan',
      description: 'Providing clean drinking water access to 5,000 families in rural Sindh through sustainable filtration systems.',
      location: 'Sindh',
      beneficiaries: '5,000 families',
      duration: '12 months',
      image: 'project1'
    },
    {
      title: 'Digital Literacy Program',
      corporate: 'Lucky Cement',
      ngo: 'The Citizens Foundation',
      description: 'Empowering 2,000 students with computer skills and digital education in underserved communities.',
      location: 'Punjab',
      beneficiaries: '2,000 students',
      duration: '18 months',
      image: 'project2'
    },
    {
      title: 'Healthcare Access Drive',
      corporate: 'Habib Bank Limited',
      ngo: 'Akhuwat Health Services',
      description: 'Mobile health clinics serving 10,000 patients in remote areas with free medical consultations.',
      location: 'KPK',
      beneficiaries: '10,000 patients',
      duration: '24 months',
      image: 'project3'
    }
  ];

  return (
    <section className="py-24" style={{ backgroundColor: BRAND.cream }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <span className="font-medium">Impact Stories</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: BRAND.navy }}
          >
            Featured CSR Projects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Real impact delivered through strategic partnerships between leading corporates and verified NGOs
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Project Image Placeholder */}
              <div 
                className="h-48 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${BRAND.teal}20, ${BRAND.navy}10)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center backdrop-blur-sm"
                      style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                    >
                      <Users className="w-8 h-8" style={{ color: BRAND.navy }} />
                    </div>
                    <p className="text-sm">Project Image</p>
                  </div>
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

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: `${BRAND.navy}10`, color: BRAND.navy }}
                  >
                    {project.corporate}
                  </span>
                  <span className="text-gray-400">×</span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
                  >
                    {project.ngo}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Project Stats */}
                <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" style={{ color: BRAND.teal }} />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="w-4 h-4" style={{ color: BRAND.navy }} />
                    <span>{project.beneficiaries}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" style={{ color: BRAND.teal }} />
                    <span>{project.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
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
            View All Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
