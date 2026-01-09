import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "Wasilah transformed our entire CSR approach. Their student volunteer network gave us the scale we needed, and their professional management ensured every project delivered real, measurable impact.",
      name: "Ayesha Rahman",
      role: "Head of Corporate Social Responsibility",
      company: "Lucky Cement",
      type: "Corporate Partner",
      image: "corporate1"
    },
    {
      quote: "Working with Wasilah opened doors to corporate partnerships we couldn't access before. Their transparent process and professional coordination made collaboration seamless and impactful.",
      name: "Dr. Hassan Ali",
      role: "Executive Director",
      company: "The Citizens Foundation",
      type: "NGO Partner",
      image: "ngo1"
    },
    {
      quote: "Being part of Wasilah's volunteer program changed my perspective on CSR. I gained real-world experience, professional skills, and the satisfaction of making a genuine difference in my community.",
      name: "Fatima Khan",
      role: "Computer Science Student",
      company: "NUST University",
      type: "Student Volunteer",
      image: "student1"
    }
  ];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/30">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-4">
            <Quote className="w-4 h-4" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            What Our Partners Say
          </h2>
          <p className="text-slate-600">
            Hear from corporates, NGOs, and students who've experienced the Wasilah difference
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200">
            {/* Quote Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center mb-8 mx-auto">
              <Quote className="w-8 h-8 text-white" />
            </div>

            {/* Quote */}
            <p className="text-slate-700 text-center mb-8 text-lg leading-relaxed italic">
              "{current.quote}"
            </p>

            {/* Author Info */}
            <div className="flex flex-col items-center gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center text-teal-700">
                {current.name.split(' ').map(n => n[0]).join('')}
              </div>

              <div className="text-center">
                <div className="text-slate-900 mb-1">{current.name}</div>
                <div className="text-slate-600 text-sm mb-2">{current.role}</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-slate-500 text-sm">{current.company}</span>
                  <span className="text-slate-300">•</span>
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">
                    {current.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-50 transition-all border border-slate-200"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-50 transition-all border border-slate-200"
          >
            <ChevronRight className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-teal-600'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
