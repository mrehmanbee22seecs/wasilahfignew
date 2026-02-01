/**
 * Tests for Input Validation
 * 
 * Tests the validation system to ensure it:
 * - Validates input correctly against Zod schemas
 * - Returns appropriate error messages
 * - Prevents invalid data submission
 * - Handles edge cases
 */

import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  signupSchema,
  createProjectSchema,
  createVolunteerApplicationSchema,
  createPaymentApprovalSchema,
  validateSchema,
} from '../schemas';

describe('Input Validation', () => {
  describe('Login validation', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = validateSchema(loginSchema, validData);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      
      const result = validateSchema(loginSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.email).toContain('email');
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };
      
      const result = validateSchema(loginSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.password).toBeTruthy();
    });
  });

  describe('Signup validation', () => {
    it('should validate correct signup data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        fullName: 'Test User',
      };
      
      const result = validateSchema(signupSchema, validData);
      
      expect(result.success).toBe(true);
    });

    it('should reject weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak', // no uppercase, no number
        fullName: 'Test User',
      };
      
      const result = validateSchema(signupSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.password).toBeTruthy();
    });

    it('should require uppercase in password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123', // no uppercase
        fullName: 'Test User',
      };
      
      const result = validateSchema(signupSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.password).toContain('uppercase');
    });

    it('should require number in password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password', // no number
        fullName: 'Test User',
      };
      
      const result = validateSchema(signupSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.password).toContain('number');
    });

    it('should require minimum password length', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Pass1', // too short
        fullName: 'Test User',
      };
      
      const result = validateSchema(signupSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.password).toContain('8 characters');
    });
  });

  describe('Project validation', () => {
    it('should validate correct project data', () => {
      const validData = {
        title: 'Education Initiative',
        description: 'A comprehensive education program for underprivileged children focusing on literacy and numeracy skills.',
        budget: 50000,
        start_date: '2026-03-01',
        end_date: '2026-12-31',
        location: 'Karachi',
        city: 'Karachi',
        province: 'Sindh',
        sdg_goals: [4, 8],
        focus_areas: ['education', 'youth'],
        volunteer_capacity: 20,
      };
      
      const result = validateSchema(createProjectSchema, validData);
      
      expect(result.success).toBe(true);
    });

    it('should reject title too short', () => {
      const invalidData = {
        title: 'Ed', // too short
        description: 'A comprehensive education program for underprivileged children.',
        budget: 50000,
        start_date: '2026-03-01',
        end_date: '2026-12-31',
        location: 'Karachi',
        city: 'Karachi',
        province: 'Sindh',
        sdg_goals: [4],
        focus_areas: ['education'],
        volunteer_capacity: 20,
      };
      
      const result = validateSchema(createProjectSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.title).toContain('5 characters');
    });

    it('should reject description too short', () => {
      const invalidData = {
        title: 'Education Initiative',
        description: 'Short', // too short
        budget: 50000,
        start_date: '2026-03-01',
        end_date: '2026-12-31',
        location: 'Karachi',
        city: 'Karachi',
        province: 'Sindh',
        sdg_goals: [4],
        focus_areas: ['education'],
        volunteer_capacity: 20,
      };
      
      const result = validateSchema(createProjectSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.description).toContain('50 characters');
    });

    it('should reject budget too low', () => {
      const invalidData = {
        title: 'Education Initiative',
        description: 'A comprehensive education program for underprivileged children.',
        budget: 5000, // below minimum
        start_date: '2026-03-01',
        end_date: '2026-12-31',
        location: 'Karachi',
        city: 'Karachi',
        province: 'Sindh',
        sdg_goals: [4],
        focus_areas: ['education'],
        volunteer_capacity: 20,
      };
      
      const result = validateSchema(createProjectSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.budget).toContain('10,000');
    });

    it('should reject budget too high', () => {
      const invalidData = {
        title: 'Education Initiative',
        description: 'A comprehensive education program for underprivileged children.',
        budget: 200000000, // above maximum
        start_date: '2026-03-01',
        end_date: '2026-12-31',
        location: 'Karachi',
        city: 'Karachi',
        province: 'Sindh',
        sdg_goals: [4],
        focus_areas: ['education'],
        volunteer_capacity: 20,
      };
      
      const result = validateSchema(createProjectSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.budget).toBeTruthy();
    });

    it('should reject end date before start date', () => {
      const invalidData = {
        title: 'Education Initiative',
        description: 'A comprehensive education program for underprivileged children.',
        budget: 50000,
        start_date: '2026-12-31',
        end_date: '2026-03-01', // before start date
        location: 'Karachi',
        city: 'Karachi',
        province: 'Sindh',
        sdg_goals: [4],
        focus_areas: ['education'],
        volunteer_capacity: 20,
      };
      
      const result = validateSchema(createProjectSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.end_date).toContain('after start date');
    });

    it('should require at least one SDG goal', () => {
      const invalidData = {
        title: 'Education Initiative',
        description: 'A comprehensive education program for underprivileged children.',
        budget: 50000,
        start_date: '2026-03-01',
        end_date: '2026-12-31',
        location: 'Karachi',
        city: 'Karachi',
        province: 'Sindh',
        sdg_goals: [], // empty
        focus_areas: ['education'],
        volunteer_capacity: 20,
      };
      
      const result = validateSchema(createProjectSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.sdg_goals).toContain('at least one');
    });
  });

  describe('Application validation', () => {
    it('should validate correct application data', () => {
      const validData = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        cover_letter: 'I am very interested in this project because I have experience in education and want to contribute to the community. I believe my skills in teaching and mentoring would be valuable.',
        availability_notes: 'Available on weekends and evenings',
        skills_offered: ['teaching', 'mentoring'],
        hours_committed: 10,
      };
      
      const result = validateSchema(createVolunteerApplicationSchema, validData);
      
      expect(result.success).toBe(true);
    });

    it('should reject cover letter too short', () => {
      const invalidData = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        cover_letter: 'Short', // too short
        availability_notes: 'Available on weekends',
        skills_offered: ['teaching'],
        hours_committed: 10,
      };
      
      const result = validateSchema(createVolunteerApplicationSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.cover_letter).toContain('100 characters');
    });

    it('should reject invalid UUID', () => {
      const invalidData = {
        project_id: 'invalid-uuid',
        cover_letter: 'I am very interested in this project and want to contribute.',
        availability_notes: 'Available on weekends',
        skills_offered: ['teaching'],
        hours_committed: 10,
      };
      
      const result = validateSchema(createVolunteerApplicationSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.project_id).toBeTruthy();
    });

    it('should require at least one skill', () => {
      const invalidData = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        cover_letter: 'I am very interested in this project and want to contribute.',
        availability_notes: 'Available on weekends',
        skills_offered: [], // empty
        hours_committed: 10,
      };
      
      const result = validateSchema(createVolunteerApplicationSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.skills_offered).toContain('at least one');
    });

    it('should reject hours committed too high', () => {
      const invalidData = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        cover_letter: 'I am very interested in this project and want to contribute.',
        availability_notes: 'Available on weekends',
        skills_offered: ['teaching'],
        hours_committed: 50, // too high
      };
      
      const result = validateSchema(createVolunteerApplicationSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.hours_committed).toContain('40 hours');
    });
  });

  describe('Payment validation', () => {
    it('should validate correct payment data', () => {
      const validData = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 25000,
        invoice_url: 'https://example.com/invoice.pdf',
      };
      
      const result = validateSchema(createPaymentApprovalSchema, validData);
      
      expect(result.success).toBe(true);
    });

    it('should reject amount too low', () => {
      const invalidData = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 500, // below minimum
        invoice_url: 'https://example.com/invoice.pdf',
      };
      
      const result = validateSchema(createPaymentApprovalSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.amount).toContain('1,000');
    });

    it('should reject amount too high', () => {
      const invalidData = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 60000000, // above maximum
        invoice_url: 'https://example.com/invoice.pdf',
      };
      
      const result = validateSchema(createPaymentApprovalSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors?.amount).toBeTruthy();
    });
  });
});
