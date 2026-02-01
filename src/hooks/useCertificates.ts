/**
 * Certificate Management Hook
 * 
 * Custom React hook for managing volunteer certificates:
 * - Generate individual certificates
 * - Batch certificate generation
 * - Download certificates
 * - Certificate history tracking
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  CertificateData,
  CertificateConfig,
  downloadCertificate,
  generateCertificateNumber,
  downloadBatchCertificates,
} from '../utils/certificateGenerator';

export interface CertificateJob {
  id: string;
  volunteerId: string;
  volunteerName: string;
  projectName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
  certificateNumber?: string;
}

/**
 * Hook for certificate operations
 */
export function useCertificates() {
  const [certificateHistory, setCertificateHistory] = useState<CertificateJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generate and download a single certificate
   */
  const generateSingleCertificate = useCallback(
    async (
      data: CertificateData,
      config?: CertificateConfig
    ): Promise<CertificateJob> => {
      setIsGenerating(true);

      const job: CertificateJob = {
        id: `CERT-${Date.now()}`,
        volunteerId: data.volunteerName, // Should be actual ID in production
        volunteerName: data.volunteerName,
        projectName: data.projectName,
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      // Add to history
      setCertificateHistory((prev) => [job, ...prev]);

      try {
        // Update status
        job.status = 'processing';
        job.progress = 25;
        setCertificateHistory((prev) =>
          prev.map((j) => (j.id === job.id ? { ...job } : j))
        );

        // Generate certificate number if not provided
        if (!data.certificateNumber) {
          data.certificateNumber = generateCertificateNumber(
            data.volunteerName,
            data.projectName
          );
        }
        job.certificateNumber = data.certificateNumber;

        // Progress update
        job.progress = 50;
        setCertificateHistory((prev) =>
          prev.map((j) => (j.id === job.id ? { ...job } : j))
        );

        // Generate and download certificate
        await downloadCertificate(data, config);

        // Progress update
        job.progress = 90;
        setCertificateHistory((prev) =>
          prev.map((j) => (j.id === job.id ? { ...job } : j))
        );

        // Complete the job
        job.status = 'completed';
        job.progress = 100;
        job.completedAt = new Date().toISOString();

        setCertificateHistory((prev) =>
          prev.map((j) => (j.id === job.id ? { ...job } : j))
        );

        toast.success(`Certificate generated for ${data.volunteerName}!`);
        setIsGenerating(false);

        return job;
      } catch (error) {
        job.status = 'failed';
        job.error = error instanceof Error ? error.message : 'Certificate generation failed';
        job.completedAt = new Date().toISOString();

        setCertificateHistory((prev) =>
          prev.map((j) => (j.id === job.id ? { ...job } : j))
        );

        toast.error(`Failed to generate certificate: ${job.error}`);
        setIsGenerating(false);

        throw error;
      }
    },
    []
  );

  /**
   * Generate batch certificates
   */
  const generateBatchCertificates = useCallback(
    async (
      certificates: CertificateData[],
      config?: CertificateConfig,
      outputFormat: 'individual' | 'merged' = 'individual'
    ): Promise<void> => {
      setIsGenerating(true);

      try {
        toast.info(`Generating ${certificates.length} certificates...`);

        // Generate certificate numbers for all
        certificates.forEach((cert) => {
          if (!cert.certificateNumber) {
            cert.certificateNumber = generateCertificateNumber(
              cert.volunteerName,
              cert.projectName
            );
          }
        });

        // Generate batch
        await downloadBatchCertificates({
          certificates,
          config,
          outputFormat,
        });

        // Add all to history
        const jobs: CertificateJob[] = certificates.map((cert) => ({
          id: `CERT-${Date.now()}-${cert.volunteerName}`,
          volunteerId: cert.volunteerName,
          volunteerName: cert.volunteerName,
          projectName: cert.projectName,
          status: 'completed',
          progress: 100,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          certificateNumber: cert.certificateNumber,
        }));

        setCertificateHistory((prev) => [...jobs, ...prev]);

        toast.success(`Successfully generated ${certificates.length} certificates!`);
        setIsGenerating(false);
      } catch (error) {
        toast.error(
          `Batch certificate generation failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
        setIsGenerating(false);
        throw error;
      }
    },
    []
  );

  /**
   * Clear certificate history
   */
  const clearHistory = useCallback(() => {
    setCertificateHistory([]);
    toast.info('Certificate history cleared');
  }, []);

  /**
   * Get certificate by ID
   */
  const getCertificateById = useCallback(
    (id: string): CertificateJob | undefined => {
      return certificateHistory.find((cert) => cert.id === id);
    },
    [certificateHistory]
  );

  return {
    certificateHistory,
    isGenerating,
    generateSingleCertificate,
    generateBatchCertificates,
    clearHistory,
    getCertificateById,
  };
}
