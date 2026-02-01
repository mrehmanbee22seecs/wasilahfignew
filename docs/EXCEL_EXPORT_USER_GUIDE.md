# Excel Export - User Guide

## Overview

The Wasilah platform allows you to export data to Excel (.xlsx) format with advanced features like multiple sheets, formulas, and professional styling. This guide explains how to use the Excel export feature.

## Getting Started

### Where to Find Export

The "Export" button is available on most data pages:
- **Projects Dashboard**: Export all projects with budgets and metrics
- **Volunteers Directory**: Export volunteer information and statistics  
- **Payments & Finance**: Export payment transactions and summaries
- **NGO Directory**: Export organization details and statistics
- **Admin Reports**: Export audit logs and system data

Look for the **Export** button (📥 icon) in the top-right corner of data tables.

## Exporting Data

### Basic Export

1. Navigate to the page with data you want to export (e.g., Projects)
2. Apply any filters you want (status, date range, location, etc.)
3. Click the **"Export"** button
4. Choose **"Excel"** as the format
5. Select the columns you want to include
6. Click **"Export Now"**
7. The file will download automatically

### File Information

- **Format**: Excel 2007+ (.xlsx) 
- **Naming**: Files are automatically named with date, e.g., `wasilah_projects_2026-02-01.xlsx`
- **Size**: Typical exports are 50KB - 5MB depending on data volume
- **Compatibility**: Works with Excel, Google Sheets, LibreOffice, and Numbers

## Excel File Structure

### Multiple Sheets

Each Excel export includes multiple sheets:

1. **Main Data Sheet**: Your filtered data with all columns
2. **Summary Sheet**: Key metrics and statistics  
3. **Analytics Sheet** (optional): Cross-data insights

**Example - Projects Export:**
- Sheet 1: "Projects" - All project details
- Sheet 2: "Projects Summary" - Total budget, beneficiaries, status breakdown

### Styled Headers

- **Blue header row** with white text for easy reading
- **Frozen top row** stays visible when scrolling
- **Auto-filter** enabled on all columns
- **Alternating row colors** (white/light gray) for better readability

### Summary Rows

At the bottom of main sheets, you'll find summary rows with:
- **Totals** for numeric columns (budgets, amounts, counts)
- **Formulas** that update if you edit data in Excel
- **Bold purple formatting** to stand out

## Understanding the Data

### Projects Export

**Main Sheet Columns:**
- ID, Title, NGO, Status, Category
- Budget, Spent, Remaining (with formulas)
- Start Date, End Date
- Beneficiaries, Impact Score

**Summary Sheet Shows:**
- Total projects count
- Active vs. Completed breakdown
- Total budget and spending
- Average impact score

### Volunteers Export

**Main Sheet Columns:**
- ID, Name, Email, Phone
- Skills, Total Hours
- Projects Completed
- Join Date, Last Active, Status

**Summary Sheet Shows:**
- Total volunteers count
- Active volunteers
- Total volunteer hours
- Average hours per volunteer

### Payments Export

**Main Sheet Columns:**
- ID, Project, NGO
- Amount, Status, Payment Date
- Method, Approved By
- Milestone, Reference

**Summary Sheet Shows:**
- Total payments (count and amount)
- Breakdown by status (completed, pending, failed)
- Payment method distribution

### NGOs Export

**Main Sheet Columns:**
- ID, Name, Category, Status
- Founded Year
- Project Count, Volunteer Count
- Contact Info, Location
- Impact Score

**Summary Sheet Shows:**
- Total NGOs
- Active organizations
- Total projects across all NGOs
- Average impact score

## Advanced Features

### Formulas

Excel exports include live formulas that update automatically:

#### In Main Sheets:
- **Remaining Budget** = Budget - Spent
- **Completion %** = (Spent / Budget) × 100

#### In Summary Rows:
- **Totals**: `=SUM(B2:B100)` 
- **Averages**: `=AVERAGE(C2:C100)`
- **Counts**: `=COUNT(A2:A100)`

You can modify data and formulas will recalculate!

### Filtering and Sorting

1. **Auto-Filters**: Click dropdown arrows in headers
2. **Sort**: Click any header to sort ascending/descending
3. **Custom Filters**: Use "Number Filters" or "Text Filters" for advanced options

### Currency Formatting

All amounts are formatted as **PKR** (Pakistani Rupee):
- Displays as: PKR 1,000,000.00
- Formatted with thousands separators
- Two decimal places for precision

### Date Formatting

Dates are formatted as: **dd/mm/yyyy**
- Example: 01/02/2026
- Can be changed to your preferred format in Excel

## Tips & Tricks

### 1. Filter Before Export

Apply filters before exporting to get only the data you need:
- **Status**: Filter by "Active", "Completed", etc.
- **Date Range**: Select specific time periods
- **Location**: Filter by city or province
- **Amount Range**: Set minimum/maximum amounts

### 2. Choose Relevant Columns

Don't export everything - select only columns you need:
- Faster export
- Smaller file size
- Easier to read and share

### 3. Using Export History

The platform keeps your recent exports:
1. Click **"History"** button next to Export
2. See list of previous exports
3. Re-download if you need the same data again
4. Check when each export was created

### 4. Working with Large Exports

For datasets with thousands of rows:
- Be patient - may take 10-30 seconds
- Don't close the browser tab while exporting
- Consider applying filters to reduce size
- Break into multiple smaller exports if needed

### 5. Sharing Exports

To share Excel files with others:
- **Email**: Attach the .xlsx file directly
- **Google Drive**: Upload and share link
- **Cloud Storage**: Dropbox, OneDrive, etc.
- **Print**: Excel files can be printed directly

## Common Use Cases

### Monthly Reporting

1. Set date range to last month
2. Export projects and payments
3. Use summary sheets for report metrics
4. Add charts and analysis in Excel

### Donor Reports

1. Filter projects by specific donor/corporate
2. Export with impact metrics
3. Include beneficiary counts
4. Use for grant proposals and updates

### Financial Reconciliation

1. Export payments for specific period
2. Cross-check with bank statements
3. Use formulas to calculate totals
4. Identify pending or failed transactions

### Volunteer Management

1. Export volunteer directory
2. Filter by skills needed
3. Check total hours contributed
4. Contact volunteers for opportunities

### Audit and Compliance

1. Export audit logs for date range
2. Review all system activities
3. Track changes and approvals
4. Document for compliance requirements

## Troubleshooting

### Export Not Starting

**Problem**: Nothing happens when clicking Export

**Solutions**:
- Check if popup blockers are enabled (disable for Wasilah)
- Try a different browser (Chrome, Firefox, Safari)
- Clear browser cache and cookies
- Check internet connection

### File Won't Open

**Problem**: Excel file won't open or shows errors

**Solutions**:
- Ensure you have Excel 2007 or newer
- Try Google Sheets or LibreOffice if Excel unavailable
- Check if file downloaded completely (check file size)
- Re-download the file

### Missing Data

**Problem**: Expected data not in export

**Solutions**:
- Check filters applied before export
- Verify date range includes your data
- Ensure you have permissions to view all data
- Try selecting "All Columns" instead of specific ones

### Formulas Not Working

**Problem**: Summary row formulas show errors

**Solutions**:
- Open in Excel (not text editor)
- Enable macros/formulas if prompted
- Check for blank or invalid data in columns
- Manual formulas may need adjustment if data changed

### File Size Issues

**Problem**: Export too large or slow

**Solutions**:
- Apply more specific filters
- Reduce date range
- Select fewer columns
- Export in smaller batches

## Browser Compatibility

Excel export works best in modern browsers:

- ✅ **Chrome** (recommended): v90+
- ✅ **Firefox**: v88+
- ✅ **Safari**: v14+
- ✅ **Edge**: v90+
- ⚠️ **Internet Explorer**: Not supported

## Mobile Devices

Excel export is supported on mobile but with limitations:

- **iOS (iPad/iPhone)**: Download works, requires Excel or Numbers app
- **Android (Tablet/Phone)**: Download works, requires Excel or Sheets app
- **Recommendation**: Use desktop/laptop for best experience

## Data Privacy

### What Gets Exported

- Only data you have permission to view
- Filtered data based on your role
- No sensitive system data
- No passwords or authentication tokens

### Security Best Practices

- Don't share exports with unauthorized persons
- Delete export files when no longer needed
- Use secure file sharing methods
- Password-protect sensitive Excel files

## Getting Help

If you encounter issues:

1. **Try the Troubleshooting section** above
2. **Check your permissions** with admin
3. **Contact Support**: support@wasilah.pk
4. **Report Bug**: Include export settings and error message

## Frequently Asked Questions

**Q: How many rows can I export?**
A: Technically, Excel supports up to 1,048,576 rows. However, for optimal performance and file size, we recommend keeping exports under 10,000 rows by applying filters. Larger exports may take longer to generate and download.

**Q: Can I schedule automatic exports?**
A: Not currently, but planned for future release.

**Q: Are formulas live or static?**
A: Formulas are live - they update when you modify data in Excel.

**Q: Can I edit the exported data?**
A: Yes, but changes are NOT synced back to Wasilah platform.

**Q: How long are exports stored?**
A: Exports are not stored - you download immediately. Use History to re-generate.

**Q: Can I export charts/graphs?**
A: Not currently, but you can create charts in Excel from exported data.

**Q: What about CSV export?**
A: CSV export is also available but has no formulas or multiple sheets.

**Q: Can I customize column names?**
A: Not in export, but you can rename columns in Excel after export.

## Feature Requests

Have ideas for improving Excel export?
- Email: feedback@wasilah.pk
- Submit: GitHub Issues

Common requests we're considering:
- Custom templates
- Scheduled exports
- Email delivery
- Chart generation
- PDF conversion

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Platform**: Wasilah - Connecting Hearts, Changing Lives
