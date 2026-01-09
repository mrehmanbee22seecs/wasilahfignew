# 🎨 Wasilah Proposal System - UX Flow Diagram

**Visual guide to all user interactions and state transitions**

---

## 🗺️ Complete User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         ENTRY POINTS                             │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
      [Landing Pages]   [Solutions Page]  [Header Nav]
       - Homepage          - CSR Cards      - Contact Link
       - Any page          - NGO Cards      - Sticky header
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                    ┌─────────────────┐
                    │  CONTACT PAGE   │
                    └─────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │                               │
              ▼                               ▼
    [Page-Embedded Form]              [Modal Trigger]
     - Scroll to form                  - Click CTA button
     - Full visibility                 - Opens modal overlay
              │                               │
              └───────────────┬───────────────┘
                              ▼
                    ┌─────────────────┐
                    │  PROPOSAL FORM  │
                    └─────────────────┘
```

---

## 📝 Form Interaction Flow

```
START: User Opens Form
    │
    ├──> [Prefill Check]
    │    └─> If from Solutions Card → Pre-select service
    │
    ├──> [Analytics] Track: "proposal_opened"
    │    └─> Payload: { origin, prefillService }
    │
    ▼
FORM FIELDS (Order of appearance)
    │
    1. Company Name      [Required] ────┐
    2. Contact Name      [Required]     │
    3. Email            [Required]     │
    4. Phone            [Optional]     │
    5. Role             [Required]     ├─> Real-time validation
    6. Budget Range     [Required]     │   (on blur)
    7. Services         [Chips]        │
    8. SDGs             [Icon Grid]    │
    9. Message          [Textarea]     │
    10. Attachments     [File Upload] ─┘
    11. Consent         [Checkbox]
    │
    ▼
USER CLICKS "Send Request"
    │
    ├──> [Analytics] Track: "proposal_submit_attempt"
    │
    ├──> [Validation]
    │    ├─> Frontend validation first
    │    ├─> Check all required fields
    │    ├─> Check field formats
    │    └─> Check file sizes
    │
    ├──> IF ERRORS ──────────────────────┐
    │    │                                │
    │    ├─> Show inline error messages  │
    │    ├─> Shake animation on fields   │
    │    ├─> Scroll to first error       │
    │    └─> Re-enable submit button     │
    │                                     │
    │    [User Fixes Errors] ◀───────────┘
    │         │
    │         └──> Return to validation
    │
    ├──> IF VALID ────────────────────────┐
    │    │                                 │
    │    ├─> Disable submit button        │
    │    ├─> Show loading spinner         │
    │    ├─> Upload files (if any)        │
    │    │   ├─> Get signed URLs          │
    │    │   ├─> Upload to CDN            │
    │    │   └─> Get file URLs            │
    │    │                                 │
    │    ├─> Submit to API                │
    │    │   └─> POST /api/proposals      │
    │    │                                 │
    │    ▼                                 │
    │   API RESPONSE                       │
    │    │                                 │
    │    ├──> SUCCESS (200) ──────────────┤
    │    │    │                            │
    │    │    ├─> [Analytics] Track:      │
    │    │    │   "proposal_submitted"    │
    │    │    │                            │
    │    │    ├─> Replace form with       │
    │    │    │   success card             │
    │    │    │                            │
    │    │    ├─> Show thank you message  │
    │    │    │                            │
    │    │    ├─> Show CTAs:              │
    │    │    │   - Schedule Call         │
    │    │    │   - Download Report       │
    │    │    │                            │
    │    │    └─> [Backend sends]         │
    │    │        - Admin notification    │
    │    │        - User confirmation     │
    │    │                                 │
    │    ├──> ERROR (400) ────────────────┤
    │    │    │                            │
    │    │    ├─> Map errors to fields    │
    │    │    ├─> Show inline messages    │
    │    │    └─> Re-enable submit        │
    │    │                                 │
    │    ├──> RATE LIMIT (429) ───────────┤
    │    │    │                            │
    │    │    ├─> Show cooldown message   │
    │    │    ├─> Disable for X minutes   │
    │    │    └─> Show retry timer        │
    │    │                                 │
    │    └──> SERVER ERROR (500) ─────────┤
    │         │                            │
    │         ├─> Show friendly message   │
    │         ├─> Log error to Sentry     │
    │         └─> Allow retry             │
    │                                      │
    └──────────────────────────────────────┘
                    │
                    ▼
                  [END]
```

---

## 🎯 Modal-Specific Flow

```
┌─────────────────────────────────────────┐
│         MODAL TRIGGER SOURCES           │
└─────────────────────────────────────────┘
                │
    ┌───────────┼───────────┬───────────┐
    │           │           │           │
    ▼           ▼           ▼           ▼
[Hero CTA]  [Footer]   [Header]   [Solutions]
   │           │           │           │
   └───────────┴───────────┴───────────┘
                │
                ▼
    ┌─────────────────────┐
    │   MODAL OPENS       │
    │   (180ms fade in)   │
    └─────────────────────┘
                │
                ├──> Overlay darkens (backdrop-blur)
                ├──> Focus trapped inside modal
                ├──> ESC key listener active
                ├──> Body scroll locked
                └──> First field autofocused
                │
                ▼
    ┌─────────────────────┐
    │   USER ACTIONS      │
    └─────────────────────┘
                │
        ┌───────┼───────┐
        │               │
        ▼               ▼
    [Fills Form]    [Closes Modal]
        │               │
        │               ├──> Click X button
        │               ├──> Click outside
        │               ├──> Press ESC
        │               └──> Returns to page
        │
        ▼
    [Submits]
        │
        ├──> Success → Show success card
        │              Keep modal open
        │              OR auto-close after 3s
        │
        └──> Error → Show error
                     Keep modal open
                     Allow retry
```

---

## 📤 File Upload Flow

```
USER SELECTS FILES
    │
    ├──> [Drag & Drop]
    │    └─> Drop zone highlights
    │        Dashed border pulses
    │        Scale animation
    │
    └──> [Click to Browse]
         └─> File picker opens
    │
    ▼
FRONTEND VALIDATION
    │
    ├──> Check file count (max 5)
    ├──> Check file types (pdf, docx, jpg, png, mp4)
    ├──> Check individual size (max 5MB each)
    └──> Check total size (max 10MB)
    │
    ├──> IF INVALID ────────────────┐
    │    │                           │
    │    ├─> Show error message     │
    │    ├─> Highlight drop zone    │
    │    └─> Reject file            │
    │                                │
    │    [User Fixes] ◀──────────────┘
    │         │
    │         └──> Try again
    │
    ├──> IF VALID ──────────────────┐
    │    │                           │
    │    ├─> Show file preview      │
    │    │   - Image: thumbnail     │
    │    │   - PDF: file icon       │
    │    │   - Video: video icon    │
    │    │                           │
    │    ├─> Show file name         │
    │    ├─> Show file size         │
    │    ├─> Show remove button     │
    │    │                           │
    │    └─> Add to attachments[]   │
    │                                │
    └────────────────────────────────┘
                │
                ▼
ON FORM SUBMIT
    │
    ├──> For each file:
    │    │
    │    1. Request signed URL
    │       GET /api/proposals/upload-url
    │       └─> { fileName, fileType, fileSize }
    │       
    │    2. Receive signed URL
    │       └─> { uploadUrl, fileId, expiresIn }
    │       
    │    3. Upload to CDN/S3
    │       PUT uploadUrl
    │       └─> Show progress (if large file)
    │       
    │    4. Get file URL
    │       └─> https://cdn.wasilah.org/uploads/abc123.pdf
    │
    └──> Include file URLs in proposal payload
         └─> attachments: [{ fileName, url, size, type }]
```

---

## 🎨 State Transitions

```
┌──────────────────────────────────────────────────────┐
│                  FORM STATES                         │
└──────────────────────────────────────────────────────┘

STATE 1: INITIAL
    └─> Empty form
        Placeholder text visible
        Submit button enabled
        All fields interactive

STATE 2: FILLING
    └─> User typing
        Real-time character count (message field)
        Real-time validation (on blur)
        Chips toggle on/off (services)
        SDG icons toggle selection

STATE 3: VALIDATING
    └─> Form submitted
        Check all rules
        Highlight errors (red border)
        Show error messages below fields
        Shake animation on error fields

STATE 4: SUBMITTING
    └─> API call in progress
        Submit button disabled
        Spinner icon rotating
        "Submitting..." text
        Form fields disabled
        Can't close modal (if modal)

STATE 5: SUCCESS ✅
    └─> Form hidden
        Success card visible
        Green checkmark icon
        Thank you message
        Next step CTAs
        Confetti animation (optional)

STATE 6: ERROR ❌
    └─> Form still visible
        Error banner at top
        Specific field errors highlighted
        Submit button re-enabled
        Allow retry
        Log error to analytics
```

---

## 🔄 Analytics Event Sequence

```
Timeline of Analytics Events:

T+0ms   │ proposal_opened
        │ ↓ origin: "hero"
        │
T+5s    │ (user reads and starts typing)
        │
T+30s   │ (user fills company name)
        │
T+45s   │ (user selects services)
        │ ↓ if prefilled
        │   proposal_prefill
        │
T+120s  │ (user clicks submit)
        │ ↓
        │   proposal_submit_attempt
        │
T+121s  │ (validation runs)
        │
T+122s  │ (API call starts)
        │
T+1500ms│ (API responds)
        │
        ├──> SUCCESS PATH
        │    │
        │    ├──> proposal_submitted ✅
        │    │    ↓ { proposalId, companyName, role, etc }
        │    │
        │    └──> User sees success card
        │
        └──> ERROR PATH
             │
             └──> proposal_submit_error ❌
                  ↓ { errorCode, errorMessage }
```

---

## 🎭 Interaction States (Hover, Focus, Disabled)

```
BUTTON STATES:

Default     │ bg-gradient-to-r from-teal-600 to-blue-600
            │ Cursor: pointer
            │
Hover       │ Scale: 1.02
            │ Shadow: xl
            │ Transition: 200ms
            │
Active      │ Scale: 0.98
            │ Shadow: lg
            │
Disabled    │ Opacity: 0.5
            │ Cursor: not-allowed
            │ No hover effect

─────────────────────────────────────────

INPUT STATES:

Default     │ Border: 2px solid slate-200
            │ Background: white
            │
Focus       │ Border: 2px solid teal-600
            │ Ring: 2px teal-100
            │ Outline: none
            │
Error       │ Border: 2px solid red-500
            │ Shake animation (400ms)
            │ Error icon + message below
            │
Disabled    │ Background: slate-50
            │ Opacity: 0.5
            │ Cursor: not-allowed

─────────────────────────────────────────

CHIPS (Service Selection):

Unselected  │ bg-white border-slate-200
            │ text-slate-700
            │
Hover       │ border-teal-600
            │ text-teal-600
            │
Selected    │ bg-teal-600 border-teal-600
            │ text-white
            │ Checkmark icon visible
            │
Disabled    │ bg-slate-50 border-slate-200
            │ text-slate-400
            │ Cursor: not-allowed

─────────────────────────────────────────

SDG ICONS:

Unselected  │ SDG color (e.g., red, blue)
            │ Scale: 1.0
            │ Shadow: sm
            │
Hover       │ Scale: 1.05
            │ Shadow: md
            │ Tooltip visible
            │
Selected    │ Ring: 4px teal-600
            │ Ring offset: 2px
            │ Scale: 1.1
```

---

## 🚨 Error Handling Decision Tree

```
ERROR OCCURS
    │
    ├──> TYPE: Validation Error
    │    │
    │    ├──> Show inline under field
    │    ├──> Red border on field
    │    ├──> Shake animation
    │    ├──> Scroll to first error
    │    └──> Keep form open
    │
    ├──> TYPE: Network Error
    │    │
    │    ├──> Show toast notification
    │    ├──> "Connection failed. Check your internet."
    │    ├──> Allow retry
    │    └──> Log to Sentry
    │
    ├──> TYPE: Rate Limit (429)
    │    │
    │    ├──> Show banner at top
    │    ├──> "Too many submissions. Try again in X minutes."
    │    ├──> Disable submit button
    │    ├──> Show countdown timer
    │    └──> Auto re-enable after cooldown
    │
    ├──> TYPE: Server Error (500)
    │    │
    │    ├──> Show friendly message
    │    ├──> "We're having technical difficulties."
    │    ├──> Suggest: "Please try again in a few minutes"
    │    ├──> Log to monitoring
    │    └──> Allow retry immediately
    │
    └──> TYPE: File Upload Error
         │
         ├──> Show error on file item
         ├──> "Upload failed. Please try again."
         ├──> Show retry button
         └──> Allow remove and re-upload
```

---

## ✅ Success Flow (Post-Submission)

```
FORM SUBMITTED SUCCESSFULLY
    │
    ▼
FRONTEND ACTIONS
    │
    ├──> Hide form (fade out 200ms)
    ├──> Show success card (fade in 200ms)
    ├──> Fire analytics event
    └──> Show next step CTAs
    │
    ▼
BACKEND ACTIONS (Async)
    │
    ├──> 1. Save to database
    │    └─> proposals table
    │        Insert row with all data
    │
    ├──> 2. Send admin email
    │    └─> To: proposals@wasilah.org
    │        Subject: "New Proposal from ${company}"
    │        Template: proposal.received
    │
    ├──> 3. Send user email
    │    └─> To: ${userEmail}
    │        Subject: "We received your request"
    │        Template: proposal.confirmation
    │
    ├──> 4. Log analytics
    │    └─> Track conversion
    │        Update funnel metrics
    │
    └──> 5. Trigger integrations
         ├─> Slack notification (optional)
         ├─> CRM sync (optional)
         └─> Webhook (optional)
    │
    ▼
USER NEXT ACTIONS
    │
    ├──> Click "Schedule a Call"
    │    └─> Opens Calendly / booking page
    │
    ├──> Click "Download Sample Report"
    │    └─> Downloads PDF
    │
    └──> Close modal / Stay on page
         └─> Continue browsing site
```

---

## 🔐 Security Flow

```
SUBMISSION RECEIVED
    │
    ▼
SECURITY CHECKS (Server-Side)
    │
    ├──> 1. Honeypot Check
    │    └─> IF website field not empty
    │        ├─> Reject silently (200 OK fake success)
    │        └─> Log as spam attempt
    │
    ├──> 2. Rate Limit Check
    │    └─> Check Redis counter
    │        └─> IF > 5 submissions/hour from IP
    │            ├─> Return 429
    │            └─> Set retry-after header
    │
    ├──> 3. Input Sanitization
    │    └─> Strip HTML tags
    │        Escape special chars
    │        Validate lengths
    │
    ├──> 4. Email Validation
    │    └─> Check format
    │        Check disposable domains
    │        Check MX records (optional)
    │
    ├──> 5. Content Analysis
    │    └─> Check for spam keywords
    │        Check for excessive links
    │        Check message sentiment
    │
    └──> ALL CLEAR ✅
         └─> Proceed with submission
```

---

## 📱 Responsive Behavior

```
DESKTOP (1440px+)
    ├──> Contact Page Layout
    │    ├─> Form: 66.67% width (2/3)
    │    └─> Contact Card: 33.33% width (1/3)
    │
    └──> Modal
         └─> Width: 920px centered
             Height: Auto (max 90vh)
             Padding: 24px

─────────────────────────

TABLET (768px - 1439px)
    ├──> Contact Page Layout
    │    ├─> Form: 100% width (stacked)
    │    └─> Contact Card: 100% width (below)
    │
    └──> Modal
         └─> Width: 720px centered
             Height: Auto (max 90vh)
             Padding: 20px

─────────────────────────

MOBILE (375px - 767px)
    ├──> Contact Page Layout
    │    ├─> Form: 100% width
    │    └─> Contact Card: 100% width
    │         Stacks vertically
    │
    └──> Modal
         └─> Fullscreen sheet
             Width: 100vw
             Height: 100vh
             Slides up from bottom
             Top bar: Close + Back
```

---

## 🎬 Animation Timeline

```
MODAL OPEN:
    0ms     │ Trigger clicked
    0-180ms │ Fade in overlay (backdrop)
            │ Zoom in modal (scale 0.95 → 1.0)
    180ms   │ Focus first field
            │ Enable focus trap

FIELD ERROR:
    0ms     │ Validation fails
    0-120ms │ Shake animation (translateX -4px → 4px)
    120ms   │ Show error message (fade in)
            │ Red border applied

FILE UPLOAD:
    0ms     │ File selected
    0-100ms │ Preview thumbnail fades in
    100ms   │ Show file details
            │ Enable remove button

SUCCESS STATE:
    0ms     │ API returns 200
    0-200ms │ Form fades out
    200ms   │ Success card fades in
    400ms   │ Checkmark scales in
    600ms   │ CTAs slide up
```

---

This complete UX flow diagram ensures every interaction is documented and predictable! 🎯
