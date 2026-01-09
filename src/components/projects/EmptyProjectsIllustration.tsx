import React from 'react';

export function EmptyProjectsIllustration() {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-48 mx-auto"
    >
      {/* Background Circle */}
      <circle cx="100" cy="80" r="60" fill="#F1F5F9" />
      
      {/* Folder */}
      <path
        d="M50 70h100v50a5 5 0 0 1-5 5H55a5 5 0 0 1-5-5V70Z"
        fill="#CBD5E1"
      />
      <path
        d="M50 70h40l5-10h25a5 5 0 0 1 5 5v5H50Z"
        fill="#94A3B8"
      />
      
      {/* Document icon inside folder */}
      <rect x="80" y="85" width="40" height="30" rx="2" fill="white" />
      <line x1="85" y1="92" x2="115" y2="92" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="85" y1="100" x2="110" y2="100" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="85" y1="108" x2="105" y2="108" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      
      {/* Plus icon */}
      <circle cx="140" cy="110" r="12" fill="#0D9488" />
      <line x1="140" y1="104" x2="140" y2="116" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="134" y1="110" x2="146" y2="110" stroke="white" strokeWidth="2" strokeLinecap="round" />
      
      {/* Decorative dots */}
      <circle cx="40" cy="50" r="3" fill="#0D9488" opacity="0.3" />
      <circle cx="160" cy="50" r="3" fill="#2563EB" opacity="0.3" />
      <circle cx="30" cy="110" r="2" fill="#8B5CF6" opacity="0.3" />
      <circle cx="170" cy="100" r="2" fill="#EC4899" opacity="0.3" />
    </svg>
  );
}

export function NoResultsIllustration() {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-40 mx-auto"
    >
      {/* Background Circle */}
      <circle cx="100" cy="80" r="50" fill="#F1F5F9" />
      
      {/* Magnifying Glass */}
      <circle cx="90" cy="75" r="25" stroke="#94A3B8" strokeWidth="4" fill="white" />
      <line x1="108" y1="93" x2="130" y2="115" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
      
      {/* X mark inside */}
      <line x1="82" y1="67" x2="98" y2="83" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
      <line x1="98" y1="67" x2="82" y2="83" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
      
      {/* Decorative elements */}
      <circle cx="50" cy="50" r="2" fill="#CBD5E1" />
      <circle cx="150" cy="50" r="2" fill="#CBD5E1" />
      <circle cx="40" cy="100" r="2" fill="#CBD5E1" />
    </svg>
  );
}
