import React from 'react';
import { motion } from 'motion/react';

interface LiveUpdateBadgeProps {
  count: number;
  onClick?: () => void;
  className?: string;
}

export function LiveUpdateBadge({ count, onClick, className = '' }: LiveUpdateBadgeProps) {
  if (count === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors ${className}`}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        {count} new {count === 1 ? 'update' : 'updates'}
      </span>
    </motion.button>
  );
}
