import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { volunteerApplicationSchema } from '../../../lib/validation/formSchemas';
import { ValidatedInput } from '../ValidatedInput';
import { ValidatedTextarea } from '../ValidatedTextarea';
import { ValidatedCheckbox } from '../ValidatedCheckbox';
import { MultiSelectChips } from '../MultiSelectChips';
import { FormButton } from '../FormButton';
import { FormError } from '../FormMessages';

interface VolunteerApplicationFormProps {
  projectTitle: string;
  onSubmit: (data: any) => Promise<void>;
}

export function VolunteerApplicationFormExample({ projectTitle, onSubmit }: VolunteerApplicationFormProps) {
  const form = useForm(volunteerApplicationSchema, {
    initialValues: {
      motivation: '',
      availability_start: '',
      availability_end: '',
      hours_per_week: 10,
      skills: [],
      experience: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      agreed_to_terms: false,
    },
    onSubmit,
    validateOnBlur: true,
  });

  const skillOptions = [
    'Teaching', 'Healthcare', 'Technology', 'Construction',
    'Event Management', 'Communication', 'Leadership', 'Project Management'
  ];

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Apply for: {projectTitle}
        </h3>
      </div>

      <ValidatedTextarea
        label="Why do you want to volunteer for this project?"
        name="motivation"
        value={form.values.motivation || ''}
        onChange={form.handleChange('motivation')}
        onBlur={form.handleBlur('motivation')}
        error={form.getFieldError('motivation')}
        touched={form.touched.motivation}
        required
        rows={5}
        showCharCount
        maxLength={2000}
        hint="Minimum 100 characters"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ValidatedInput
          label="Available From"
          type="date"
          name="availability_start"
          value={form.values.availability_start || ''}
          onChange={form.handleChange('availability_start')}
          onBlur={form.handleBlur('availability_start')}
          error={form.getFieldError('availability_start')}
          touched={form.touched.availability_start}
          required
        />

        <ValidatedInput
          label="Available Until"
          type="date"
          name="availability_end"
          value={form.values.availability_end || ''}
          onChange={form.handleChange('availability_end')}
          onBlur={form.handleBlur('availability_end')}
          error={form.getFieldError('availability_end')}
          touched={form.touched.availability_end}
          required
        />
      </div>

      <ValidatedInput
        label="Hours Per Week"
        type="number"
        name="hours_per_week"
        value={form.values.hours_per_week || ''}
        onChange={form.handleChange('hours_per_week')}
        onBlur={form.handleBlur('hours_per_week')}
        error={form.getFieldError('hours_per_week')}
        touched={form.touched.hours_per_week}
        required
        min="1"
        max="40"
        hint="1-40 hours per week"
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Relevant Skills <span className="text-red-500">*</span>
        </label>
        <MultiSelectChips
          options={skillOptions}
          selectedIds={form.values.skills || []}
          onChange={(skills: string[]) => form.setFieldValue('skills', skills)}
          placeholder="Select your skills"
        />
        {form.getFieldError('skills') && form.touched.skills && (
          <p className="text-xs text-red-600 mt-1">{form.getFieldError('skills')}</p>
        )}
      </div>

      <ValidatedTextarea
        label="Relevant Experience"
        name="experience"
        value={form.values.experience || ''}
        onChange={form.handleChange('experience')}
        onBlur={form.handleBlur('experience')}
        error={form.getFieldError('experience')}
        touched={form.touched.experience}
        rows={3}
        hint="Optional: Describe any relevant experience"
        maxLength={1000}
      />

      <div className="border-t pt-6">
        <h4 className="font-medium text-slate-900 mb-4">Emergency Contact</h4>
        
        <div className="space-y-4">
          <ValidatedInput
            label="Contact Name"
            name="emergency_contact_name"
            value={form.values.emergency_contact_name || ''}
            onChange={form.handleChange('emergency_contact_name')}
            onBlur={form.handleBlur('emergency_contact_name')}
            error={form.getFieldError('emergency_contact_name')}
            touched={form.touched.emergency_contact_name}
            required
          />

          <ValidatedInput
            label="Contact Phone"
            type="tel"
            name="emergency_contact_phone"
            value={form.values.emergency_contact_phone || ''}
            onChange={form.handleChange('emergency_contact_phone')}
            onBlur={form.handleBlur('emergency_contact_phone')}
            error={form.getFieldError('emergency_contact_phone')}
            touched={form.touched.emergency_contact_phone}
            required
            placeholder="+92 300 1234567"
          />

          <ValidatedInput
            label="Relationship"
            name="emergency_contact_relationship"
            value={form.values.emergency_contact_relationship || ''}
            onChange={form.handleChange('emergency_contact_relationship')}
            onBlur={form.handleBlur('emergency_contact_relationship')}
            error={form.getFieldError('emergency_contact_relationship')}
            touched={form.touched.emergency_contact_relationship}
            required
            placeholder="e.g., Parent, Spouse, Sibling"
          />
        </div>
      </div>

      <ValidatedCheckbox
        label="I agree to the terms and conditions"
        name="agreed_to_terms"
        checked={form.values.agreed_to_terms || false}
        onChange={form.handleChange('agreed_to_terms')}
        error={form.getFieldError('agreed_to_terms')}
        touched={form.touched.agreed_to_terms}
        required
        description="You must agree to proceed with the application"
      />

      {form.submitError && <FormError message={form.submitError} />}

      <div className="flex gap-3">
        <FormButton
          type="button"
          variant="secondary"
          onClick={() => form.reset()}
        >
          Reset
        </FormButton>
        
        <FormButton
          type="submit"
          isLoading={form.isSubmitting}
          loadingText="Submitting..."
          fullWidth
        >
          Submit Application
        </FormButton>
      </div>
    </form>
  );
}
