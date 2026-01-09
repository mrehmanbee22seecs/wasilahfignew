import React from 'react';

type TabId = 'articles' | 'guides' | 'reports';

interface Tab {
  id: TabId;
  label: string;
  count?: number;
}

interface ResourceTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  tabs: Tab[];
}

export function ResourceTabBar({ activeTab, onTabChange, tabs }: ResourceTabBarProps) {
  return (
    <div className="border-b-2 border-slate-200 bg-white sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex gap-8" role="tablist" aria-label="Resource categories">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative py-4 text-sm font-medium transition-colors
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
                  ${isActive 
                    ? 'text-emerald-600' 
                    : 'text-slate-600 hover:text-slate-900'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs
                      ${isActive 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                      }
                    `}>
                      {tab.count}
                    </span>
                  )}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-600 to-blue-600" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
