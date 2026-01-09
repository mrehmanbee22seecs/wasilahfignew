import React from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export function CorporateTestimonials() {
  const testimonials = [
    {
      quote: 'Wasilah executed our CSR event flawlessly. Their volunteer management and reporting were far beyond what we expected. The impact dashboard gave our board exactly what they needed to see.',
      name: 'Sarah Ahmed',
      designation: 'Head of CSR & Sustainability',
      company: 'Engro Corporation',
      rating: 5
    },
    {
      quote: 'We partnered with Wasilah for our annual tree plantation drive. They mobilized 500 volunteers, coordinated with WWF Pakistan, and delivered comprehensive reports within 48 hours. Exceptional service.',
      name: 'Hassan Malik',
      designation: 'Corporate Affairs Director',
      company: 'Lucky Cement',
      rating: 5
    },
    {
      quote: 'The NGO vetting process gave us complete confidence. Wasilah handled everything from planning to execution to documentation. Our employees loved the volunteer experience they created.',
      name: 'Fatima Khan',
      designation: 'VP Corporate Social Responsibility',
      company: 'HBL',
      rating: 5
    },
    {
      quote: 'Wasilah transformed our CSR approach. Their data-driven reporting and SDG alignment helped us meet our ESG commitments while creating real community impact. A true operations partner.',
      name: 'Ahmed Raza',
      designation: 'Sustainability Lead',
      company: 'Systems Limited',
      rating: 5
    },
    {
      quote: 'From strategy to execution, Wasilah delivered. Their network of verified NGOs and trained volunteers made scaling our CSR programs across multiple cities seamless and stress-free.',
      name: 'Ayesha Ibrahim',
      designation: 'CSR Manager',
      company: 'Unilever Pakistan',
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 mb-4">
            <Quote className="w-4 h-4" />
            <span>Client Success Stories</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            What Corporate Leaders Say
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Trusted by Pakistan's leading companies for CSR excellence and operational efficiency
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 border-2 border-blue-200 hover:shadow-2xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-6">
                <Quote className="w-6 h-6" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Profile */}
              <div className="flex items-center gap-4 pt-6 border-t border-blue-200">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-violet-100 rounded-full flex items-center justify-center text-blue-700">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-slate-900">{testimonial.name}</div>
                  <div className="text-slate-600 text-sm">{testimonial.designation}</div>
                  <div className="text-blue-600 text-sm">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Testimonials - Hidden on smaller screens */}
        <div className="hidden lg:grid grid-cols-2 gap-8 mt-8">
          {testimonials.slice(3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-violet-50 rounded-2xl p-8 border-2 border-violet-200 hover:shadow-2xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center text-white mb-6">
                <Quote className="w-6 h-6" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Profile */}
              <div className="flex items-center gap-4 pt-6 border-t border-violet-200">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center text-violet-700">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-slate-900">{testimonial.name}</div>
                  <div className="text-slate-600 text-sm">{testimonial.designation}</div>
                  <div className="text-violet-600 text-sm">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Join Pakistan's leading corporates in creating measurable impact</p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:shadow-xl transition-all">
            Become a Client
          </button>
        </div>
      </div>
    </section>
  );
}
