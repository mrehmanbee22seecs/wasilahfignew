import React from 'react';
import { Check } from 'lucide-react';
import type { TimelineStepperProps } from '../../types/ngo';

export function TimelineStepper({ currentStep, steps }: TimelineStepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isUpcoming = step.status === 'upcoming';
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                    ${isCurrent ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : ''}
                    ${isUpcoming ? 'bg-slate-200 text-slate-400' : ''}
                  `}
                  role="img"
                  aria-label={`${step.label} - ${step.status}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                  
                  {isCurrent && (
                    <span className="absolute -inset-1 bg-indigo-600 rounded-full animate-ping opacity-20" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    mt-2 text-xs text-center font-medium transition-colors
                    ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-500'}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 mb-8 bg-slate-200">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted ? 'bg-emerald-500 w-full' : 'bg-transparent w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
