# PDF Export API Documentation

## Overview

The Wasilah platform now supports production-ready PDF export for all major reports and automatic certificate generation for volunteers. This document provides comprehensive API documentation for developers.

## Table of Contents

1. [PDF Report Export](#pdf-report-export)
2. [Certificate Generation](#certificate-generation)
3. [Configuration Options](#configuration-options)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)

## PDF Report Export

### Basic Usage

```typescript
import { exportPDFToDownload, prepareEntityPDFTables } from '@/utils/pdfExport';

// Prepare data for PDF
const tables = prepareEntityPDFTables('projects', projectsData);

// Generate and download PDF
await exportPDFToDownload({
  title: 'Projects Report',
  subtitle: 'Q1 2024',
  tables,
  filename: 'projects_q1_2024.pdf',
  creator: 'Admin User',
  includeMetadata: true,
  orientation: 'portrait',
});
```

### API Reference

#### `createPDFDocument(options: PDFExportOptions): Promise<jsPDF>`

Creates a PDF document with professional formatting.

**Parameters:**

```typescript
interface PDFExportOptions {
  title: string;                    // Main document title
  subtitle?: string;                // Optional subtitle
  tables: PDFTableConfig[];         // Array of tables to include
  filename: string;                 // Output filename
  creator?: string;                 // Document creator name
  includeMetadata?: boolean;        // Include metadata page
  orientation?: 'portrait' | 'landscape';  // Page orientation
}
```

**Returns:** `Promise<jsPDF>` - The generated PDF document object

**Example:**

```typescript
const doc = await createPDFDocument({
  title: 'Monthly Report',
  subtitle: 'January 2024',
  tables: [{
    title: 'Active Projects',
    data: projectsArray,
    columns: [
      { header: 'Name', dataKey: 'name' },
      { header: 'Budget', dataKey: 'budget' },
    ],
  }],
  filename: 'report.pdf',
  orientation: 'landscape',
});
```

#### `prepareEntityPDFTables(entityType, data, config?): PDFTableConfig[]`

Prepares entity-specific PDF tables with appropriate columns and summaries.

**Supported Entity Types:**

- `projects` - Project reports with budget and beneficiaries
- `volunteers` - Volunteer reports with hours and skills
- `payments` - Payment reports with amounts and status
- `ngos` - Organization reports with projects and volunteers
- `opportunities` - Volunteer opportunity listings
- `audit_logs` - System audit logs

**Parameters:**

```typescript
type ExportEntityType = 'projects' | 'volunteers' | 'payments' | 'ngos' | 
                        'opportunities' | 'audit_logs' | 'cases' | 'users' | 'custom';

function prepareEntityPDFTables(
  entityType: ExportEntityType,
  data: any[],
  config?: ExportConfig
): PDFTableConfig[]
```

**Example:**

```typescript
// Prepare projects PDF tables
const tables = prepareEntityPDFTables('projects', projectsData, {
  format: 'pdf',
  entityType: 'projects',
  includeColumns: ['name', 'budget', 'status', 'beneficiaries'],
  filters: { status: ['Active'] },
});
```

#### `exportPDFToDownload(options: PDFExportOptions): Promise<void>`

Generates PDF and triggers browser download.

**Example:**

```typescript
await exportPDFToDownload({
  title: 'Volunteer Directory',
  tables: volunteerTables,
  filename: 'volunteers_2024.pdf',
  includeMetadata: true,
});
```

### Table Configuration

```typescript
interface PDFTableConfig {
  title: string;                    // Table title
  data: any[];                      // Array of data objects
  columns: PDFColumnConfig[];       // Column definitions
  includeSummary?: boolean;         // Include summary section
  summaryData?: Record<string, any>; // Summary metrics
}

interface PDFColumnConfig {
  header: string;                   // Column header text
  dataKey: string;                  // Key in data object
  width?: number;                   // Column width (optional)
}
```

### Entity-Specific Features

#### Projects

```typescript
const tables = prepareEntityPDFTables('projects', projectsData);
// Includes:
// - Project name, NGO, category, budget, status, beneficiaries
// - Summary: Total projects, total budget, total beneficiaries, active projects
```

#### Volunteers

```typescript
const tables = prepareEntityPDFTables('volunteers', volunteersData);
// Includes:
// - Name, email, skills, total hours, projects completed, status
// - Summary: Total volunteers, total hours, active volunteers, avg hours
```

#### Payments

```typescript
const tables = prepareEntityPDFTables('payments', paymentsData);
// Includes:
// - Project, NGO, amount, status, date, milestone
// - Summary: Total payments, total amount, completed, pending
```

#### Organizations (NGOs)

```typescript
const tables = prepareEntityPDFTables('ngos', ngosData);
// Includes:
// - Organization, category, status, projects, volunteers, email
// - Summary: Total organizations, verified, total projects, total volunteers
```

### Styling and Formatting

PDFs automatically include:

- **Headers**: Professional header with branding and logo
- **Tables**: Striped rows for readability
- **Summary**: Key metrics in highlighted section
- **Footer**: Page numbers and metadata
- **Colors**: Wasilah brand colors (customizable)

### Integration with Exports Hook

```typescript
import { useExports } from '@/hooks/useExports';

function MyComponent() {
  const { createExport } = useExports();

  const handlePDFExport = async () => {
    await createExport({
      format: 'pdf',
      entityType: 'projects',
      includeColumns: ['name', 'budget', 'status'],
      filters: { status: ['Active'] },
      includeMetadata: true,
    });
  };

  return <button onClick={handlePDFExport}>Export PDF</button>;
}
```

## Certificate Generation

### Basic Usage

```typescript
import { 
  downloadCertificate, 
  generateCertificateNumber 
} from '@/utils/certificateGenerator';

// Generate certificate
await downloadCertificate({
  volunteerName: 'John Doe',
  projectName: 'Community Outreach',
  organizationName: 'Wasilah Foundation',
  hours: 120,
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  skills: ['Teaching', 'Mentoring'],
  certificateNumber: generateCertificateNumber('vol123', 'proj456'),
}, {
  template: 'professional',
  signerName: 'Dr. Ahmed Khan',
  signerTitle: 'Executive Director',
});
```

### API Reference

#### `generateCertificate(data, config?): Promise<jsPDF>`

Generates a certificate PDF document.

**Parameters:**

```typescript
interface CertificateData {
  volunteerName: string;           // Volunteer's full name
  projectName: string;             // Project name
  organizationName: string;        // Issuing organization
  hours: number;                   // Total volunteer hours
  startDate: string;               // Start date (ISO or formatted)
  endDate: string;                 // End date (ISO or formatted)
  skills?: string[];               // Skills demonstrated
  certificateNumber?: string;      // Unique certificate number
  issuedDate?: string;             // Issue date (defaults to now)
}

interface CertificateConfig {
  template?: 'professional' | 'modern' | 'classic';  // Template style
  language?: 'en' | 'ur';          // Language (English/Urdu)
  organizationLogo?: string;       // Base64 logo image
  signerName?: string;             // Signer's name
  signerTitle?: string;            // Signer's title
  signerSignature?: string;        // Base64 signature image
  primaryColor?: [number, number, number];   // RGB primary color
  accentColor?: [number, number, number];    // RGB accent color
}
```

**Returns:** `Promise<jsPDF>` - The generated certificate document

#### Certificate Templates

##### Professional Template

- Clean, formal design
- Wasilah branding with logo
- Decorative border
- Signature section with date
- Certificate number at bottom
- Best for: Official certificates, formal recognition

##### Modern Template

- Contemporary geometric style
- Minimalist design
- Bold typography
- Triangle accents
- Best for: Tech-focused projects, modern organizations

##### Classic Template

- Traditional ornate design
- Gold decorative elements
- Multiple borders
- Formal typography
- Best for: Long-term achievements, special recognition

#### `downloadCertificate(data, config?): Promise<void>`

Generates and downloads a single certificate.

**Example:**

```typescript
await downloadCertificate({
  volunteerName: 'Sarah Ahmed',
  projectName: 'Education Initiative',
  organizationName: 'Learning Foundation',
  hours: 200,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  skills: ['Teaching', 'Curriculum Development'],
}, {
  template: 'classic',
  signerName: 'Dr. Fatima Ali',
  signerTitle: 'Program Director',
});
```

#### `generateCertificateNumber(volunteerId, projectId): string`

Generates a unique certificate number.

**Example:**

```typescript
const certNum = generateCertificateNumber('vol-12345', 'proj-67890');
// Returns: "CERT-VOL1-PROJ-<timestamp>"
```

#### `downloadBatchCertificates(options): Promise<void>`

Generates multiple certificates in batch.

**Parameters:**

```typescript
interface BatchCertificateOptions {
  certificates: CertificateData[];
  config?: CertificateConfig;
  outputFormat?: 'individual' | 'merged';
}
```

**Example:**

```typescript
await downloadBatchCertificates({
  certificates: [
    {
      volunteerName: 'John Doe',
      projectName: 'Project A',
      organizationName: 'Wasilah',
      hours: 100,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
    },
    {
      volunteerName: 'Jane Smith',
      projectName: 'Project B',
      organizationName: 'Wasilah',
      hours: 150,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
    },
  ],
  outputFormat: 'merged', // or 'individual'
  config: {
    template: 'professional',
    signerName: 'Director',
  },
});
```

### Integration with React Hooks

```typescript
import { useCertificates } from '@/hooks/useCertificates';

function VolunteerProfile({ volunteer }) {
  const { generateSingleCertificate, isGenerating } = useCertificates();

  const handleGenerateCertificate = async () => {
    await generateSingleCertificate({
      volunteerName: volunteer.name,
      projectName: volunteer.currentProject,
      organizationName: 'Wasilah Foundation',
      hours: volunteer.totalHours,
      startDate: volunteer.startDate,
      endDate: new Date().toISOString(),
    }, {
      template: 'professional',
    });
  };

  return (
    <button 
      onClick={handleGenerateCertificate} 
      disabled={isGenerating}
    >
      {isGenerating ? 'Generating...' : 'Download Certificate'}
    </button>
  );
}
```

### React Component

```typescript
import { CertificateDownloadButton } from '@/components/certificates/CertificateDownloadButton';

<CertificateDownloadButton
  volunteerName="John Doe"
  projectName="Community Project"
  organizationName="Wasilah Foundation"
  hours={120}
  startDate="2024-01-01"
  endDate="2024-06-30"
  skills={['Teaching', 'Mentoring']}
  variant="default"
  size="default"
/>
```

## Configuration Options

### Customizing Colors

```typescript
const config: CertificateConfig = {
  primaryColor: [3, 105, 161],    // Wasilah blue (default)
  accentColor: [219, 234, 254],   // Light blue (default)
};
```

### Adding Organization Branding

```typescript
// Convert logo to base64
const logoBase64 = 'data:image/png;base64,iVBORw0KGg...';

const config: CertificateConfig = {
  organizationLogo: logoBase64,
  signerSignature: signatureBase64,
  signerName: 'CEO Name',
  signerTitle: 'Chief Executive Officer',
};
```

### Multiple Language Support

```typescript
const config: CertificateConfig = {
  language: 'ur',  // Urdu (planned feature)
};
```

## Best Practices

### Performance

1. **Batch Operations**: Use batch generation for multiple certificates
2. **Data Filtering**: Filter data before PDF generation to reduce size
3. **Pagination**: For large reports (>10,000 rows), use pagination

### File Naming

```typescript
// Good: Descriptive with timestamp
const filename = `volunteers_${new Date().toISOString().split('T')[0]}.pdf`;

// Better: Include entity type and filters
const filename = `active_volunteers_karachi_2024-02-01.pdf`;
```

### Error Handling

```typescript
try {
  await exportPDFToDownload(options);
  toast.success('PDF generated successfully!');
} catch (error) {
  console.error('PDF generation failed:', error);
  toast.error(`Failed to generate PDF: ${error.message}`);
}
```

### Certificate Validation

```typescript
// Validate hours before certificate generation
if (volunteer.totalHours < 1) {
  toast.error('Volunteer must complete at least 1 hour to receive certificate');
  return;
}

// Validate project completion
if (!volunteer.projectCompleted) {
  toast.warning('Certificate can only be issued after project completion');
  return;
}
```

## Troubleshooting

### Common Issues

#### PDFs are blank

**Cause**: Data array is empty
**Solution**: Verify data is fetched before PDF generation

```typescript
if (data.length === 0) {
  toast.error('No data available for export');
  return;
}
```

#### Certificate names are cut off

**Cause**: Very long names exceed page width
**Solution**: Names are automatically wrapped (handled in library)

#### File doesn't download

**Cause**: Browser popup blocker
**Solution**: Ensure PDF generation is triggered by user action (button click)

#### PDF opens with wrong orientation

**Cause**: Orientation not specified
**Solution**: Set orientation explicitly

```typescript
await exportPDFToDownload({
  ...options,
  orientation: 'landscape', // or 'portrait'
});
```

### Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Recommended |
| Firefox 88+ | ✅ Full | Recommended |
| Safari 14+ | ✅ Full | - |
| Edge 90+ | ✅ Full | - |
| IE 11 | ❌ No | Not supported |

### PDF Viewers

- ✅ Adobe Acrobat Reader
- ✅ Browser built-in PDF viewer
- ✅ Preview (macOS)
- ✅ Foxit Reader
- ✅ PDF-XChange Viewer

## API Endpoints

The PDF generation happens client-side using jsPDF. No backend API endpoints are required.

## Security

- ✅ No server-side processing required
- ✅ Data remains client-side
- ✅ No external API calls for PDF generation
- ✅ Zero vulnerabilities in jsPDF 4.0.0

## Support

For issues or questions:
- GitHub Issues: https://github.com/mrehmanbee22seecs/wasilahfignew/issues
- Documentation: `/docs`
- Code: `/src/utils/pdfExport.ts`, `/src/utils/certificateGenerator.ts`
