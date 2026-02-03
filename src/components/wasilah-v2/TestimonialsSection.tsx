import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

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
    <section className="py-24" style={{ backgroundColor: BRAND.cream }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <Quote className="w-4 h-4" />
            <span className="font-medium">Testimonials</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: BRAND.navy }}
          >
            What Our Partners Say
          </h2>
          <p className="text-gray-600 text-lg">
            Hear from corporates, NGOs, and students who've experienced the Wasilah difference
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
            {/* Quote Icon */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-8 mx-auto"
              style={{ backgroundColor: BRAND.teal }}
            >
              <Quote className="w-8 h-8 text-white" />
            </div>

            {/* Quote */}
            <p className="text-center mb-8 text-lg leading-relaxed italic" style={{ color: BRAND.navy }}>
              "{current.quote}"
            </p>

            {/* Author Info */}
            <div className="flex flex-col items-center gap-4">
              {/* Avatar */}
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: BRAND.navy }}
              >
                {current.name.split(' ').map(n => n[0]).join('')}
              </div>

              <div className="text-center">
                <div className="font-semibold mb-1" style={{ color: BRAND.navy }}>{current.name}</div>
                <div className="text-gray-600 text-sm mb-2">{current.role}</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-500 text-sm">{current.company}</span>
                  <span className="text-gray-300">•</span>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
                  >
                    {current.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all border border-gray-100"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND.cream}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <ChevronLeft className="w-6 h-6" style={{ color: BRAND.navy }} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all border border-gray-100"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND.cream}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <ChevronRight className="w-6 h-6" style={{ color: BRAND.navy }} />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="h-2 rounded-full transition-all"
              style={{ 
                width: index === currentIndex ? '2rem' : '0.5rem',
                backgroundColor: index === currentIndex ? BRAND.teal : '#CBD5E1'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
