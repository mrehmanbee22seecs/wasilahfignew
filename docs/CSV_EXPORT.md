# CSV Export Feature Documentation

## Overview

The Wasilah platform provides comprehensive CSV export functionality for all major entity types. This feature allows users to export data from their dashboards with filters, custom columns, and various format options.

## Features

- **Multiple Entity Support**: Export Projects, Volunteers, Applications, Payments, NGOs, and Audit Logs
- **Format Options**: CSV, Excel, PDF, and JSON (CSV is production-ready)
- **Filtering**: Apply dashboard filters to exports
- **Custom Columns**: Select specific columns to export
- **Export History**: Track and re-download previous exports
- **Large Dataset Handling**: Supports up to 10,000 records per export
- **Excel Compatibility**: Proper CSV formatting for Excel and Google Sheets

## User Guide

### How to Export Data

1. **Navigate** to any dashboard with export functionality:
   - Projects Page
   - Volunteers Directory
   - Payments & Finance
   - NGO Directory
   - Audit Log

2. **Click** the "Export" button (usually in the top-right corner or next to filters)

3. **Configure Export** in the modal:
   - Select format (CSV recommended)
   - Choose entity type
   - Select columns to include
   - Set date range filters (if applicable)
   - Apply status/category filters

4. **Download**: Click "Export" to generate and download the file

5. **History**: Click "History" button to view and re-download previous exports

### File Naming Convention

Exported files follow this naming pattern:
```
wasilah_{entity_type}_{YYYY-MM-DD}.{extension}
```

Examples:
- `wasilah_projects_2026-02-01.csv`
- `wasilah_volunteers_2026-02-01.csv`
- `wasilah_payments_2026-02-01.csv`

## API Documentation

### Export API Endpoints

All export APIs follow a consistent pattern:

#### Projects Export

```typescript
// API Method
projectsApi.exportData(filters?: ProjectFilters): Promise<ApiResponse<Project[]>>

// Filters
interface ProjectFilters {
  status?: Project['status'][];
  corporate_id?: string;
  ngo_id?: string;
  city?: string;
  province?: string;
  sdg_goals?: number[];
  search?: string;
}

// Usage Example
const result = await projectsApi.exportData({
  status: ['active', 'completed'],
  city: 'Lahore'
});
```

#### Volunteers Export

```typescript
// API Method
volunteersApi.exportData(filters?: VolunteerFilters): Promise<ApiResponse<Volunteer[]>>

// Filters
interface VolunteerFilters {
  city?: string;
  province?: string;
  interests?: string[];
  sdg_goals?: number[];
  skills?: string[];
  is_verified?: boolean;
  background_check_status?: string;
  search?: string;
  availability?: 'weekdays' | 'weekends' | 'both';
}

// Usage Example
const result = await volunteersApi.exportData({
  is_verified: true,
  skills: ['teaching', 'mentoring']
});
```

#### Applications Export

```typescript
// API Method
applicationsApi.exportData(filters?: ApplicationFilters): Promise<ApiResponse<VolunteerApplication[]>>

// Filters
interface ApplicationFilters {
  status?: string;
  project_id?: string;
  volunteer_id?: string;
}

// Usage Example
const result = await applicationsApi.exportData({
  status: 'approved',
  project_id: 'proj-123'
});
```

#### Payments Export

```typescript
// API Method
paymentsApi.exportData(filters?: PaymentFilters): Promise<ApiResponse<PaymentApproval[]>>

// Filters
interface PaymentFilters {
  status?: string;
  project_id?: string;
  corporate_id?: string;
}

// Usage Example
const result = await paymentsApi.exportData({
  status: 'completed',
  corporate_id: 'corp-456'
});
```

#### NGOs Export

```typescript
// API Method
ngosApi.exportData(filters?: NGOFilters): Promise<ApiResponse<NGO[]>>

// Filters
interface NGOFilters {
  verification_status?: NGO['verification_status'][];
  city?: string;
  province?: string;
  focus_areas?: string[];
  sdg_alignment?: number[];
  search?: string;
}

// Usage Example
const result = await ngosApi.exportData({
  verification_status: ['verified'],
  focus_areas: ['education']
});
```

### Frontend Hook - useExports

```typescript
import { useExports } from '../hooks/useExports';
import type { ExportConfig } from '../components/exports/types';

function MyComponent() {
  const {
    exportHistory,      // Array of previous exports
    isExporting,        // Boolean loading state
    createExport,       // Function to create new export
    cancelExport,       // Function to cancel running export
    deleteExport,       // Function to delete from history
    clearHistory,       // Function to clear all history
    redownloadExport,   // Function to re-download completed export
  } = useExports();

  // Create an export
  const handleExport = async () => {
    const config: ExportConfig = {
      format: 'csv',
      entityType: 'projects',
      includeColumns: ['id', 'title', 'status', 'budget'],
      filters: {
        status: ['active'],
      },
      dateRange: {
        start: '2026-01-01',
        end: '2026-12-31',
      },
    };

    await createExport(config);
  };

  return (
    <button onClick={handleExport} disabled={isExporting}>
      {isExporting ? 'Exporting...' : 'Export Data'}
    </button>
  );
}
```

### ExportButton Component

The simplest way to add export functionality to a page:

```tsx
import { ExportButton } from '../components/exports/ExportButton';

function MyDashboard() {
  return (
    <div>
      <h1>My Dashboard</h1>
      <ExportButton 
        entityType="projects"      // Entity type to export
        variant="secondary"         // "primary" or "secondary" button style
        showHistory={true}          // Show export history button
      />
    </div>
  );
}
```

## CSV Format Specifications

### CSV Escaping Rules

The CSV generator follows RFC 4180 standards:

1. **Commas**: Values containing commas are wrapped in double quotes
   - Example: `"Project A, Phase 2"`

2. **Quotes**: Double quotes within values are escaped by doubling them
   - Example: `"Project ""Special"""`

3. **Newlines**: Newlines in values are converted to spaces
   - Example: `"Multi line description"` → `"Multi line description"`

4. **Null/Undefined**: Empty values are represented as empty quoted strings
   - Example: `""`

### Excel Compatibility

CSV files are compatible with:
- Microsoft Excel (all versions)
- Google Sheets
- LibreOffice Calc
- Apple Numbers

UTF-8 encoding is used with proper BOM (Byte Order Mark) for Excel compatibility.

## Configuration

### Export Limits

```typescript
// Maximum records per export (configured in each API method)
const MAX_EXPORT_RECORDS = 10000;

// In API methods:
query = query.limit(10000);
```

### Permissions

Currently, all authenticated users can export data from entities they have access to. Future enhancements will include:

- Admin-only exports for sensitive data
- Role-based export permissions
- Export audit logging

## Error Handling

### Common Errors

1. **No Data Available**
   ```
   Error: No data available for export
   Solution: Check filters and ensure data exists
   ```

2. **Export Limit Exceeded**
   ```
   Error: Export exceeds maximum limit of 10,000 records
   Solution: Apply more specific filters to reduce dataset size
   ```

3. **Network Error**
   ```
   Error: Failed to fetch data
   Solution: Check network connection and retry
   ```

### Error Messages

The export system provides user-friendly toast notifications for:
- Export success
- Export failures with specific error messages
- Progress updates for long-running exports

## Testing

### Running Tests

```bash
# Run all CSV export tests
npm run test:run -- src/tests/exports/csvExport.test.ts

# Run tests in watch mode
npm run test -- src/tests/exports/csvExport.test.ts
```

### Test Coverage

The CSV export functionality has 15 test cases covering:

1. **CSV Generation** (5 tests)
   - Correct format and headers
   - Comma handling
   - Quote escaping
   - Empty data
   - Null/undefined values

2. **Filtered Exports** (7 tests)
   - Projects with filters
   - Volunteers with filters
   - Payments with filters
   - NGOs with filters
   - Applications with filters

3. **Error Handling** (2 tests)
   - API errors
   - Network errors

4. **Export Limits** (1 test)
   - Maximum record limit enforcement

## Future Enhancements

### Planned Features

1. **Streaming Exports**: For datasets larger than 10,000 records
2. **Scheduled Exports**: Automatic exports on a schedule
3. **Email Delivery**: Send exports via email
4. **Custom Templates**: Pre-configured export templates
5. **Excel Format**: True .xlsx generation with formatting
6. **PDF Reports**: Formatted PDF exports with charts
7. **Compressed Exports**: ZIP files for large exports
8. **Export Analytics**: Track export usage and patterns

### Security Enhancements

1. **Permission System**: Role-based export access control
2. **Audit Logging**: Track all export activities
3. **Data Redaction**: Automatically redact sensitive fields
4. **Export Quotas**: Limit number of exports per user/day

## Troubleshooting

### Common Issues

**Q: Export button is disabled**
- A: No data available or user lacks permissions

**Q: Export takes too long**
- A: Large dataset - apply filters to reduce size or wait for completion

**Q: CSV doesn't open correctly in Excel**
- A: Ensure UTF-8 encoding is supported. Try opening in Google Sheets first.

**Q: Some columns are missing**
- A: Check column selection in Export Modal configuration

**Q: Data seems incomplete**
- A: Check if export hit the 10,000 record limit. Apply filters to narrow scope.

## Support

For issues or questions:
1. Check this documentation
2. Review test cases in `src/tests/exports/csvExport.test.ts`
3. Contact the development team

## Version History

- **v1.0** (2026-02-01): Initial production release
  - CSV export for all major entities
  - Filter support
  - Export history
  - 15 test cases
  - Complete API integration
