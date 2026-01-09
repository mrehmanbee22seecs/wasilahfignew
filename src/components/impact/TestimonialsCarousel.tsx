import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import type { Testimonial } from '../../types/impact';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div
      className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 md:p-12 border-2 border-slate-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Quote Icon */}
      <div className="absolute top-8 left-8 text-teal-200">
        <Quote className="w-16 h-16" fill="currentColor" />
      </div>

      {/* Content */}
      <div className="relative max-w-3xl mx-auto text-center">
        {/* Quote */}
        <blockquote className="text-slate-700 text-lg md:text-xl leading-relaxed mb-8">
          "{currentTestimonial.quote}"
        </blockquote>

        {/* Author Info */}
        <div className="flex flex-col items-center gap-2">
          <div>
            <div className="text-slate-900 flex items-center justify-center gap-2">
              {currentTestimonial.name}
              {currentTestimonial.isPilot && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Pilot Partner
                </span>
              )}
            </div>
            <div className="text-slate-600 text-sm">
              {currentTestimonial.designation}
            </div>
            <div className="text-teal-600 text-sm">
              {currentTestimonial.organization}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={goToPrev}
          className="w-10 h-10 bg-white border-2 border-slate-300 hover:border-teal-600 hover:text-teal-600 rounded-full flex items-center justify-center transition-all"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-2 bg-teal-600'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              } rounded-full`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="w-10 h-10 bg-white border-2 border-slate-300 hover:border-teal-600 hover:text-teal-600 rounded-full flex items-center justify-center transition-all"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
