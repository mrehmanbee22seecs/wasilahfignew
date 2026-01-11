import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { createProjectSchema } from '../../../lib/validation/formSchemas';
import { ValidatedInput } from '../ValidatedInput';
import { ValidatedTextarea } from '../ValidatedTextarea';
import { ValidatedSelect } from '../ValidatedSelect';
import { SDGSelector } from '../SDGSelector';
import { MultiSelectChips } from '../MultiSelectChips';
import { FormButton } from '../FormButton';
import { FormError, FormWarning } from '../FormMessages';

interface CreateProjectFormProps {
  onSubmit: (data: any) => Promise<void>;
}

export function CreateProjectFormExample({ onSubmit }: CreateProjectFormProps) {
  const form = useForm(createProjectSchema, {
    initialValues: {
      title: '',
      description: '',
      budget: 50000,
      start_date: '',
      end_date: '',
      location: '',
      city: '',
      province: '',
      sdg_goals: [],
      focus_areas: [],
      volunteer_capacity: 10,
      requirements: '',
      benefits: '',
    },
    onSubmit,
    validateOnBlur: true,
  });

  const provinceOptions = [
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Sindh', label: 'Sindh' },
    { value: 'Khyber Pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
    { value: 'Balochistan', label: 'Balochistan' },
    { value: 'Gilgit-Baltistan', label: 'Gilgit-Baltistan' },
    { value: 'Azad Kashmir', label: 'Azad Kashmir' },
    { value: 'Islamabad Capital Territory', label: 'Islamabad Capital Territory' },
  ];

  const focusAreaOptions = [
    'Education', 'Healthcare', 'Environment', 'Poverty Alleviation',
    'Women Empowerment', 'Child Welfare', 'Community Development',
    'Clean Water', 'Renewable Energy', 'Disaster Relief'
  ];

  return (
    <form onSubmit={form.handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">Basic Information</h3>
        
        <ValidatedInput
          label="Project Title"
          name="title"
          value={form.values.title || ''}
          onChange={form.handleChange('title')}
          onBlur={form.handleBlur('title')}
          error={form.getFieldError('title')}
          touched={form.touched.title}
          required
          placeholder="e.g., Clean Water Initiative for Rural Communities"
          hint="5-200 characters"
        />

        <ValidatedTextarea
          label="Project Description"
          name="description"
          value={form.values.description || ''}
          onChange={form.handleChange('description')}
          onBlur={form.handleBlur('description')}
          error={form.getFieldError('description')}
          touched={form.touched.description}
          required
          rows={6}
          showCharCount
          maxLength={5000}
          hint="Minimum 50 characters - Describe the project goals, activities, and expected outcomes"
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">Budget & Timeline</h3>
        
        <ValidatedInput
          label="Total Budget (PKR)"
          type="number"
          name="budget"
          value={form.values.budget || ''}
          onChange={form.handleChange('budget')}
          onBlur={form.handleBlur('budget')}
          error={form.getFieldError('budget')}
          touched={form.touched.budget}
          required
          min="10000"
          max="100000000"
          hint="Minimum: PKR 10,000"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            label="Start Date"
            type="date"
            name="start_date"
            value={form.values.start_date || ''}
            onChange={form.handleChange('start_date')}
            onBlur={form.handleBlur('start_date')}
            error={form.getFieldError('start_date')}
            touched={form.touched.start_date}
            required
            min={new Date().toISOString().split('T')[0]}
          />

          <ValidatedInput
            label="End Date"
            type="date"
            name="end_date"
            value={form.values.end_date || ''}
            onChange={form.handleChange('end_date')}
            onBlur={form.handleBlur('end_date')}
            error={form.getFieldError('end_date')}
            touched={form.touched.end_date}
            required
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">Location</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedSelect
            label="Province"
            name="province"
            value={form.values.province || ''}
            onChange={form.handleChange('province')}
            onBlur={form.handleBlur('province')}
            error={form.getFieldError('province')}
            touched={form.touched.province}
            required
            options={provinceOptions}
          />

          <ValidatedInput
            label="City"
            name="city"
            value={form.values.city || ''}
            onChange={form.handleChange('city')}
            onBlur={form.handleBlur('city')}
            error={form.getFieldError('city')}
            touched={form.touched.city}
            required
            placeholder="e.g., Karachi, Lahore"
          />
        </div>

        <ValidatedInput
          label="Detailed Location"
          name="location"
          value={form.values.location || ''}
          onChange={form.handleChange('location')}
          onBlur={form.handleBlur('location')}
          error={form.getFieldError('location')}
          touched={form.touched.location}
          required
          placeholder="e.g., UC-14, Malir District"
          hint="Provide specific location details"
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">Impact & Focus</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            UN SDG Goals <span className="text-red-500">*</span>
          </label>
          <SDGSelector
            selectedGoals={form.values.sdg_goals || []}
            onChange={(goals) => form.setFieldValue('sdg_goals', goals)}
          />
          {form.getFieldError('sdg_goals') && form.touched.sdg_goals && (
            <p className="text-xs text-red-600 mt-1">{form.getFieldError('sdg_goals')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Focus Areas <span className="text-red-500">*</span>
          </label>
          <MultiSelectChips
            options={focusAreaOptions.map(area => ({ id: area, label: area }))}
            selectedIds={form.values.focus_areas || []}
            onChange={(areas) => form.setFieldValue('focus_areas', areas)}
            placeholder="Select focus areas"
          />
          {form.getFieldError('focus_areas') && form.touched.focus_areas && (
            <p className="text-xs text-red-600 mt-1">{form.getFieldError('focus_areas')}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">Volunteers</h3>
        
        <ValidatedInput
          label="Volunteer Capacity"
          type="number"
          name="volunteer_capacity"
          value={form.values.volunteer_capacity || ''}
          onChange={form.handleChange('volunteer_capacity')}
          onBlur={form.handleBlur('volunteer_capacity')}
          error={form.getFieldError('volunteer_capacity')}
          touched={form.touched.volunteer_capacity}
          required
          min="1"
          max="1000"
          hint="Number of volunteers needed"
        />

        <ValidatedTextarea
          label="Volunteer Requirements"
          name="requirements"
          value={form.values.requirements || ''}
          onChange={form.handleChange('requirements')}
          onBlur={form.handleBlur('requirements')}
          error={form.getFieldError('requirements')}
          touched={form.touched.requirements}
          rows={4}
          hint="Optional: Specific skills or qualifications needed"
          maxLength={1000}
        />

        <ValidatedTextarea
          label="Volunteer Benefits"
          name="benefits"
          value={form.values.benefits || ''}
          onChange={form.handleChange('benefits')}
          onBlur={form.handleBlur('benefits')}
          error={form.getFieldError('benefits')}
          touched={form.touched.benefits}
          rows={3}
          hint="Optional: What volunteers will gain (experience, certificates, etc.)"
          maxLength={500}
        />
      </div>

      {form.isDirty() && !form.hasErrors() && (
        <FormWarning message="You have unsaved changes. Make sure to submit the form to save your project." />
      )}

      {form.submitError && <FormError message={form.submitError} />}

      <div className="flex gap-3">
        <FormButton
          type="button"
          variant="secondary"
          onClick={() => {
            if (confirm('Are you sure you want to reset the form? All changes will be lost.')) {
              form.reset();
            }
          }}
        >
          Reset Form
        </FormButton>
        
        <FormButton
          type="submit"
          isLoading={form.isSubmitting}
          loadingText="Creating Project..."
          fullWidth
          disabled={!form.isDirty() || form.hasErrors()}
        >
          Create Project
        </FormButton>
      </div>
    </form>
  );
}
