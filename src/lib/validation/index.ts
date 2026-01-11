// Export all validation schemas
export * from './formSchemas';

// Export validation helpers
export { validateSchema, getFieldError, hasErrors, schemas } from './formSchemas';

// Re-export common schemas for easy access
export {
  emailSchema,
  phoneSchema,
  cnicSchema,
  passwordSchema,
  urlSchema,
  sdgGoalsSchema,
  provinceSchema,
  dateSchema,
  futureDateSchema,
} from './formSchemas';
