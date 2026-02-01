/**
 * Certificate Download Button Component
 * 
 * UI component for downloading volunteer certificates
 * - Single certificate download
 * - Loading state with progress
 * - Error handling
 * - Template selection
 */

import { useState } from 'react';
import { Download, Award, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { useCertificates } from '../../hooks/useCertificates';
import { CertificateData, CertificateConfig } from '../../utils/certificateGenerator';

interface CertificateDownloadButtonProps {
  volunteerName: string;
  volunteerEmail?: string;
  projectName: string;
  organizationName: string;
  hours: number;
  startDate: string;
  endDate: string;
  skills?: string[];
  certificateNumber?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CertificateDownloadButton({
  volunteerName,
  projectName,
  organizationName,
  hours,
  startDate,
  endDate,
  skills,
  certificateNumber,
  className,
  variant = 'default',
  size = 'default',
}: CertificateDownloadButtonProps) {
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState<'professional' | 'modern' | 'classic'>('professional');
  const [isDownloading, setIsDownloading] = useState(false);
  const { generateSingleCertificate } = useCertificates();

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const certificateData: CertificateData = {
        volunteerName,
        projectName,
        organizationName,
        hours,
        startDate,
        endDate,
        skills,
        certificateNumber,
        issuedDate: new Date().toISOString(),
      };

      const config: CertificateConfig = {
        template,
        language: 'en',
      };

      await generateSingleCertificate(certificateData, config);
      setOpen(false);
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Award className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Certificate</DialogTitle>
          <DialogDescription>
            Generate a certificate of appreciation for {volunteerName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template">Certificate Template</Label>
            <Select
              value={template}
              onValueChange={(value: any) => setTemplate(value)}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">
                  Professional - Clean and formal design
                </SelectItem>
                <SelectItem value="modern">
                  Modern - Contemporary geometric style
                </SelectItem>
                <SelectItem value="classic">
                  Classic - Traditional ornate design
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Volunteer:</strong> {volunteerName}</p>
            <p><strong>Project:</strong> {projectName}</p>
            <p><strong>Organization:</strong> {organizationName}</p>
            <p><strong>Hours:</strong> {hours} hours</p>
            <p><strong>Period:</strong> {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</p>
            {skills && skills.length > 0 && (
              <p><strong>Skills:</strong> {skills.join(', ')}</p>
            )}
          </div>

          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate & Download
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
