import React, { useState } from 'react';
import { Copy, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type JSONDiffViewerProps = {
  before: any;
  after: any;
  title?: string;
};

type DiffType = 'added' | 'removed' | 'modified' | 'unchanged';

type DiffItem = {
  path: string;
  type: DiffType;
  before?: any;
  after?: any;
};

export function JSONDiffViewer({ before, after, title = 'JSON Diff' }: JSONDiffViewerProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const toggleCollapse = (path: string) => {
    setCollapsed((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const computeDiff = (before: any, after: any, path = ''): DiffItem[] => {
    const diffs: DiffItem[] = [];

    // Handle null/undefined cases
    if (before === null || before === undefined) {
      if (after !== null && after !== undefined) {
        diffs.push({ path, type: 'added', after });
      }
      return diffs;
    }

    if (after === null || after === undefined) {
      diffs.push({ path, type: 'removed', before });
      return diffs;
    }

    // Handle different types
    const beforeType = typeof before;
    const afterType = typeof after;

    if (beforeType !== afterType) {
      diffs.push({ path, type: 'modified', before, after });
      return diffs;
    }

    // Handle objects and arrays
    if (beforeType === 'object') {
      if (Array.isArray(before) && Array.isArray(after)) {
        // Simple array comparison
        const maxLength = Math.max(before.length, after.length);
        for (let i = 0; i < maxLength; i++) {
          const itemPath = path ? `${path}[${i}]` : `[${i}]`;
          if (i >= before.length) {
            diffs.push({ path: itemPath, type: 'added', after: after[i] });
          } else if (i >= after.length) {
            diffs.push({ path: itemPath, type: 'removed', before: before[i] });
          } else {
            diffs.push(...computeDiff(before[i], after[i], itemPath));
          }
        }
      } else {
        // Object comparison
        const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
        allKeys.forEach((key) => {
          const itemPath = path ? `${path}.${key}` : key;
          if (!(key in before)) {
            diffs.push({ path: itemPath, type: 'added', after: after[key] });
          } else if (!(key in after)) {
            diffs.push({ path: itemPath, type: 'removed', before: before[key] });
          } else {
            diffs.push(...computeDiff(before[key], after[key], itemPath));
          }
        });
      }
    } else {
      // Primitive comparison
      if (before !== after) {
        diffs.push({ path, type: 'modified', before, after });
      } else {
        diffs.push({ path, type: 'unchanged', before, after });
      }
    }

    return diffs;
  };

  const diffs = computeDiff(before, after);
  const changedDiffs = diffs.filter((d) => d.type !== 'unchanged');

  const handleCopy = () => {
    const diffText = changedDiffs
      .map((d) => `${d.path}: ${d.before} → ${d.after}`)
      .join('\n');
    navigator.clipboard.writeText(diffText);
    setCopied(true);
    toast.success('Diff copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const getTypeColor = (type: DiffType) => {
    switch (type) {
      case 'added':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'removed':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'modified':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getTypeLabel = (type: DiffType) => {
    switch (type) {
      case 'added':
        return '+ Added';
      case 'removed':
        return '- Removed';
      case 'modified':
        return '~ Modified';
      default:
        return '= Unchanged';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm text-gray-900">{title}</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            {changedDiffs.length} change{changedDiffs.length !== 1 ? 's' : ''} detected
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Diff List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {changedDiffs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No changes detected</p>
            <p className="text-sm text-gray-500 mt-1">The objects are identical</p>
          </div>
        ) : (
          changedDiffs.map((diff, idx) => {
            const isCollapsed = collapsed.has(diff.path);
            const hasChildren =
              typeof diff.before === 'object' || typeof diff.after === 'object';

            return (
              <div key={idx} className={`p-3 ${getTypeColor(diff.type)}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {hasChildren && (
                        <button
                          onClick={() => toggleCollapse(diff.path)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <code className="text-xs font-mono text-gray-900">
                        {diff.path || '(root)'}
                      </code>
                    </div>

                    {!isCollapsed && (
                      <div className="ml-6 space-y-2">
                        {diff.type === 'modified' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Before</p>
                              <code className="block text-xs bg-white border border-gray-300 rounded px-2 py-1 overflow-x-auto">
                                {formatValue(diff.before)}
                              </code>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">After</p>
                              <code className="block text-xs bg-white border border-gray-300 rounded px-2 py-1 overflow-x-auto">
                                {formatValue(diff.after)}
                              </code>
                            </div>
                          </div>
                        )}

                        {diff.type === 'added' && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase mb-1">Value</p>
                            <code className="block text-xs bg-white border border-gray-300 rounded px-2 py-1 overflow-x-auto">
                              {formatValue(diff.after)}
                            </code>
                          </div>
                        )}

                        {diff.type === 'removed' && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase mb-1">Value</p>
                            <code className="block text-xs bg-white border border-gray-300 rounded px-2 py-1 overflow-x-auto">
                              {formatValue(diff.before)}
                            </code>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap">
                    {getTypeLabel(diff.type)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
