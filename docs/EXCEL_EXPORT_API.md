# Excel Export API Documentation

## Overview

The Wasilah platform provides robust Excel export functionality supporting multi-sheet workbooks with formulas, styling, and analytics. This document covers the Excel export API and how to use it.

## Features

- **Multi-sheet workbooks**: Export data across multiple sheets in a single file
- **Rich styling**: Styled headers, alternating row colors, and summary footers
- **Excel formulas**: Automatic SUM, AVERAGE, COUNT formulas for numeric columns
- **Custom formulas**: Support for custom Excel formulas
- **Analytics sheets**: Cross-entity summary sheets with metrics
- **Auto-filtering**: Header rows are automatically filterable
- **Frozen headers**: Top row stays visible while scrolling
- **Format support**: Currency, dates, percentages with proper Excel formatting
- **Large datasets**: Efficiently handles thousands of rows

## Installation

The Excel export feature uses the `exceljs` library:

```bash
npm install exceljs
```

## Basic Usage

### Simple Excel Export

```typescript
import { exportExcelToDownload, prepareEntitySheets } from '@/utils/excelExport';

// Prepare data
const projectsData = [
  {
    id: 'proj-1',
    title: 'Community Water Project',
    budget: 100000,
    spent: 50000,
    status: 'active'
  },
  // ... more projects
];

// Create sheets
const sheets = prepareEntitySheets('projects', projectsData);

// Export to browser download
await exportExcelToDownload({
  sheets,
  filename: 'projects_2026-02-01.xlsx',
  creator: 'John Doe',
  includeAnalytics: true
});
```

### Custom Sheet Configuration

```typescript
import { createExcelWorkbook, type ExcelSheetConfig } from '@/utils/excelExport';

const sheetConfig: ExcelSheetConfig = {
  name: 'Q4 2025 Report',
  data: [
    { id: 1, revenue: 50000, expenses: 30000 },
    { id: 2, revenue: 60000, expenses: 35000 },
  ],
  columns: [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Revenue', key: 'revenue', width: 15, format: 'currency' },
    { header: 'Expenses', key: 'expenses', width: 15, format: 'currency' },
    { 
      header: 'Profit', 
      key: 'profit', 
      width: 15, 
      format: 'currency',
      formula: 'B2-C2' // Custom formula
    },
  ],
  includeSummary: true,
  freezeHeader: true
};

const workbook = await createExcelWorkbook({
  sheets: [sheetConfig],
  filename: 'financial-report.xlsx',
  includeAnalytics: false
});
```

## API Reference

### Core Functions

#### `exportExcelToDownload(options: ExcelExportOptions): Promise<void>`

Exports an Excel file and triggers browser download.

**Parameters:**
- `options.sheets`: Array of sheet configurations
- `options.filename`: Output filename (e.g., 'report.xlsx')
- `options.creator`: (Optional) Creator name for workbook metadata
- `options.includeAnalytics`: (Optional) Add analytics summary sheet

**Example:**
```typescript
await exportExcelToDownload({
  sheets: [projectsSheet, volunteersSheet],
  filename: 'wasilah_report_2026-02-01.xlsx',
  creator: 'Admin User',
  includeAnalytics: true
});
```

#### `createExcelWorkbook(options: ExcelExportOptions): Promise<ExcelJS.Workbook>`

Creates an Excel workbook in memory (doesn't download).

**Returns:** ExcelJS Workbook object

**Example:**
```typescript
const workbook = await createExcelWorkbook(options);
const buffer = await workbook.xlsx.writeBuffer();
// Use buffer for other purposes (e.g., send to API)
```

#### `prepareEntitySheets(entityType: ExportEntityType, data: any[], config?: ExportConfig): ExcelSheetConfig[]`

Prepares entity-specific sheets with appropriate columns and formatting.

**Supported Entity Types:**
- `projects`: Project data with budgets, beneficiaries, etc.
- `volunteers`: Volunteer information and statistics
- `payments`: Payment transactions and summaries
- `ngos`: NGO/Organization details
- `opportunities`: Volunteer opportunities
- `audit_logs`: System audit trail

**Returns:** Array of sheet configurations (main sheet + summary sheet)

**Example:**
```typescript
const sheets = prepareEntitySheets('projects', projectsData);
// Returns: [
//   { name: 'Projects', data: [...], columns: [...] },
//   { name: 'Projects Summary', data: [...], columns: [...] }
// ]
```

### Types

#### `ExcelSheetConfig`

```typescript
interface ExcelSheetConfig {
  name: string;                    // Sheet name
  data: any[];                     // Row data
  columns: ExcelColumnConfig[];    // Column definitions
  includeFormulas?: boolean;       // Include summary formulas
  includeSummary?: boolean;        // Add summary row (default: true)
  freezeHeader?: boolean;          // Freeze top row (default: true)
}
```

#### `ExcelColumnConfig`

```typescript
interface ExcelColumnConfig {
  header: string;              // Column header text
  key: string;                 // Data property key
  width?: number;              // Column width (default: 15)
  style?: Partial<ExcelJS.Style>;  // Custom cell style
  format?: string;             // Format type or custom format
  formula?: string;            // Custom formula for summary row
}
```

**Supported Formats:**
- `'currency'`: PKR currency format (e.g., "PKR 1,000.00")
- `'date'`: Date format (dd/mm/yyyy)
- `'percentage'`: Percentage format (0.00%)
- `'numFmt:...'`: Custom number format string

#### `ExcelExportOptions`

```typescript
interface ExcelExportOptions {
  sheets: ExcelSheetConfig[];      // Array of sheets to include
  filename: string;                // Output filename
  creator?: string;                // Workbook creator (optional)
  includeAnalytics?: boolean;      // Add analytics sheet (optional)
}
```

## Styling

### Predefined Styles

The utility includes predefined styles:

- **Header Row**: Blue background (#0369A1), white bold text, bordered
- **Even Rows**: Light gray background (#F3F4F6)
- **Odd Rows**: White background
- **Summary Row**: Purple background (#DBEAFE), bold text, top border

### Custom Styling

```typescript
const column: ExcelColumnConfig = {
  header: 'Amount',
  key: 'amount',
  style: {
    font: { bold: true, color: { argb: 'FFFF0000' } },
    fill: { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'FFFFFF00' } 
    },
    numFmt: '"$"#,##0.00'
  }
};
```

## Formulas

### Automatic Formulas

For sheets with `includeSummary: true`, numeric columns automatically get SUM formulas:

```typescript
// Given data with amounts: 100, 200, 300
// Automatically generates: =SUM(B2:B4) in summary row
```

### Custom Formulas

Specify custom formulas in column config:

```typescript
columns: [
  { header: 'Q1', key: 'q1' },
  { header: 'Q2', key: 'q2' },
  { header: 'Q3', key: 'q3' },
  { header: 'Q4', key: 'q4' },
  {
    header: 'Average',
    key: 'avg',
    formula: 'AVERAGE(B2:E2)' // Custom AVERAGE formula
  },
  {
    header: 'Max',
    key: 'max',
    formula: 'MAX(B2:E2)' // Custom MAX formula
  }
]
```

### Supported Formula Functions

All standard Excel functions are supported:
- Math: `SUM`, `AVERAGE`, `COUNT`, `MIN`, `MAX`, `ROUND`
- Logical: `IF`, `AND`, `OR`, `NOT`
- Text: `CONCATENATE`, `LEFT`, `RIGHT`, `MID`
- Date: `TODAY`, `NOW`, `DATE`, `YEAR`, `MONTH`
- Lookup: `VLOOKUP`, `HLOOKUP`, `INDEX`, `MATCH`

## Analytics Sheets

When `includeAnalytics: true`, an additional "Analytics Summary" sheet is added:

```typescript
await exportExcelToDownload({
  sheets: [projectsSheet, paymentsSheet, volunteersSheet],
  filename: 'platform-analytics.xlsx',
  includeAnalytics: true  // Adds analytics sheet
});
```

The analytics sheet includes:
- Export metadata (date, creator)
- Record counts per sheet
- Summary statistics
- Cross-sheet totals with formulas

## Integration with React Components

### Using with Export Hook

```typescript
import { useExports } from '@/hooks/useExports';

function MyComponent() {
  const { createExport } = useExports();
  
  const handleExport = () => {
    createExport({
      format: 'excel',  // Use Excel format
      entityType: 'projects',
      columns: ['title', 'status', 'budget', 'spent'],
      dateRange: {
        from: '2025-01-01',
        to: '2025-12-31'
      }
    });
  };
  
  return <button onClick={handleExport}>Export to Excel</button>;
}
```

### Using Export Button Component

```typescript
import { ExportButton } from '@/components/exports/ExportButton';

function ProjectsDashboard() {
  return (
    <div>
      <h1>Projects</h1>
      <ExportButton 
        entityType="projects"
        variant="primary"
        showHistory={true}
      />
    </div>
  );
}
```

## Best Practices

### 1. Data Preparation

- Clean data before export (remove nulls, validate types)
- Use consistent naming for keys/fields
- Ensure numeric fields are actual numbers, not strings

```typescript
// Good
const data = [
  { amount: 1000, date: new Date('2024-01-01') }
];

// Bad
const data = [
  { amount: "1000", date: "01/01/2024" }
];
```

### 2. Column Configuration

- Set appropriate widths for readability
- Use descriptive headers
- Apply formats consistently

```typescript
columns: [
  { header: 'Transaction ID', key: 'id', width: 15 },
  { header: 'Amount (PKR)', key: 'amount', width: 15, format: 'currency' },
  { header: 'Date', key: 'date', width: 12, format: 'date' }
]
```

### 3. Performance

- For large datasets (>10,000 rows), consider:
  - Pagination or chunking
  - Limiting columns
  - Disabling summary rows
  - Processing in background

```typescript
// For large datasets
const MAX_ROWS = 10000;
const limitedData = data.slice(0, MAX_ROWS);
```

### 4. File Naming

- Use descriptive, timestamped filenames
- Follow consistent naming convention
- Include entity type and date

```typescript
const filename = `wasilah_${entityType}_${new Date().toISOString().split('T')[0]}.xlsx`;
// Example: wasilah_projects_2026-02-01.xlsx
```

## Error Handling

```typescript
try {
  await exportExcelToDownload(options);
  toast.success('Export completed successfully');
} catch (error) {
  console.error('Export failed:', error);
  toast.error('Failed to export: ' + error.message);
}
```

## Compatibility

- **Excel**: Full compatibility with Excel 2007+ (.xlsx format)
- **Google Sheets**: Fully compatible, formulas work correctly
- **LibreOffice Calc**: Fully compatible
- **Numbers (Mac)**: Compatible, some styling may vary slightly

## Limitations

1. **Maximum rows**: Excel supports up to 1,048,576 rows
2. **Maximum columns**: Excel supports up to 16,384 columns
3. **File size**: Large files (>50MB) may be slow to generate
4. **Formulas**: Complex array formulas may not be supported
5. **Charts**: Chart generation not currently supported (data only)

## Troubleshooting

### Export not downloading

Check browser download permissions and popup blockers.

### Formulas not calculating

Ensure `includeSummary: true` and data is properly formatted as numbers.

### Styling not applied

Verify style objects use correct ExcelJS style format.

### Large file crashes

Reduce dataset size or disable summary/analytics sheets.

## Security Considerations

- Never export sensitive data without proper authorization checks
- Implement rate limiting for export endpoints
- Log all export activities for audit trail
- Sanitize all input data to prevent formula injection
- Consider adding watermarks for sensitive documents

## Examples

### Complete Example: Multi-Entity Report

```typescript
import { 
  exportExcelToDownload,
  prepareEntitySheets 
} from '@/utils/excelExport';

async function exportPlatformReport(
  projects: any[],
  volunteers: any[],
  payments: any[]
) {
  try {
    // Prepare sheets for each entity
    const projectSheets = prepareEntitySheets('projects', projects);
    const volunteerSheets = prepareEntitySheets('volunteers', volunteers);
    const paymentSheets = prepareEntitySheets('payments', payments);
    
    // Combine all sheets
    const allSheets = [
      ...projectSheets,
      ...volunteerSheets,
      ...paymentSheets
    ];
    
    // Export with analytics
    await exportExcelToDownload({
      sheets: allSheets,
      filename: `wasilah_platform_report_${new Date().toISOString().split('T')[0]}.xlsx`,
      creator: 'Platform Admin',
      includeAnalytics: true
    });
    
    console.log('Export completed successfully');
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}
```

## Support

For issues or questions:
- GitHub Issues: [Repository Issues](https://github.com/mrehmanbee22seecs/wasilahfignew/issues)
- Documentation: See `/docs` folder
- Code: `/src/utils/excelExport.ts`

## Version History

- **v1.0.0** (2026-02-01): Initial release with multi-sheet support, formulas, and styling
