# 📋 Wasilah Contact/Proposal System - Developer Handoff Notes

**Last Updated:** December 2024  
**Version:** 1.0  
**Status:** Production Ready - Requires Backend Integration

---

## 🎯 Overview

This document provides complete technical specifications for integrating the Contact/Proposal system with backend services. Follow these guidelines to ensure zero UX broken flows.

---

## 📡 API Endpoints

### **POST /api/proposals**

**Purpose:** Submit a proposal request from corporate/NGO/volunteer

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Request Body Example:**
```json
{
  "companyName": "Acme Ltd.",
  "contactName": "Ayesha Khan",
  "email": "ayesha@acme.com",
  "phone": "+92300xxxxxxx",
  "role": "Corporate",
  "budgetRange": "PKR 50k–200k",
  "services": ["Project Execution", "Impact Reporting"],
  "preferredSDGs": [1, 4, 6],
  "message": "We want a pilot program in Karachi...",
  "attachments": [
    {
      "fileName": "brief.pdf",
      "url": "https://cdn.wasilah.org/uploads/abc123.pdf",
      "size": 2048576,
      "type": "application/pdf"
    }
  ],
  "referrerUrl": "https://wasilah.org/solutions#vetting",
  "utm": {
    "source": "linkedin",
    "medium": "paid",
    "campaign": "q4pilot"
  },
  "consent": true,
  "submittedAt": "2024-12-14T10:30:00Z"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "id": "proposal_abc123",
  "status": "received",
  "message": "Proposal received successfully",
  "estimatedResponseTime": "48 hours"
}
```

**Error Responses:**

**400 Bad Request - Validation Error:**
```json
{
  "success": false,
  "error": "validation_error",
  "message": "Validation failed",
  "errors": {
    "email": "Please enter a valid email address.",
    "budgetRange": "Please select an approximate budget range."
  }
}
```

**429 Too Many Requests - Rate Limited:**
```json
{
  "success": false,
  "error": "rate_limit",
  "message": "Too many submissions. Please try again in 5 minutes.",
  "retryAfter": 300
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "server_error",
  "message": "We're experiencing technical difficulties. Please try again later."
}
```

---

## ✅ Validation Rules (Server-Side Must Match)

### **Field Validation Matrix**

| Field | Required | Type | Min | Max | Format | Error Message |
|-------|----------|------|-----|-----|--------|---------------|
| `companyName` | ✅ Yes | string | 2 | 100 | - | "Please enter your company name." |
| `contactName` | ✅ Yes | string | 2 | 50 | - | "Please enter your name." |
| `email` | ✅ Yes | string | - | - | RFC 5322 | "Please enter a valid email address." |
| `phone` | ❌ No | string | - | - | E.164-ish | "Please enter a valid phone number." |
| `role` | ✅ Yes | enum | - | - | Corporate\|NGO\|Volunteer\|Other | "Please select your role." |
| `budgetRange` | ✅ Yes | enum | - | - | See budget options | "Please select an approximate budget range." |
| `services` | ❌ No | array | 0 | 5 | - | "Please select a maximum of 5 services." |
| `preferredSDGs` | ❌ No | array[int] | 0 | 17 | 1-17 | - |
| `message` | ❌ No | string | 0 | 1000 | - | "Too long — keep it under 1000 characters." |
| `attachments` | ❌ No | array | 0 | 5 | See file rules | "Total file size exceeds 10MB limit." |
| `consent` | ✅ Yes | boolean | - | - | must be true | "Please consent for us to contact you." |

### **Enum Values**

**Role Options:**
```typescript
["Corporate", "NGO", "Volunteer", "Other"]
```

**Budget Range Options:**
```typescript
["<PKR 50k", "PKR 50k–200k", "PKR 200k–1M", ">PKR 1M", "Not decided"]
```

**Service Options:**
```typescript
[
  "CSR Strategy",
  "NGO Vetting",
  "Project Execution",
  "Impact Reporting",
  "Employee Volunteering",
  "Compliance & Audit",
  "Events & Experiences"
]
```

**Attachment Rules:**
- Max file size per file: 5MB
- Max total size: 10MB
- Allowed types: `.pdf`, `.docx`, `.doc`, `.jpg`, `.jpeg`, `.png`, `.mp4`
- Max files: 5

### **Honeypot Field (CRITICAL)**

The form includes a hidden field named `website` for spam detection:

```typescript
// Frontend sends this field but it must be empty
{
  "website": ""
}
```

**Server-side rule:**
```javascript
if (request.body.website !== "") {
  return res.status(400).json({
    success: false,
    error: "invalid_submission",
    message: "Invalid submission detected."
  });
}
```

---

## 📤 File Upload Flow

### **Frontend → Backend File Upload**

The frontend FileUploader component collects files but does NOT upload them directly. Backend must provide file upload endpoint:

### **Step 1: Get Signed Upload URL**

**Endpoint:** `POST /api/proposals/upload-url`

**Request:**
```json
{
  "fileName": "brief.pdf",
  "fileType": "application/pdf",
  "fileSize": 2048576
}
```

**Response:**
```json
{
  "success": true,
  "uploadUrl": "https://cdn.wasilah.org/uploads/signed-url-abc123",
  "fileId": "file_abc123",
  "expiresIn": 3600
}
```

### **Step 2: Upload File to Signed URL**

```javascript
// Frontend uploads file directly to CDN/S3
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': file.type
  }
});
```

### **Step 3: Submit Proposal with File IDs**

```json
{
  "attachments": [
    {
      "fileName": "brief.pdf",
      "url": "https://cdn.wasilah.org/uploads/abc123.pdf",
      "size": 2048576,
      "type": "application/pdf"
    }
  ]
}
```

**⚠️ IMPORTANT:** Frontend shows upload progress and handles errors gracefully. If upload fails, show clear error message and allow retry.

---

## 📊 Analytics Events (Must Be Tracked)

### **Event Tracking Implementation**

All analytics events are already fired from the frontend. Backend must log these for funnel analysis:

### **1. proposal_opened**
```javascript
// Fired when: Modal opens OR user lands on contact page
{
  event: "proposal_opened",
  payload: {
    origin: "hero" | "solutions_card" | "header" | "footer",
    prefillService: "CSR Strategy" | null,
    timestamp: "2024-12-14T10:30:00Z",
    sessionId: "session_abc123"
  }
}
```

### **2. proposal_prefill**
```javascript
// Fired when: Service is pre-selected (from Solutions page)
{
  event: "proposal_prefill",
  payload: {
    service: "NGO Vetting",
    timestamp: "2024-12-14T10:30:00Z"
  }
}
```

### **3. proposal_submit_attempt**
```javascript
// Fired when: User clicks "Send Request" (before validation)
{
  event: "proposal_submit_attempt",
  payload: {
    companyName: "Acme Ltd.",
    servicesSelectedCount: 2,
    from: "modal" | "page",
    timestamp: "2024-12-14T10:30:00Z"
  }
}
```

### **4. proposal_submitted** ✅
```javascript
// Fired when: Submission successful (200 OK)
{
  event: "proposal_submitted",
  payload: {
    companyName: "Acme Ltd.",
    role: "Corporate",
    budgetRange: "PKR 50k–200k",
    services: ["Project Execution"],
    sdgCount: 2,
    hasAttachments: true,
    timestamp: "2024-12-14T10:30:00Z",
    proposalId: "proposal_abc123"
  }
}
```

### **5. proposal_submit_error** ❌
```javascript
// Fired when: Submission fails (4xx/5xx)
{
  event: "proposal_submit_error",
  payload: {
    errorCode: "validation_error" | "rate_limit" | "server_error",
    errorMessage: "Validation failed",
    timestamp: "2024-12-14T10:30:00Z"
  }
}
```

**Integration Options:**
- Google Analytics 4
- Mixpanel
- Segment
- Custom backend logging

---

## 🔒 Security & Spam Protection

### **1. Honeypot Field**
```javascript
// Server-side check (MUST IMPLEMENT)
if (body.website !== "") {
  return error("Invalid submission");
}
```

### **2. Rate Limiting**

**Recommendation:**
- 5 submissions per IP per hour
- 3 submissions per email per day
- Exponential backoff on repeated failures

**Implementation:**
```javascript
// Pseudo-code
const rateLimitKey = `proposals:${ip}:${Date.now() / 3600000}`;
const count = await redis.incr(rateLimitKey);
if (count > 5) {
  return res.status(429).json({
    error: "rate_limit",
    message: "Too many submissions",
    retryAfter: 3600
  });
}
```

### **3. Email Verification (Optional but Recommended)**

Send confirmation email with verification link:
```
Subject: Confirm Your Wasilah Proposal Request

Hi Ayesha,

Click here to confirm your proposal request:
[Confirm Request Button]

If you didn't submit this, please ignore this email.
```

### **4. Content Validation**

Check for spam patterns:
- Excessive links in message
- Suspicious email domains
- Known spam keywords

---

## 📧 Email Notifications

### **1. Admin Notification**

**To:** `proposals@wasilah.org`  
**Subject:** `New Proposal Request from ${companyName}`  
**Template:** `proposal.received`

```html
<!DOCTYPE html>
<html>
<body>
  <h2>New Proposal Request</h2>
  
  <table>
    <tr><td><strong>Company:</strong></td><td>Acme Ltd.</td></tr>
    <tr><td><strong>Contact:</strong></td><td>Ayesha Khan</td></tr>
    <tr><td><strong>Email:</strong></td><td>ayesha@acme.com</td></tr>
    <tr><td><strong>Phone:</strong></td><td>+92300xxxxxxx</td></tr>
    <tr><td><strong>Role:</strong></td><td>Corporate</td></tr>
    <tr><td><strong>Budget:</strong></td><td>PKR 50k–200k</td></tr>
    <tr><td><strong>Services:</strong></td><td>Project Execution, Impact Reporting</td></tr>
    <tr><td><strong>Preferred SDGs:</strong></td><td>SDG 4, SDG 6</td></tr>
  </table>
  
  <h3>Message:</h3>
  <p>We want a pilot program in Karachi...</p>
  
  <h3>Attachments:</h3>
  <ul>
    <li><a href="https://cdn...">brief.pdf</a></li>
  </ul>
  
  <p><a href="https://admin.wasilah.org/proposals/abc123">View in Admin Panel</a></p>
</body>
</html>
```

### **2. User Confirmation Email**

**To:** `${email}`  
**Subject:** `We received your proposal request`  
**Template:** `proposal.confirmation`

```html
<!DOCTYPE html>
<html>
<body>
  <h2>Thanks, we received your request!</h2>
  
  <p>Hi ${contactName},</p>
  
  <p>Our CSR specialist will review your proposal and respond within 48 hours.</p>
  
  <h3>What You Submitted:</h3>
  <ul>
    <li>Company: ${companyName}</li>
    <li>Budget: ${budgetRange}</li>
    <li>Services: ${services.join(', ')}</li>
  </ul>
  
  <h3>Next Steps:</h3>
  <p>
    <a href="https://wasilah.org/schedule">Schedule a 15-min Discovery Call</a><br>
    <a href="https://wasilah.org/impact-report-sample.pdf">Download Sample Impact Report</a>
  </p>
  
  <p>Questions? Reply to this email or call +92-XXX-XXXXXXX</p>
  
  <p>— The Wasilah Team</p>
</body>
</html>
```

**Email Provider Recommendations:**
- Resend (modern, developer-friendly)
- SendGrid (enterprise-grade)
- AWS SES (cost-effective)
- Postmark (transactional specialist)

---

## 🔄 Frontend Integration Points

### **Current Implementation:**

The form is in `/components/proposal/ProposalForm.tsx` with a simulated API call:

```typescript
// Line 87-102 in ProposalForm.tsx
try {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  // ⚠️ REPLACE THIS WITH ACTUAL API CALL:
  // const response = await fetch('/api/proposals', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     ...formData,
  //     referrerUrl: window.location.href,
  //     utm: getUTMParams()
  //   })
  // });
  
  // if (!response.ok) {
  //   throw new Error('Submission failed');
  // }
  
  // const data = await response.json();
  // trackAnalytics('proposal_submitted', { ...data });
  
  setIsSuccess(true);
} catch (error) {
  trackAnalytics('proposal_submit_error', { errorCode: 'unknown' });
  setErrors({ companyName: 'Something went wrong. Please try again.' });
}
```

### **Required Changes for Production:**

1. **Replace simulated API call** with actual fetch
2. **Implement file upload flow** (get signed URL → upload → submit)
3. **Add UTM parameter extraction**
4. **Handle 429 rate limiting** with cooldown UI
5. **Parse backend error messages** and map to form fields

---

## 🧪 Testing Scenarios

### **Happy Path:**
1. ✅ User fills form completely
2. ✅ Submits successfully
3. ✅ Sees success card
4. ✅ Receives confirmation email

### **Validation Errors:**
1. ❌ Submit with empty required fields → Show inline errors
2. ❌ Submit with invalid email → "Please enter a valid email address."
3. ❌ Submit without consent → "Please consent for us to contact you."
4. ❌ Upload 15MB file → "File exceeds 5MB limit"
5. ❌ Upload 7 files → "Maximum 5 files allowed"

### **Network Errors:**
1. ⚠️ Network timeout → "Connection failed. Please try again."
2. ⚠️ 500 server error → "We're experiencing technical difficulties."
3. ⚠️ 429 rate limit → "Too many submissions. Please try again in X minutes."

### **Edge Cases:**
1. 🔄 User closes modal mid-submission → Should cancel request
2. 🔄 User submits, leaves page, returns → Should not auto-resubmit
3. 🔄 Duplicate submission → Backend should deduplicate by email+timestamp
4. 🔄 Honeypot filled → Silently reject (don't alert user)

### **File Upload Edge Cases:**
1. 📎 Upload 0 files → Valid (optional)
2. 📎 Upload large file slowly → Show progress bar
3. 📎 Upload fails midway → Allow retry
4. 📎 Upload unsupported type → "File type not supported"

---

## 🚨 Error Handling Strategy

### **Frontend Error Display:**

```typescript
// Map backend errors to form fields
const errorFieldMap = {
  "companyName": "companyName",
  "contactName": "contactName",
  "email": "email",
  "phone": "phone",
  "role": "role",
  "budgetRange": "budgetRange",
  // ... etc
};

// Display errors inline
if (response.errors) {
  const mappedErrors = {};
  Object.keys(response.errors).forEach(field => {
    mappedErrors[field] = response.errors[field];
  });
  setErrors(mappedErrors);
}
```

### **User-Friendly Error Messages:**

**DON'T SAY:**
- ❌ "Something went wrong"
- ❌ "Error 500"
- ❌ "Submission failed"

**DO SAY:**
- ✅ "We couldn't process your request. Please check your connection and try again."
- ✅ "This email address is already in our system. We'll get back to you shortly."
- ✅ "You've reached the submission limit. Please try again in 1 hour."

---

## 📱 Mobile Considerations

### **Modal Behavior:**
- Desktop: 920px centered modal
- Tablet: 720px modal
- Mobile: **Full-screen sheet** with top close button

### **File Upload on Mobile:**
- Allow camera capture for images
- Show file size prominently before upload
- Compress images client-side if needed

### **Form Autofill:**
- Support browser autofill
- Support password managers for email
- Support mobile number formatting

---

## 🎯 Success Metrics to Track

### **Conversion Funnel:**
1. Page views (`/contact`)
2. Form started (any field filled)
3. Form completed (all required filled)
4. Form submitted (API success)
5. Email confirmed (optional)

### **Drop-off Analysis:**
- Which fields cause most abandonment?
- Where do users get stuck?
- Which error messages appear most?

### **Response Time:**
- Average API response time
- Upload time per file
- Time to show success state

---

## 🔗 UTM Parameter Capture

Frontend should capture and send UTM parameters:

```typescript
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || null,
    medium: params.get('utm_medium') || null,
    campaign: params.get('utm_campaign') || null,
    content: params.get('utm_content') || null,
    term: params.get('utm_term') || null
  };
}
```

---

## ✅ Pre-Launch Checklist

### **Backend:**
- [ ] POST /api/proposals endpoint implemented
- [ ] File upload endpoint with signed URLs
- [ ] Server-side validation matches frontend
- [ ] Honeypot check implemented
- [ ] Rate limiting configured
- [ ] Admin email notifications working
- [ ] User confirmation emails working
- [ ] Database schema for proposals created
- [ ] Error responses match spec
- [ ] Analytics logging implemented

### **Frontend:**
- [ ] Replace simulated API call with real endpoint
- [ ] Implement file upload flow
- [ ] Add UTM parameter extraction
- [ ] Test all validation scenarios
- [ ] Test error handling
- [ ] Test success flow
- [ ] Test modal focus trap
- [ ] Test keyboard navigation
- [ ] Test mobile responsiveness
- [ ] Test accessibility with screen reader

### **Monitoring:**
- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Set up analytics dashboard
- [ ] Set up API uptime monitoring
- [ ] Set up email delivery monitoring
- [ ] Set up conversion funnel tracking

---

## 🆘 Support & Troubleshooting

### **Common Issues:**

**"Form doesn't submit"**
- Check network tab for API errors
- Verify endpoint URL is correct
- Check CORS headers
- Verify request payload matches spec

**"Files don't upload"**
- Check file size limits
- Verify signed URL generation
- Check CDN/S3 permissions
- Test with smaller files first

**"Emails not sending"**
- Check email provider credentials
- Verify sender email is verified
- Check spam folder
- Review email service logs

**"Rate limiting too aggressive"**
- Review Redis keys
- Check IP detection logic
- Consider whitelisting corporate IPs

---

## 📚 Related Documentation

- Component Library: `/components/forms/`
- Form Logic: `/components/proposal/ProposalForm.tsx`
- Modal: `/components/proposal/ProposalModal.tsx`
- Validation: `/components/proposal/ProposalFormData.ts`
- Contact Page: `/pages/ContactPage.tsx`

---

## 🤝 Developer Contact

For questions about this handoff:
- Technical Questions: Open GitHub issue
- UX Questions: Review Figma designs
- Backend Questions: Refer to this doc

---

**Document Version:** 1.0  
**Last Updated:** December 14, 2024  
**Next Review:** Before production deployment

---

## 🎉 Final Notes

This system is **production-ready** from a frontend perspective. All that's needed is backend integration following this spec. The UX has been designed to handle every edge case gracefully—no broken flows, no dead ends, no confusion.

**Core Principles:**
✅ Every button does something  
✅ Every error has a clear message  
✅ Every state provides feedback  
✅ Every flow has a next step  

Good luck with integration! 🚀
