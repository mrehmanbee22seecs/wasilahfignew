import React from 'react';
import { Quote, Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      quote: "Wasilah transformed our CSR approach. Their end-to-end management, from NGO vetting to impact reporting, gave us complete confidence in our social impact investments.",
      author: "Sarah Ahmed",
      role: "Head of CSR & Sustainability",
      company: "Engro Corporation",
      type: "corporate",
      rating: 5
    },
    {
      quote: "As an NGO, partnering with Wasilah opened doors to corporate partnerships we couldn't access before. Their rigorous verification process builds trust on both sides.",
      author: "Dr. Imran Khan",
      role: "Executive Director",
      company: "The Citizens Foundation",
      type: "ngo",
      rating: 5
    },
    {
      quote: "The transparency and professionalism Wasilah brings to CSR operations is unmatched. They handle compliance, reporting, and execution seamlessly, allowing us to focus on strategy.",
      author: "Fatima Malik",
      role: "VP Corporate Affairs",
      company: "Lucky Cement",
      type: "corporate",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Trusted by Corporates & NGOs
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Hear from our partners about their experience working with Wasilah
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center text-blue-700">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-slate-900">{testimonial.author}</div>
                  <div className="text-slate-500 text-sm">{testimonial.role}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      testimonial.type === 'corporate' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {testimonial.company}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
