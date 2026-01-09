# 🎨 Solutions Page - Developer Handoff Documentation

**Page Name:** Solutions (formerly CSR Solutions)  
**Version:** 2.0  
**Last Updated:** December 2024  
**Status:** Production Ready

---

## 📋 Change Log

**What Changed:**
- ✅ Renamed "CSR Solutions" → "Solutions"
- ✅ Consolidated services into 5 modular blocks
- ✅ Added interactive SDG map with click highlighting
- ✅ Integrated reusable ProposalModal component
- ✅ Added responsive variants (desktop/tablet/mobile)
- ✅ Enhanced "How It Works" 5-step flow
- ✅ Added Corporate Experiences section
- ✅ Added Pricing Snapshot section
- ✅ Improved FAQ section
- ✅ Full accessibility implementation
- ✅ Analytics event tracking throughout

---

## 🎨 Design Tokens

### Colors

```css
/* Primary */
--color-primary: #0d9488;        /* teal-600 */
--color-primary-dark: #0f766e;   /* teal-700 */
--color-primary-light: #14b8a6;  /* teal-500 */

/* Secondary */
--color-secondary: #2563eb;      /* blue-600 */
--color-secondary-dark: #1e40af; /* blue-700 */
--color-secondary-light: #3b82f6; /* blue-500 */

/* Accent */
--color-accent: #8b5cf6;         /* violet-600 */
--color-accent-light: #a78bfa;   /* violet-400 */

/* Neutrals */
--color-neutral-900: #0f172a;    /* slate-900 */
--color-neutral-700: #334155;    /* slate-700 */
--color-neutral-600: #475569;    /* slate-600 */
--color-neutral-500: #64748b;    /* slate-500 */
--color-neutral-400: #94a3b8;    /* slate-400 */
--color-neutral-200: #e2e8f0;    /* slate-200 */
--color-neutral-100: #f1f5f9;    /* slate-100 */
--color-neutral-50: #f8fafc;     /* slate-50 */
--color-white: #ffffff;

/* Semantic */
--color-success: #10b981;        /* green-500 */
--color-danger: #ef4444;         /* red-500 */
--color-warning: #f59e0b;        /* amber-500 */
--color-info: #3b82f6;           /* blue-500 */
```

### Typography

```css
/* Headings */
--text-h1: 48px / 56px;          /* font: Inter, weight: 700 */
--text-h2: 36px / 44px;          /* font: Inter, weight: 700 */
--text-h3: 24px / 32px;          /* font: Inter, weight: 600 */
--text-h4: 20px / 28px;          /* font: Inter, weight: 600 */

/* Body */
--text-body-lg: 18px / 28px;     /* font: Inter, weight: 400 */
--text-body: 16px / 24px;        /* font: Inter, weight: 400 */
--text-body-sm: 14px / 20px;     /* font: Inter, weight: 400 */
--text-small: 12px / 16px;       /* font: Inter, weight: 400 */
```

### Spacing Scale

```css
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-20: 80px;
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

---

## 📦 Component Library

### **Button Component**

**Variants:**
- `primary`: Gradient teal-to-blue, white text
- `secondary`: White background, slate border, slate text
- `ghost`: Transparent, slate text

**States:**
- Default
- Hover (scale 1.02, shadow-lg)
- Active (scale 0.98)
- Disabled (opacity 0.5, cursor not-allowed)
- Loading (spinner icon)

**Export Name:** `Button`

**Usage:**
```tsx
<button className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all hover:scale-105">
  Request Pilot
</button>
```

### **ServiceBlock Component**

**Variants:**
- Collapsed (default)
- Expanded (shows process steps, duration, cost)
- Highlighted (when SDG is selected)

**Props:**
```typescript
{
  title: string;
  summary: string;
  outcomes: string[];
  sdgs: number[];
  processSteps: string[];
  duration: string;
  costModel: string;
  deliverables: string[];
  onRequestService: (serviceName: string) => void;
  isHighlighted?: boolean;
}
```

**Export Name:** `ServiceBlock`

### **SDG Icon Component**

**Size:** 40px × 40px (default), 32px × 32px (small)  
**Format:** Colored circles with white text  
**Interaction:** Clickable, hover tooltip

**SDG Colors:**
| SDG | Color | Hex |
|-----|-------|-----|
| 1   | Red   | #E5243B |
| 2   | Yellow| #DDA63A |
| 3   | Green | #4C9F38 |
| 4   | Red   | #C5192D |
| 5   | Orange| #FF3A21 |
| 6   | Cyan  | #26BDE2 |
| 7   | Yellow| #FCC30B |
| 8   | Red   | #A21942 |
| 9   | Orange| #FD6925 |
| 10  | Pink  | #DD1367 |
| 11  | Orange| #FD9D24 |
| 12  | Yellow| #BF8B2E |
| 13  | Green | #3F7E44 |
| 14  | Blue  | #0A97D9 |
| 15  | Green | #56C02B |
| 16  | Blue  | #00689D |
| 17  | Blue  | #19486A |

**Export Name:** `SDGIcon`

### **ProposalModal Component**

**Variants:**
- Desktop: 920px centered
- Tablet: 720px centered
- Mobile: Full-screen sheet

**States:**
- Initial (empty or prefilled)
- Validation errors
- Submitting (spinner)
- Success (thank you card)
- Error (toast + retry)

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  prefillService?: string;
  origin?: 'hero' | 'solutions_card' | 'header' | 'footer';
}
```

**Export Name:** `ProposalModal`

### **Accordion Component**

**Used in:** FAQ, How It Works

**States:**
- Collapsed (default)
- Expanded (smooth slide animation)

**Animation:** 180-220ms ease-out

### **KPI Tile Component**

**Structure:**
- Large number (48px)
- Label text (14px, slate-600)

**Example:**
```tsx
<div>
  <div className="text-slate-900 text-2xl">127</div>
  <div className="text-slate-600 text-sm">Pilots Run</div>
</div>
```

---

## 🎯 Interaction Specifications

### **SDG Map Interaction**

**Behavior:**
1. User clicks SDG icon
2. Icon scales to 110%, adds teal ring
3. Related service blocks highlight (teal border, ring)
4. Info panel slides up from bottom
5. Click same SDG again to deselect
6. Click different SDG to switch

**Animation:** 200ms ease-out

**Implementation:**
```typescript
const [selectedSDG, setSelectedSDG] = useState<number | null>(null);

const handleSDGClick = (sdgId: number) => {
  if (selectedSDG === sdgId) {
    setSelectedSDG(null); // Deselect
  } else {
    setSelectedSDG(sdgId); // Select new
  }
};
```

### **Service Block Expansion**

**Behavior:**
1. User clicks "See Details" button
2. Expanded section slides down (200ms)
3. Button text changes to "Show Less"
4. Icon rotates (chevron down → up)

**State Management:**
```typescript
const [isExpanded, setIsExpanded] = useState(false);
```

### **ProposalModal Prefill**

**Behavior:**
1. User clicks "Request This" on service card
2. Modal opens with `prefillService` parameter
3. "Services of Interest" field pre-selects that service
4. User can modify selection

**Data Flow:**
```typescript
// Service card triggers:
onRequestService("CSR Strategy & Planning");

// Modal receives:
<ProposalModal 
  prefillService="CSR Strategy & Planning"
  origin="solutions_card"
/>
```

### **How It Works Flow**

**Behavior:**
1. User clicks step circle
2. Circle highlights (gradient)
3. Details panel slides in from bottom
4. Click same step to close
5. Click different step to switch

---

## 📊 Analytics Event Mapping

### **Event List**

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `solutions_page_view` | Page loads | `{ referrer, utm_params }` |
| `solutions_hero_request_pilot` | Hero CTA click | `{ cta_location: 'hero' }` |
| `solutions_hero_see_solutions` | Scroll CTA click | `{ scroll_target: 'solutions' }` |
| `solutions_request_service` | Service block CTA | `{ service_name: string }` |
| `solutions_expand_service` | See Details click | `{ service_name: string, is_expanded: boolean }` |
| `sdg_click` | SDG icon click | `{ sdg_id: number, is_selected: boolean }` |
| `how_it_works_step_click` | Step circle click | `{ step_name: string, step_number: number }` |
| `book_experience` | Experience CTA click | `{ experience_type: string }` |
| `request_pricing` | Pricing card CTA | `{ pricing_model: string }` |
| `faq_click` | FAQ accordion click | `{ faq_question: string, is_expanded: boolean }` |
| `proposal_modal_open` | Modal opens | `{ origin: string, prefill_service?: string }` |
| `proposal_submitted` | Form success | `{ service_name: string, role: string, budget: string }` |

### **Implementation Example**

```typescript
// Add data attributes to clickable elements:
<button 
  onClick={handleClick}
  data-analytics="solutions_request_service"
  data-service-name={serviceName}
>
  Request This
</button>

// Fire event in handler:
trackAnalytics('solutions_request_service', {
  service_name: serviceName,
  timestamp: new Date().toISOString()
});
```

---

## 📱 Responsive Breakpoints

### **Desktop (1440px+)**

**Layout:**
- 2-column grids for services (if applicable)
- SDG grid: 9 columns
- Max content width: 1280px (7xl)
- Padding: 24px horizontal

### **Tablet (768px - 1439px)**

**Layout:**
- Services: single column
- SDG grid: 6 columns
- Reduced padding: 16px horizontal
- Modal: 720px width

### **Mobile (375px - 767px)**

**Layout:**
- All single column
- SDG grid: 4 columns
- Reduced spacing (16px sections)
- Modal: fullscreen sheet
- Sticky CTAs at bottom

**Responsive Adjustments:**
```css
/* Desktop */
@media (min-width: 1440px) {
  .service-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1439px) {
  .sdg-grid { grid-template-columns: repeat(6, 1fr); }
}

/* Mobile */
@media (max-width: 767px) {
  .sdg-grid { grid-template-columns: repeat(4, 1fr); }
  .modal { width: 100vw; height: 100vh; }
}
```

---

## 🎨 Asset Export Instructions

### **Hero Video Thumbnail**
- Format: WEBP (with JPEG fallback)
- Size: 1200×675px (16:9 aspect ratio)
- Filename: `solutions-hero-video-thumb.webp`

### **SDG Icons**
- Format: SVG (preferred) or PNG 2x
- Size: 64×64px (@2x = 128×128px)
- Naming: `sdg-icon-{number}.svg` (e.g., `sdg-icon-04.svg`)

### **Case Study Thumbnails**
- Format: WEBP (with JPEG fallback)
- Size: 800×600px (4:3 aspect ratio)
- Filename: `case-study-{id}-thumb.webp`

### **Export Settings:**
- SVG: Outline strokes, flatten transparencies
- WEBP: Quality 85, lossless for icons
- JPEG: Quality 90, progressive

---

## ♿ Accessibility Notes

### **Keyboard Navigation**

**Tab Order:**
1. Header navigation
2. Hero CTAs
3. Service block CTAs
4. SDG icons (grid)
5. Accordion triggers
6. Modal (when open)

**Focus States:**
- All interactive elements have visible focus ring
- Ring: 2px solid teal-600, offset 2px

### **Screen Reader Support**

**ARIA Labels:**
```html
<!-- SDG Icons -->
<button 
  aria-label="SDG 4: Quality Education"
  title="Quality Education"
>
  4
</button>

<!-- Accordion -->
<button 
  aria-expanded="false"
  aria-controls="faq-panel-1"
>
  How do you vet NGO partners?
</button>

<!-- Modal -->
<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
```

### **Alt Text (Image Descriptions)**

```html
<!-- Hero -->
<img alt="Corporate volunteers planting trees with children in rural Pakistan, showcasing CSR impact" />

<!-- Case Study -->
<img alt="50 volunteers from Acme Corp cleaning Karachi beach, collected 200kg of plastic waste" />

<!-- Video Thumbnail -->
<img alt="Time-lapse video showing tree plantation project from planning to 500 trees planted" />
```

### **Color Contrast**

**WCAG AA Compliance:**
- Body text on white: 4.5:1 minimum (slate-700 #334155)
- Large headings: 3:1 minimum (slate-900 #0f172a)
- Button text: 4.5:1 (white on teal-600)

---

## 🧪 Prototype Interaction Links

### **Working Flows:**

1. **Hero → Solutions Scroll**
   - Click "See Solutions" → Smooth scroll to #solutions anchor

2. **SDG → Service Highlight**
   - Click SDG icon → Highlights related services
   - Click again → Clears filter

3. **Service → Modal**
   - Click "Request This" → Opens modal with prefilled service

4. **Case Study → Detail Modal**
   - Click "Read More" → Opens detail modal with PDF preview

5. **Experience → Modal**
   - Click "Book Experience" → Opens modal with event type prefilled

6. **Pricing → Modal**
   - Click "Request Pricing" → Opens modal with pricing model prefilled

7. **Modal Submit → Success**
   - Fill form → Click submit → Spinner → Success state

---

## 🚀 Production Checklist

- [ ] All components exported with correct names
- [ ] Design tokens documented and consistent
- [ ] Responsive variants tested (375px, 768px, 1440px)
- [ ] All interactions prototyped and working
- [ ] Analytics events implemented
- [ ] Accessibility audit passed
- [ ] Alt text added to all images
- [ ] Focus states visible on all interactive elements
- [ ] Color contrast meets WCAG AA
- [ ] Modal focus trap working
- [ ] ESC key closes modal
- [ ] Tab order logical
- [ ] Assets exported in correct formats
- [ ] Handoff documentation complete

---

## 📝 Developer Notes

### **Integration Points:**

1. **ProposalModal:** Already implemented in `/components/proposal/ProposalModal.tsx`
2. **Analytics:** Use existing `trackAnalytics()` function from `/components/proposal/ProposalFormData.ts`
3. **Navigation:** Connect to existing navigation system
4. **Footer:** Reuse existing footer component

### **State Management:**

```typescript
// Main Solutions Page state:
const [isModalOpen, setIsModalOpen] = useState(false);
const [prefillService, setPrefillService] = useState<string | undefined>();
const [selectedSDG, setSelectedSDG] = useState<number | null>(null);
```

### **API Endpoints (Future):**

- `POST /api/proposals` - Submit proposal request
- `GET /api/case-studies` - Fetch case studies
- `GET /api/sdg-mapping` - Get SDG-to-service mapping

---

**End of Handoff Documentation**  
For questions, refer to component source files in `/components/solutions/`
