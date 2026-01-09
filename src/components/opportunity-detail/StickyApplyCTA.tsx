import React, { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';

interface StickyApplyCTAProps {
  onApply: () => void;
}

export function StickyApplyCTA({ onApply }: StickyApplyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past hero section (approximately 600px)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-slate-200 shadow-xl animate-in slide-in-from-bottom">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <div className="text-slate-900">Like this opportunity?</div>
            <div className="text-slate-600 text-sm">Apply now and start making an impact</div>
          </div>
          
          <button
            onClick={onApply}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Rocket className="w-5 h-5" />
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
