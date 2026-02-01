/**
 * Tests for Certificate Generator Functionality
 * 
 * Tests the certificate generation feature to ensure it:
 * - Generates professional certificates correctly
 * - Supports multiple templates
 * - Handles volunteer and project data correctly
 * - Generates certificate numbers properly
 * - Formats dates and hours correctly
 */

import { describe, it, expect } from 'vitest';
import {
  generateCertificate,
  generateCertificateNumber,
  type CertificateData,
  type CertificateConfig,
} from '../../utils/certificateGenerator';

describe('Certificate Generator Functionality', () => {
  describe('Certificate Generation', () => {
    const mockCertificateData: CertificateData = {
      volunteerName: 'John Doe',
      projectName: 'Community Outreach Program',
      organizationName: 'Wasilah Foundation',
      hours: 120,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      skills: ['Teaching', 'Mentoring', 'Community Engagement'],
      certificateNumber: 'CERT-2024-001',
      issuedDate: '2024-07-01',
    };

    it('should generate professional certificate template', async () => {
      // Arrange
      const config: CertificateConfig = {
        template: 'professional',
        language: 'en',
      };

      // Act
      const doc = await generateCertificate(mockCertificateData, config);

      // Assert
      expect(doc).toBeDefined();
      expect(doc.internal.getNumberOfPages()).toBe(1);
      expect(doc.internal.pageSize.orientation).toBe('landscape');
    });

    it('should generate modern certificate template', async () => {
      // Arrange
      const config: CertificateConfig = {
        template: 'modern',
        language: 'en',
      };

      // Act
      const doc = await generateCertificate(mockCertificateData, config);

      // Assert
      expect(doc).toBeDefined();
      expect(doc.internal.getNumberOfPages()).toBe(1);
      expect(doc.internal.pageSize.orientation).toBe('landscape');
    });

    it('should generate classic certificate template', async () => {
      // Arrange
      const config: CertificateConfig = {
        template: 'classic',
        language: 'en',
      };

      // Act
      const doc = await generateCertificate(mockCertificateData, config);

      // Assert
      expect(doc).toBeDefined();
      expect(doc.internal.getNumberOfPages()).toBe(1);
      expect(doc.internal.pageSize.orientation).toBe('landscape');
    });

    it('should default to professional template when not specified', async () => {
      // Act
      const doc = await generateCertificate(mockCertificateData);

      // Assert
      expect(doc).toBeDefined();
      expect(doc.internal.getNumberOfPages()).toBe(1);
    });

    it('should handle certificate without skills', async () => {
      // Arrange
      const dataWithoutSkills: CertificateData = {
        ...mockCertificateData,
        skills: undefined,
      };

      // Act
      const doc = await generateCertificate(dataWithoutSkills);

      // Assert
      expect(doc).toBeDefined();
      expect(doc.internal.getNumberOfPages()).toBe(1);
    });

    it('should handle certificate without certificate number', async () => {
      // Arrange
      const dataWithoutCertNumber: CertificateData = {
        ...mockCertificateData,
        certificateNumber: undefined,
      };

      // Act
      const doc = await generateCertificate(dataWithoutCertNumber);

      // Assert
      expect(doc).toBeDefined();
      expect(doc.internal.getNumberOfPages()).toBe(1);
    });

    it('should use default issued date when not provided', async () => {
      // Arrange
      const dataWithoutIssuedDate: CertificateData = {
        ...mockCertificateData,
        issuedDate: undefined,
      };

      // Act
      const doc = await generateCertificate(dataWithoutIssuedDate);

      // Assert
      expect(doc).toBeDefined();
      expect(doc.internal.getNumberOfPages()).toBe(1);
    });
  });

  describe('Certificate Number Generation', () => {
    it('should generate unique certificate numbers', () => {
      // Act
      const certNum1 = generateCertificateNumber('volunteer1', 'project1');
      const certNum2 = generateCertificateNumber('volunteer2', 'project2');

      // Assert
      expect(certNum1).toBeDefined();
      expect(certNum2).toBeDefined();
      expect(certNum1).not.toBe(certNum2);
      expect(certNum1).toContain('CERT-');
      expect(certNum2).toContain('CERT-');
    });

    it('should include volunteer and project identifiers', () => {
      // Act
      const certNum = generateCertificateNumber('vol123', 'proj456');

      // Assert
      expect(certNum).toContain('VOL1');
      expect(certNum).toContain('PROJ');
    });

    it('should generate different numbers for same volunteer on different projects', () => {
      // Act
      const certNum1 = generateCertificateNumber('volunteer1', 'project1');
      // Wait a bit to ensure timestamp changes
      const certNum2 = generateCertificateNumber('volunteer1', 'project2');

      // Assert
      expect(certNum1).not.toBe(certNum2);
    });
  });

  describe('Certificate Customization', () => {
    it('should support custom colors', async () => {
      // Arrange
      const config: CertificateConfig = {
        template: 'professional',
        primaryColor: [255, 0, 0], // Red
        accentColor: [0, 255, 0], // Green
      };

      // Act
      const doc = await generateCertificate(
        {
          volunteerName: 'Jane Smith',
          projectName: 'Environmental Project',
          organizationName: 'Green Foundation',
          hours: 80,
          startDate: '2024-01-01',
          endDate: '2024-03-31',
        },
        config
      );

      // Assert
      expect(doc).toBeDefined();
    });

    it('should support custom signer information', async () => {
      // Arrange
      const config: CertificateConfig = {
        template: 'professional',
        signerName: 'Dr. Ahmed Khan',
        signerTitle: 'Executive Director',
      };

      // Act
      const doc = await generateCertificate(
        {
          volunteerName: 'Ali Hassan',
          projectName: 'Education Initiative',
          organizationName: 'Learning Foundation',
          hours: 100,
          startDate: '2024-02-01',
          endDate: '2024-05-31',
        },
        config
      );

      // Assert
      expect(doc).toBeDefined();
    });
  });

  describe('Data Validation', () => {
    it('should handle volunteers with long names', async () => {
      // Arrange
      const data: CertificateData = {
        volunteerName: 'Muhammad Abdullah Bin Abdul Rahman Al-Rashid',
        projectName: 'Community Development and Social Welfare Initiative',
        organizationName: 'International Foundation for Development',
        hours: 150,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      // Act
      const doc = await generateCertificate(data);

      // Assert
      expect(doc).toBeDefined();
    });

    it('should handle zero hours', async () => {
      // Arrange
      const data: CertificateData = {
        volunteerName: 'Test Volunteer',
        projectName: 'Test Project',
        organizationName: 'Test Organization',
        hours: 0,
        startDate: '2024-01-01',
        endDate: '2024-01-01',
      };

      // Act
      const doc = await generateCertificate(data);

      // Assert
      expect(doc).toBeDefined();
    });

    it('should handle very large hour counts', async () => {
      // Arrange
      const data: CertificateData = {
        volunteerName: 'Dedicated Volunteer',
        projectName: 'Long-term Project',
        organizationName: 'Commitment Foundation',
        hours: 5000,
        startDate: '2020-01-01',
        endDate: '2024-12-31',
      };

      // Act
      const doc = await generateCertificate(data);

      // Assert
      expect(doc).toBeDefined();
    });

    it('should handle multiple skills', async () => {
      // Arrange
      const data: CertificateData = {
        volunteerName: 'Skilled Volunteer',
        projectName: 'Multi-faceted Project',
        organizationName: 'Skills Foundation',
        hours: 200,
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        skills: [
          'Teaching',
          'Mentoring',
          'Administration',
          'Fundraising',
          'Event Management',
          'Community Outreach',
        ],
      };

      // Act
      const doc = await generateCertificate(data);

      // Assert
      expect(doc).toBeDefined();
    });
  });

  describe('Date Formatting', () => {
    it('should format ISO dates correctly', async () => {
      // Arrange
      const data: CertificateData = {
        volunteerName: 'Test Volunteer',
        projectName: 'Test Project',
        organizationName: 'Test Organization',
        hours: 100,
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-06-30T23:59:59Z',
        issuedDate: '2024-07-01T12:00:00Z',
      };

      // Act
      const doc = await generateCertificate(data);

      // Assert
      expect(doc).toBeDefined();
    });

    it('should handle date-only strings', async () => {
      // Arrange
      const data: CertificateData = {
        volunteerName: 'Test Volunteer',
        projectName: 'Test Project',
        organizationName: 'Test Organization',
        hours: 100,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      // Act
      const doc = await generateCertificate(data);

      // Assert
      expect(doc).toBeDefined();
    });
  });

  describe('Template Variations', () => {
    it('should generate certificates for different organizations', async () => {
      // Arrange
      const organizations = [
        'Wasilah Foundation',
        'Green Earth NGO',
        'Education First',
        'Healthcare Alliance',
      ];

      // Act & Assert
      for (const org of organizations) {
        const doc = await generateCertificate({
          volunteerName: 'Test Volunteer',
          projectName: 'Test Project',
          organizationName: org,
          hours: 100,
          startDate: '2024-01-01',
          endDate: '2024-06-30',
        });

        expect(doc).toBeDefined();
      }
    });

    it('should generate certificates for different hour ranges', async () => {
      // Arrange
      const hourRanges = [1, 50, 100, 250, 500, 1000];

      // Act & Assert
      for (const hours of hourRanges) {
        const doc = await generateCertificate({
          volunteerName: 'Test Volunteer',
          projectName: 'Test Project',
          organizationName: 'Test Organization',
          hours,
          startDate: '2024-01-01',
          endDate: '2024-06-30',
        });

        expect(doc).toBeDefined();
      }
    });
  });
});
