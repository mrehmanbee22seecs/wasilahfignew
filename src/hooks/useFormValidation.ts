import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateSchema, hasErrors as checkHasErrors } from '../lib/validation/formSchemas';

export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  type FormData = z.infer<T>;
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback((data: unknown): { success: boolean; data?: FormData; errors?: Record<string, string> } => {
    setIsValidating(true);
    const result = validateSchema(schema, data);
    setErrors(result.errors || {});
    setIsValidating(false);
    return result;
  }, [schema]);

  const validateField = useCallback((field: string, value: unknown, fullData: unknown) => {
    setIsValidating(true);
    const result = validateSchema(schema, fullData);
    
    if (result.errors && result.errors[field]) {
      setErrors(prev => ({ ...prev, [field]: result.errors![field] }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    setIsValidating(false);
    return !result.errors?.[field];
  }, [schema]);

  const setFieldTouched = useCallback((field: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const getFieldError = useCallback((field: string): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  }, [errors, touched]);

  const hasErrors = useCallback(() => {
    return checkHasErrors(errors);
  }, [errors]);

  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    isValidating,
    validate,
    validateField,
    setFieldTouched,
    setFieldError,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasErrors,
    resetValidation,
  };
}
