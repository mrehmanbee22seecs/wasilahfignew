import React from 'react';
import { AlertTriangle, User, Clock, Check, X } from 'lucide-react';

interface ConflictResolutionProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (action: 'keep-mine' | 'use-theirs' | 'merge') => void;
  conflictData: {
    field: string;
    yourVersion: string;
    theirVersion: string;
    theirUser: string;
    timestamp: string;
  };
}

export function ConflictResolutionModal({ 
  isOpen, 
  onClose, 
  onResolve, 
  conflictData 
}: ConflictResolutionProps) {
  if (!isOpen) return null;

  const formatValue = (value: string) => {
    // Handle different data types
    if (value === 'true' || value === 'false') {
      return value === 'true' ? 'Yes' : 'No';
    }
    if (!isNaN(Number(value))) {
      return new Intl.NumberFormat('en-US').format(Number(value));
    }
    return value;
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-[90]"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="conflict-title"
        >
          {/* Header */}
          <div className="flex items-start gap-3 p-6 border-b-2 border-slate-200">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 id="conflict-title" className="text-slate-900 mb-1">
                Edit Conflict Detected
              </h3>
              <p className="text-sm text-slate-600">
                Another user has modified the same field while you were editing. Choose which version to keep.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Field Name */}
            <div>
              <label className="text-xs text-slate-600">Conflicting Field</label>
              <p className="text-sm text-slate-900 capitalize">
                {conflictData.field.replace(/_/g, ' ')}
              </p>
            </div>

            {/* Versions Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Your Version */}
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700">Your Version</span>
                </div>
                <div className="p-3 bg-white rounded-lg border-2 border-blue-300">
                  <p className="text-sm text-slate-900 break-words">
                    {formatValue(conflictData.yourVersion)}
                  </p>
                </div>
                <button
                  onClick={() => onResolve('keep-mine')}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Keep My Version
                </button>
              </div>

              {/* Their Version */}
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700">
                    {conflictData.theirUser}'s Version
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border-2 border-green-300">
                  <p className="text-sm text-slate-900 break-words">
                    {formatValue(conflictData.theirVersion)}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-600 mt-2 mb-2">
                  <Clock className="w-3 h-3" />
                  <span>
                    Modified {new Date(conflictData.timestamp).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => onResolve('use-theirs')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Use Their Version
                </button>
              </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-2 p-3 bg-slate-50 border-2 border-slate-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700">
                This conflict occurred because multiple users were editing the CSR Plan simultaneously. 
                In the future, consider coordinating edit times or using the "Lock for Editing" feature.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t-2 border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel (Keep Both as Draft)
            </button>
            
            <button
              onClick={() => onResolve('merge')}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Merge Manually
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook to detect conflicts
export function useConflictDetection(fieldName: string, currentValue: any, lastKnownValue: any) {
  const [hasConflict, setHasConflict] = React.useState(false);
  const [conflictData, setConflictData] = React.useState<any>(null);

  React.useEffect(() => {
    // Simulate checking for conflicts from backend
    const checkConflicts = async () => {
      // In production, this would make an API call to check for conflicts
      // For now, simulate a conflict if values differ
      if (currentValue !== lastKnownValue && lastKnownValue !== undefined) {
        setHasConflict(true);
        setConflictData({
          field: fieldName,
          yourVersion: currentValue,
          theirVersion: lastKnownValue,
          theirUser: 'Sarah Ahmed',
          timestamp: new Date().toISOString()
        });
      }
    };

    checkConflicts();
  }, [fieldName, currentValue, lastKnownValue]);

  return { hasConflict, conflictData, clearConflict: () => setHasConflict(false) };
}
