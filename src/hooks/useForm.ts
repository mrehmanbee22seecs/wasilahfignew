import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { z } from 'zod';
import { useFormValidation } from './useFormValidation';

export function useForm<T extends z.ZodSchema>(
  schema: T,
  options?: {
    initialValues?: Partial<z.infer<T>>;
    onSubmit?: (data: z.infer<T>) => void | Promise<void>;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
  }
) {
  type FormData = z.infer<T>;
  
  const {
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
  } = useFormValidation(schema);

  const [values, setValues] = useState<Partial<FormData>>(options?.initialValues || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = useCallback((field: keyof FormData) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    setValues(prev => ({ ...prev, [field]: value }));
    clearFieldError(field as string);
    
    if (options?.validateOnChange) {
      const newValues = { ...values, [field]: value };
      validateField(field as string, value, newValues);
    }
  }, [values, options?.validateOnChange, validateField, clearFieldError]);

  const handleBlur = useCallback((field: keyof FormData) => () => {
    setFieldTouched(field as string, true);
    
    if (options?.validateOnBlur) {
      validateField(field as string, values[field], values);
    }
  }, [values, options?.validateOnBlur, validateField, setFieldTouched]);

  const setFieldValue = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    clearFieldError(field as string);
  }, [clearFieldError]);

  const setFormValues = useCallback((newValues: Partial<FormData>) => {
    setValues(newValues);
    clearErrors();
  }, [clearErrors]);

  const handleSubmit = useCallback(async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setSubmitError(null);
    const result = validate(values);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    Object.keys(allTouched).forEach(key => setFieldTouched(key, true));
    
    if (!result.success) {
      return { success: false, errors: result.errors };
    }
    
    if (options?.onSubmit) {
      try {
        setIsSubmitting(true);
        await options.onSubmit(result.data!);
        return { success: true, data: result.data };
      } catch (error: any) {
        const errorMessage = error.message || 'An error occurred while submitting the form';
        setSubmitError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    }
    
    return { success: true, data: result.data };
  }, [values, validate, setFieldTouched, options]);

  const reset = useCallback(() => {
    setValues(options?.initialValues || {});
    resetValidation();
    setSubmitError(null);
  }, [options?.initialValues, resetValidation]);

  const isDirty = useCallback(() => {
    return JSON.stringify(values) !== JSON.stringify(options?.initialValues || {});
  }, [values, options?.initialValues]);

  return {
    values,
    errors,
    touched,
    isValidating,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFormValues,
    setFieldError,
    clearFieldError,
    getFieldError,
    hasErrors,
    reset,
    isDirty,
  };
}
