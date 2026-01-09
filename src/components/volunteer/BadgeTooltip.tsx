import React, { useState } from 'react';
import type { Badge } from '../../types/volunteer';

type BadgeTooltipProps = {
  badge: Badge;
  children: React.ReactNode;
};

export function BadgeTooltip({ badge, children }: BadgeTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        role="button"
        aria-describedby={`badge-tooltip-${badge.id}`}
        className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
      >
        {children}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div
          id={`badge-tooltip-${badge.id}`}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg w-48 pointer-events-none"
        >
          <div className="font-semibold mb-1">{badge.name}</div>
          <div className="text-gray-300">{badge.description}</div>
          {badge.earnedAt && (
            <div className="text-gray-400 mt-1 text-[10px]">
              Earned: {new Date(badge.earnedAt).toLocaleDateString()}
            </div>
          )}
          
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}

type BadgeGridProps = {
  badges: Badge[];
  maxVisible?: number;
  onViewAll?: () => void;
};

export function BadgeGrid({ badges, maxVisible = 8, onViewAll }: BadgeGridProps) {
  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = Math.max(0, badges.length - maxVisible);

  return (
    <div className="flex flex-wrap gap-3">
      {visibleBadges.map((badge) => (
        <BadgeTooltip key={badge.id} badge={badge}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            {badge.iconUrl ? (
              <img src={badge.iconUrl} alt={badge.name} className="w-8 h-8" />
            ) : (
              <span className="text-white text-lg">🏆</span>
            )}
          </div>
        </BadgeTooltip>
      ))}

      {remainingCount > 0 && (
        <button
          onClick={onViewAll}
          className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          +{remainingCount}
        </button>
      )}
    </div>
  );
}
