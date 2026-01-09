import React from 'react';
import { Quote, Star, GraduationCap } from 'lucide-react';

export function StudentTestimonials() {
  const testimonials = [
    {
      name: 'Ayesha Malik',
      university: 'LUMS',
      quote: 'Volunteering with Wasilah gave me real-world experience that no classroom could provide. I worked on a digital literacy project with Lucky Cement and TCF, and it completely transformed my understanding of CSR.',
      project: 'Digital Literacy Program',
      rating: 5,
      badge: 'Gold Volunteer'
    },
    {
      name: 'Hassan Ali',
      university: 'NUST',
      quote: 'The certificate I earned from Wasilah helped me land my first internship. Employers love seeing actual CSR project experience, and the skills I gained in project management were invaluable.',
      project: 'Tree Plantation Drive',
      rating: 5,
      badge: 'Silver Leader'
    },
    {
      name: 'Fatima Khan',
      university: 'IBA Karachi',
      quote: 'I joined as a graphic designer for CSR campaigns and ended up leading a team of 15 volunteers. The mentorship from corporate partners opened doors I never expected.',
      project: 'Women Empowerment Workshop',
      rating: 5,
      badge: 'Gold Mentor'
    },
    {
      name: 'Ahmed Raza',
      university: 'UET Lahore',
      quote: 'Being part of Wasilah connected me with Pakistan\'s top companies and NGOs. The networking opportunities alone made it worth it, but the impact we created was life-changing.',
      project: 'Clean Water Initiative',
      rating: 5,
      badge: 'Bronze Helper'
    },
    {
      name: 'Sara Ibrahim',
      university: 'Karachi University',
      quote: 'I volunteered for health screening camps and realized how much difference we can make. The verified certificate from Fauji Foundation and LRBT gave my CV serious credibility.',
      project: 'Mobile Healthcare Camps',
      rating: 5,
      badge: 'Silver Leader'
    },
    {
      name: 'Bilal Ahmed',
      university: 'FAST Islamabad',
      quote: 'The skill-based volunteering option was perfect for me. I provided IT support remotely while managing my studies, and still earned recognition and recommendations.',
      project: 'IT Support for NGOs',
      rating: 5,
      badge: 'Gold Volunteer'
    }
  ];

  const badgeColors: Record<string, string> = {
    'Bronze Helper': 'bg-amber-100 text-amber-700',
    'Silver Leader': 'bg-slate-200 text-slate-700',
    'Gold Volunteer': 'bg-yellow-100 text-yellow-700',
    'Gold Mentor': 'bg-yellow-100 text-yellow-700'
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-4">
            <Quote className="w-4 h-4" />
            <span>Student Voices</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Student Testimonials & Stories
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Hear from students who transformed their university experience through CSR volunteering
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:shadow-2xl transition-all duration-300"
            >
              {/* Avatar & Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center text-teal-700">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-slate-900">{testimonial.name}</div>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <GraduationCap className="w-4 h-4" />
                    <span>{testimonial.university}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-600 mb-6 leading-relaxed italic text-sm">
                "{testimonial.quote}"
              </p>

              {/* Project & Badge */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-slate-500 text-xs mb-2">Worked On</div>
                <div className="text-slate-900 text-sm mb-3">{testimonial.project}</div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs ${badgeColors[testimonial.badge]}`}>
                  {testimonial.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
