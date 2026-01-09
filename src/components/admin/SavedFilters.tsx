import React, { useState } from 'react';
import { Bookmark, Plus, X, Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

/**
 * Saved Filters Component
 * 
 * Allows users to save and quickly apply filter presets
 * Features:
 * - Save current filter state
 * - Load saved filters
 * - Star favorite filters
 * - Delete saved filters
 */

export type FilterPreset = {
  id: string;
  name: string;
  filters: Record<string, any>;
  isFavorite: boolean;
  createdAt: string;
};

export type SavedFiltersProps = {
  currentFilters: Record<string, any>;
  onApplyFilter: (filters: Record<string, any>) => void;
  className?: string;
};

export function SavedFilters({ currentFilters, onApplyFilter, className = '' }: SavedFiltersProps) {
  const [presets, setPresets] = useState<FilterPreset[]>([
    {
      id: 'preset-1',
      name: 'High Risk Pending',
      filters: { status: 'pending', riskLevel: 'high' },
      isFavorite: true,
      createdAt: '2025-12-01T10:00:00Z',
    },
    {
      id: 'preset-2',
      name: 'Unassigned',
      filters: { assignedTo: '', status: 'pending' },
      isFavorite: false,
      createdAt: '2025-12-05T14:30:00Z',
    },
    {
      id: 'preset-3',
      name: 'Recently Submitted',
      filters: { dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      isFavorite: true,
      createdAt: '2025-12-10T09:15:00Z',
    },
  ]);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      toast.error('Please enter a name for the filter preset');
      return;
    }

    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      filters: currentFilters,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    setPresets([...presets, newPreset]);
    setShowSaveModal(false);
    setNewPresetName('');
    toast.success('Filter preset saved');
  };

  const handleApplyPreset = (preset: FilterPreset) => {
    onApplyFilter(preset.filters);
    setShowDropdown(false);
    toast.success(`Applied filter: ${preset.name}`);
  };

  const handleToggleFavorite = (id: string) => {
    setPresets(presets.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)));
  };

  const handleDeletePreset = (id: string) => {
    setPresets(presets.filter((p) => p.id !== id));
    toast.success('Filter preset deleted');
  };

  const favoritePresets = presets.filter((p) => p.isFavorite);
  const otherPresets = presets.filter((p) => !p.isFavorite);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Saved filters"
        aria-expanded={showDropdown}
      >
        <Bookmark className="w-4 h-4" />
        <span>Saved Filters</span>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{presets.length}</span>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
            aria-hidden="true"
          />
          <div
            className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto"
            role="menu"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm text-gray-900">Saved Filters</h3>
              <button
                onClick={() => {
                  setShowSaveModal(true);
                  setShowDropdown(false);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Save Current
              </button>
            </div>

            {/* Favorites Section */}
            {favoritePresets.length > 0 && (
              <div className="p-2 border-b border-gray-200">
                <div className="px-2 py-1 text-xs text-gray-500 uppercase">Favorites</div>
                {favoritePresets.map((preset) => (
                  <PresetRow
                    key={preset.id}
                    preset={preset}
                    onApply={handleApplyPreset}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeletePreset}
                  />
                ))}
              </div>
            )}

            {/* Other Presets */}
            {otherPresets.length > 0 && (
              <div className="p-2">
                {favoritePresets.length > 0 && (
                  <div className="px-2 py-1 text-xs text-gray-500 uppercase">All Filters</div>
                )}
                {otherPresets.map((preset) => (
                  <PresetRow
                    key={preset.id}
                    preset={preset}
                    onApply={handleApplyPreset}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeletePreset}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {presets.length === 0 && (
              <div className="p-8 text-center">
                <Bookmark className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">No saved filters yet</p>
                <p className="text-xs text-gray-500">
                  Apply filters and click "Save Current" to create a preset
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSaveModal(false)}
            aria-hidden="true"
          />
          <div
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-filter-title"
          >
            <h3 id="save-filter-title" className="text-lg text-gray-900 mb-4">
              Save Filter Preset
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Preset Name</label>
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="e.g., High Priority Pending Review"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSavePreset();
                  }}
                />
              </div>

              {/* Preview Current Filters */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Current Filters</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
                  {Object.entries(currentFilters).filter(([_, value]) => value).length === 0 ? (
                    <p className="text-gray-500">No active filters</p>
                  ) : (
                    Object.entries(currentFilters)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-gray-600">{key}:</span>
                          <span className="text-gray-900">{String(value)}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Preset Row Component
type PresetRowProps = {
  preset: FilterPreset;
  onApply: (preset: FilterPreset) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
};

function PresetRow({ preset, onApply, onToggleFavorite, onDelete }: PresetRowProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="group flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onApply(preset)}
      role="menuitem"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(preset.id);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-amber-500 transition-colors"
          aria-label={preset.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-4 h-4 ${preset.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 truncate">{preset.name}</p>
          <p className="text-xs text-gray-500">
            {Object.keys(preset.filters).filter((k) => preset.filters[k]).length} filters
          </p>
        </div>
      </div>

      {showActions && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(preset.id);
          }}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
          aria-label="Delete preset"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
