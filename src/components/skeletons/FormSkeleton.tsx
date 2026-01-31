/**
 * FormSkeleton Component
 * 
 * Skeleton loader for form layouts.
 * Simulates various form field types and layouts.
 * 
 * Features:
 * - Multiple field types (text, textarea, select, checkbox)
 * - Configurable number of fields
 * - Form groups with labels
 * - Submit button placeholder
 * - Responsive layout
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <FormSkeleton fields={5} />
 * <FormSkeleton fields={3} columns={2} />
 * ```
 * 
 * @module components/skeletons/FormSkeleton
 * @estimated-time 20 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';
import { ButtonSkeleton } from './ButtonSkeleton';

export interface FormSkeletonProps {
  /** Number of form fields */
  fields?: number;
  /** Number of columns for layout */
  columns?: 1 | 2;
  /** Show submit button */
  showSubmit?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Form skeleton component for loading forms
 */
export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 4,
  columns = 1,
  showSubmit = true,
  className = '',
}) => {
  const renderField = (index: number) => {
    // Mix different field types for variety
    const fieldType = index % 4;
    
    return (
      <div key={index} className="space-y-2">
        {/* Label */}
        <BaseSkeleton width="100px" height="16px" rounded="sm" />
        
        {/* Field */}
        {fieldType === 0 && (
          // Text input
          <BaseSkeleton width="100%" height="40px" rounded="md" />
        )}
        {fieldType === 1 && (
          // Textarea
          <BaseSkeleton width="100%" height="100px" rounded="md" />
        )}
        {fieldType === 2 && (
          // Select
          <BaseSkeleton width="100%" height="40px" rounded="md" />
        )}
        {fieldType === 3 && (
          // Checkbox/Radio group
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <BaseSkeleton width="20px" height="20px" rounded="sm" />
                <BaseSkeleton width="120px" height="16px" rounded="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`} role="status" aria-label="Loading form">
      {/* Form title */}
      <BaseSkeleton width="200px" height="28px" rounded="md" />

      {/* Form fields */}
      <div
        className={`
          grid gap-4
          ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}
        `}
      >
        {Array.from({ length: fields }).map((_, index) => renderField(index))}
      </div>

      {/* Submit button */}
      {showSubmit && (
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <ButtonSkeleton size="lg" width="150px" />
          <ButtonSkeleton size="lg" width="100px" />
        </div>
      )}
    </div>
  );
};

export default FormSkeleton;
