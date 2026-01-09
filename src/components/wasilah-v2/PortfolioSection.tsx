import React from 'react';
import { MapPin, Users, Clock, ArrowRight } from 'lucide-react';

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

  const categoryColors: Record<string, string> = {
    Health: 'bg-red-100 text-red-700',
    Education: 'bg-blue-100 text-blue-700',
    Environment: 'bg-green-100 text-green-700',
    Economic: 'bg-violet-100 text-violet-700'
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-4">
            <span>Our Impact</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            CSR Projects Portfolio
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Real projects delivering measurable impact across Pakistan
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Project Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-teal-100 via-blue-100 to-violet-100 flex items-center justify-center relative overflow-hidden">
                <div className="text-center p-6">
                  <div className="text-slate-600 text-sm mb-2">Project Image</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${categoryColors[project.category]}`}>
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                  {project.title}
                </h3>

                <p className="text-slate-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Project Metrics */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{project.volunteers} Volunteers</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Clock className="w-4 h-4 text-violet-500" />
                    <span>{project.hours} Hours</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all group">
            View Full Portfolio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}