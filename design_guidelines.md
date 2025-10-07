# Design Guidelines for Overnight-React

## Design Approach: Fintech Reference-Based with Material Design Foundation

**Selected Approach:** Hybrid reference-based design drawing from fintech leaders (Stripe, Wise, Robinhood) with Material Design UI foundation for consistency and accessibility.

**Justification:** Financial applications demand trust, clarity, and modern aesthetics. Users need confidence in handling money while experiencing a seamless, app-like interface. The PWA nature requires progressive, responsive patterns that feel native.

**Core Design Principles:**
- Trust through clarity: Clean layouts, readable typography, transparent information hierarchy
- Financial confidence: Professional color palette, precise data presentation, secure visual language
- Progressive enhancement: App-like interactions, smooth transitions, offline-ready feel

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 243 75% 59% (Confident blue - trust, security)
- Secondary: 262 52% 47% (Deep purple - premium feel)
- Success: 142 71% 45% (Financial green - growth, profit)
- Error: 0 84% 60% (Alert red - warnings, losses)
- Background: 0 0% 100% (Pure white)
- Surface: 220 14% 96% (Soft gray - cards, containers)
- Text Primary: 222 47% 11% (Near black)
- Text Secondary: 215 16% 47% (Muted gray)

**Dark Mode:**
- Primary: 243 75% 65% (Brighter blue for contrast)
- Secondary: 262 47% 55% (Adjusted purple)
- Success: 142 71% 50% (Vibrant green)
- Error: 0 84% 65% (Bright red)
- Background: 222 47% 11% (Deep navy-black)
- Surface: 217 33% 17% (Elevated dark surface)
- Text Primary: 210 20% 98% (Off white)
- Text Secondary: 215 20% 65% (Light gray)

**Accent Colors (Use Sparingly):**
- Gold highlight: 43 96% 56% (Premium features, rewards)
- Teal data: 174 72% 56% (Charts, data points)

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - UI, body text, data
- Display: 'Manrope' (Google Fonts) - Headlines, hero text
- Monospace: 'JetBrains Mono' - Financial figures, amounts

**Type Scale:**
- Display: 3.5rem/4rem (56px/64px) - Hero headlines
- H1: 2.5rem/3rem (40px/48px) - Page titles
- H2: 2rem/2.5rem (32px/40px) - Section headers
- H3: 1.5rem/2rem (24px/32px) - Card titles
- H4: 1.25rem/1.75rem (20px/28px) - Subsections
- Body Large: 1.125rem/1.75rem (18px/28px) - Important content
- Body: 1rem/1.5rem (16px/24px) - Default text
- Small: 0.875rem/1.25rem (14px/20px) - Metadata, labels
- Caption: 0.75rem/1rem (12px/16px) - Disclaimers

**Financial Numbers:**
- Large amounts: Manrope Bold, 2rem+
- Regular amounts: JetBrains Mono Medium, 1.25rem
- Percentage changes: Inter SemiBold with color (green/red)

### C. Layout System

**Spacing Primitives (Tailwind Units):**
- Micro spacing: 1, 2 (4px, 8px) - Icon gaps, tight elements
- Standard spacing: 4, 6, 8 (16px, 24px, 32px) - Component padding, margins
- Section spacing: 12, 16, 20 (48px, 64px, 80px) - Vertical rhythm
- Page spacing: 24, 32 (96px, 128px) - Hero padding, major sections

**Grid System:**
- Container max-width: max-w-7xl (1280px)
- Content max-width: max-w-4xl (896px) for forms/text
- Column gaps: gap-6 (24px) mobile, gap-8 (32px) desktop

**Responsive Breakpoints:**
- Mobile: base (< 640px)
- Tablet: md (768px+)
- Desktop: lg (1024px+)
- Wide: xl (1280px+)

### D. Component Library

**Navigation:**
- Top navbar: Fixed, glass morphism effect (backdrop-blur-md), 64px height
- Logo: Left aligned, 40px height
- Nav items: Center or right, Inter Medium 0.875rem
- Auth buttons: MUI Button variant="contained" (sign in), variant="outlined" (sign up)
- Mobile: Hamburger menu, slide-in drawer

**Hero Section:**
- Height: 85vh on desktop, auto on mobile
- Layout: Asymmetric - 55% content left, 45% visual right
- Background: Subtle gradient overlay (primary color at 5% opacity)
- Headline: Manrope Bold, 3.5rem, tight leading
- Subheading: Inter Regular, 1.25rem, text-secondary
- CTA group: Primary button + secondary link, flex gap-4
- Hero image: Financial dashboard mockup, slight perspective tilt (3-5°), shadow-2xl

**Cards:**
- Default: rounded-xl (12px), p-6, shadow-sm
- Elevated: shadow-lg, hover:shadow-xl transition
- Glass: backdrop-blur-md, bg-white/80 (light) or bg-surface/40 (dark)
- Financial cards: border-l-4 with status color (green/red), monospace amounts

**Forms:**
- Input fields: MUI TextField, variant="outlined", full width
- Focus state: Primary color border, 2px
- Error state: Error color border, helper text below
- Success state: Success color with checkmark icon
- Labels: Inter Medium, 0.875rem, mb-2
- Spacing: mb-6 between fields

**Buttons:**
- Primary: MUI Button variant="contained", rounded-lg, px-8 py-3
- Secondary: variant="outlined", same padding
- Ghost: variant="text" for tertiary actions
- Loading: CircularProgress inside button, disable pointer events
- Icon buttons: 40x40px, rounded-full hover background

**Data Display:**
- Stats cards: Large number (Manrope Bold 2.5rem), label below (Inter 0.875rem), trend indicator
- Charts: Use Material-UI colors, 16:9 aspect ratio containers
- Tables: Stripe rows (bg-surface for alternate), sticky header, hover highlight
- Progress bars: Linear with primary color, 8px height, rounded-full

**Authentication:**
- Auth modals: Centered, max-w-md, p-8, rounded-2xl
- Google sign-in: MUI Button with Google icon, white background (light) or surface (dark)
- Divider: "or continue with email" - horizontal line with text
- Form layout: Single column, generous spacing (mb-6)

**Overlays:**
- Modal backdrop: bg-black/50, backdrop-blur-sm
- Dialogs: slide-in from bottom (mobile), fade-in center (desktop)
- Tooltips: bg-gray-900, text-white, text-sm, rounded-lg, shadow-lg
- Snackbars: Bottom center, auto-dismiss, MUI Snackbar component

### E. Page-Specific Layouts

**Landing/Marketing Pages:**
- Hero: 85vh, asymmetric split, large hero image (financial dashboard/app mockup)
- Features: 3-column grid (lg:grid-cols-3), icon-title-description cards
- How It Works: Stepped flow visualization, numbered circles, connecting lines
- Social Proof: 2-column testimonials, avatar-quote-name pattern
- Pricing: 3-tier cards, highlight middle option, annual/monthly toggle
- FAQ: Accordion pattern, max-w-3xl centered
- Footer: 4-column layout, newsletter signup, social links

**Dashboard:**
- Sidebar: 280px fixed left (desktop), slide drawer (mobile)
- Top bar: Search, notifications, user menu
- Main content: Grid layout, responsive cards
- Quick stats: 4-column grid at top showing key metrics
- Recent activity: Table or timeline component

**Transaction/Payment Pages:**
- Two-column: Form left (60%), summary right (40%) sticky
- Amount input: Extra large, center-aligned, monospace
- Payment method cards: Visual cards with radio selection
- Stripe elements: Custom styled to match design system
- Security badges: Trust indicators near submit button

### F. Animations & Interactions

**Micro-interactions (Use Sparingly):**
- Button hover: slight scale (1.02), shadow increase, 150ms ease
- Card hover: lift effect (translateY -2px), shadow-lg, 200ms ease
- Input focus: border color transition, 150ms
- Number animations: Count-up effect for financial figures (react-countup)

**Page Transitions:**
- Route changes: Fade in new content, 200ms
- Modal entry: Slide up (mobile) or scale + fade (desktop), 250ms
- Loading states: Skeleton screens matching content layout

**PWA Indicators:**
- Install prompt: Slide up from bottom, dismiss button
- Offline indicator: Snackbar at top, yellow background
- Update available: Banner with refresh action

---

## Images

**Hero Section:**
- **Primary Hero Image:** Modern financial dashboard mockup showing the overnight income interface with charts, transaction history, and earnings summary. Style: Clean, light/dark mode compatible, subtle depth with perspective tilt (3-5°), shadow-2xl. Placement: Right side of hero (45% width), vertically centered.

**Feature Sections:**
- **Security Icon Imagery:** Abstract illustrations of lock/shield concepts, gradient style matching brand colors. Placement: Feature card icons, 64x64px.
- **Growth Visualization:** Line chart or bar graph showing upward trend, minimal, modern aesthetic. Placement: "How It Works" section, illustrative.

**Trust Indicators:**
- **Partner Logos:** Bank logos, payment provider badges. Style: Grayscale with slight opacity, hover to full color. Placement: Below hero or in footer.
- **Testimonial Avatars:** Professional headshots, circular crop, 48px diameter. Placement: Social proof section alongside quotes.

**Background Elements:**
- **Subtle Pattern:** Dot grid or subtle geometric pattern in brand color at 3% opacity. Placement: Section backgrounds for visual interest without distraction.

---

## Accessibility & Best Practices

- Maintain WCAG AA contrast ratios (4.5:1 text, 3:1 UI)
- Focus indicators: 2px primary color outline, 4px offset
- Form validation: Error text + icon, ARIA labels
- Keyboard navigation: Logical tab order, skip links
- Dark mode: Consistent implementation across all components, respect system preference
- Loading states: Skeleton screens or spinners, never blank pages
- Error boundaries: Friendly error messages with recovery actions