import React from 'react';
import { ArrowRight, MapPin, Users, Calendar } from 'lucide-react';

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
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 mb-4">
            <span>Impact Stories</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Featured CSR Projects
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Real impact delivered through strategic partnerships between leading corporates and verified NGOs
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Project Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 via-emerald-100 to-cyan-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/50 rounded-full mx-auto mb-2 flex items-center justify-center backdrop-blur-sm">
                      <Users className="w-8 h-8" />
                    </div>
                    <p className="text-sm">Project Image</p>
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {project.corporate}
                  </span>
                  <span className="text-slate-400">×</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                    {project.ngo}
                  </span>
                </div>

                <p className="text-slate-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Project Stats */}
                <div className="space-y-2 mb-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>{project.beneficiaries}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Calendar className="w-4 h-4 text-violet-500" />
                    <span>{project.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all group">
            View All Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
