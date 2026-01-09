import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

/**
 * VerificationChecklist Component
 * 
 * @description Editable checklist for vetting verification steps
 * @accessibility Keyboard accessible checkboxes, proper labels
 * 
 * Items are editable by admin and saved to vetting_requests.checklist_data (jsonb)
 */

export type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
  notes?: string;
};

export type VerificationChecklistProps = {
  items: ChecklistItem[];
  onChange: (itemId: string, checked: boolean) => void;
  onAddNote?: (itemId: string, note: string) => void;
  editable?: boolean;
  className?: string;
};

export function VerificationChecklist({
  items,
  onChange,
  onAddNote,
  editable = true,
  className = '',
}: VerificationChecklistProps) {
  const checkedCount = items.filter((item) => item.checked).length;
  const requiredCount = items.filter((item) => item.required).length;
  const requiredChecked = items.filter((item) => item.required && item.checked).length;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-900">Verification Checklist</h3>
          <div className="text-xs text-gray-600">
            {checkedCount} / {items.length} completed
            {requiredCount > 0 && (
              <span className="ml-2 text-red-600">
                ({requiredChecked} / {requiredCount} required)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="p-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`
                p-3 border rounded-lg transition-all
                ${item.checked ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}
              `}
            >
              <label
                className="flex items-start gap-3 cursor-pointer"
                htmlFor={`checklist-${item.id}`}
              >
                <div className="flex items-center pt-0.5">
                  {editable ? (
                    <input
                      id={`checklist-${item.id}`}
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => onChange(item.id, e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                      aria-label={item.label}
                    />
                  ) : item.checked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm ${
                        item.checked ? 'text-emerald-900 line-through' : 'text-gray-900'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.required && (
                      <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                        Required
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-gray-600 mt-1">{item.notes}</p>
                  )}
                </div>
              </label>

              {/* Optional: Add note functionality */}
              {editable && onAddNote && !item.notes && (
                <button
                  onClick={() => {
                    const note = prompt(`Add note for: ${item.label}`);
                    if (note) {
                      onAddNote(item.id, note);
                    }
                  }}
                  className="ml-7 mt-2 text-xs text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  Add note
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Warning if required items not checked */}
      {requiredCount > 0 && requiredChecked < requiredCount && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-900">
              <strong>Note:</strong> {requiredCount - requiredChecked} required item(s) remain unchecked.
              These must be completed before final approval.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
