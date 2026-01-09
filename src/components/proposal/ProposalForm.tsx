import React, { useState } from 'react';
import { Loader, Send } from 'lucide-react';
import { FormInput } from '../forms/FormInput';
import { FormSelect } from '../forms/FormSelect';
import { FormTextarea } from '../forms/FormTextarea';
import { FormCheckbox } from '../forms/FormCheckbox';
import { MultiSelectChips } from '../forms/MultiSelectChips';
import { SDGSelector } from '../forms/SDGSelector';
import { FileUploader } from '../forms/FileUploader';
import { ProposalSuccessCard } from './ProposalSuccessCard';
import {
  ProposalFormData,
  ProposalFormErrors,
  initialFormData,
  roleOptions,
  budgetOptions,
  serviceOptions,
  validateForm,
  trackAnalytics
} from './ProposalFormData';

interface ProposalFormProps {
  prefillService?: string;
  onSubmitSuccess?: () => void;
  compact?: boolean;
}

export function ProposalForm({ prefillService, onSubmitSuccess, compact = false }: ProposalFormProps) {
  const [formData, setFormData] = useState<ProposalFormData>({
    ...initialFormData,
    services: prefillService ? [prefillService] : []
  });
  const [errors, setErrors] = useState<ProposalFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateField = <K extends keyof ProposalFormData>(
    field: K,
    value: ProposalFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof ProposalFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Track attempt
    trackAnalytics('proposal_submit_attempt', {
      companyName: formData.companyName,
      servicesSelectedCount: formData.services.length,
      from: compact ? 'modal' : 'page'
    });

    // Validate
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, this would be:
      // const response = await fetch('/api/proposals', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     referrerUrl: window.location.href,
      //     utm: getUTMParams()
      //   })
      // });

      // Track success
      trackAnalytics('proposal_submitted', {
        companyName: formData.companyName,
        role: formData.role,
        budgetRange: formData.budgetRange,
        services: formData.services,
        sdgCount: formData.preferredSDGs.length
      });

      setIsSuccess(true);
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      trackAnalytics('proposal_submit_error', {
        errorCode: 'unknown'
      });
      setErrors({ companyName: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <ProposalSuccessCard companyName={formData.companyName} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Name */}
      <FormInput
        label="Company / Organization Name"
        name="companyName"
        value={formData.companyName}
        onChange={(value) => updateField('companyName', value)}
        placeholder="Acme Ltd."
        required
        error={errors.companyName}
        maxLength={100}
      />

      {/* Contact Name */}
      <FormInput
        label="Your Name"
        name="contactName"
        value={formData.contactName}
        onChange={(value) => updateField('contactName', value)}
        placeholder="Ayesha Khan"
        required
        error={errors.contactName}
        maxLength={50}
      />

      {/* Email */}
      <FormInput
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={(value) => updateField('email', value)}
        placeholder="name@company.com"
        required
        error={errors.email}
      />

      {/* Phone */}
      <FormInput
        label="Phone Number"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={(value) => updateField('phone', value)}
        placeholder="+92 300 0000000"
        error={errors.phone}
      />

      {/* Role */}
      <FormSelect
        label="I represent a"
        name="role"
        value={formData.role}
        onChange={(value) => updateField('role', value)}
        options={roleOptions}
        placeholder="Select your role"
        required
        error={errors.role}
      />

      {/* Budget Range */}
      <FormSelect
        label="Approximate Budget Range"
        name="budgetRange"
        value={formData.budgetRange}
        onChange={(value) => updateField('budgetRange', value)}
        options={budgetOptions}
        placeholder="Select budget range"
        required
        error={errors.budgetRange}
      />

      {/* Services */}
      <MultiSelectChips
        label="Services Interested In"
        name="services"
        options={serviceOptions}
        selected={formData.services}
        onChange={(value) => updateField('services', value)}
        hint="Pick 1–3 services you're most interested in"
        maxSelections={5}
      />

      {/* SDGs */}
      <SDGSelector
        label="Preferred SDGs (Optional)"
        selected={formData.preferredSDGs}
        onChange={(value) => updateField('preferredSDGs', value)}
        hint="Select the UN Sustainable Development Goals you want to focus on"
      />

      {/* Message */}
      <FormTextarea
        label="Your Brief / Goals / Timeline (Optional)"
        name="message"
        value={formData.message}
        onChange={(value) => updateField('message', value)}
        placeholder="Tell us your brief, goals, timeline..."
        maxLength={1000}
        rows={5}
        error={errors.message}
      />

      {/* File Uploader */}
      <FileUploader
        label="Attachments (Optional)"
        name="attachments"
        files={formData.attachments}
        onChange={(value) => updateField('attachments', value)}
        maxFiles={5}
        maxSizePerFile={5}
        maxTotalSize={10}
        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.mp4"
        hint="Upload any relevant documents, briefs, or media (PDF, DOCX, JPG, PNG, MP4)"
      />

      {/* Consent */}
      <FormCheckbox
        label={
          <span>
            I consent to Wasilah contacting me about this request.{' '}
            <a href="/privacy" className="text-teal-600 hover:underline">
              Privacy Policy
            </a>
          </span>
        }
        name="consent"
        checked={formData.consent}
        onChange={(value) => updateField('consent', value)}
        required
        error={errors.consent}
      />

      {/* Honeypot (hidden) */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={(e) => updateField('website', e.target.value)}
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Request
          </>
        )}
      </button>

      {/* Privacy Note */}
      <p className="text-slate-600 text-sm text-center">
        We typically respond within 48 hours. Your information is kept confidential.
      </p>
    </form>
  );
}
