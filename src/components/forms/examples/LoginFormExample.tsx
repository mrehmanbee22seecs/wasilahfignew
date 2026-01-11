import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { loginSchema } from '../../../lib/validation/formSchemas';
import { ValidatedInput } from '../ValidatedInput';
import { ValidatedCheckbox } from '../ValidatedCheckbox';
import { FormButton } from '../FormButton';
import { FormError } from '../FormMessages';

interface LoginFormExampleProps {
  onSubmit: (data: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
}

export function LoginFormExample({ onSubmit }: LoginFormExampleProps) {
  const form = useForm(loginSchema, {
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit,
    validateOnBlur: true,
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      <ValidatedInput
        label="Email Address"
        type="email"
        name="email"
        value={form.values.email || ''}
        onChange={form.handleChange('email')}
        onBlur={form.handleBlur('email')}
        error={form.getFieldError('email')}
        touched={form.touched.email}
        required
        placeholder="you@example.com"
      />

      <ValidatedInput
        label="Password"
        type="password"
        name="password"
        value={form.values.password || ''}
        onChange={form.handleChange('password')}
        onBlur={form.handleBlur('password')}
        error={form.getFieldError('password')}
        touched={form.touched.password}
        required
        placeholder="••••••••"
      />

      <ValidatedCheckbox
        label="Remember me"
        name="rememberMe"
        checked={form.values.rememberMe || false}
        onChange={form.handleChange('rememberMe')}
        description="Stay logged in for 30 days"
      />

      {form.submitError && <FormError message={form.submitError} />}

      <FormButton
        type="submit"
        isLoading={form.isSubmitting}
        loadingText="Signing in..."
        fullWidth
      >
        Sign In
      </FormButton>
    </form>
  );
}
