# CampusOS Design System Principles

**"Your entire college life. One calm workspace."**

This document defines the core DESIGN PRINCIPLES for CampusOS. It serves as the definitive guide for implementing the UI/UX. It does not contain final CSS, but rather the philosophy and rules that govern the visual and interactive experience. Every UI decision must align with these principles.

## Design Philosophy

CampusOS must feel like a carefully designed premium productivity application.

**It must NOT look like:**
*   A generic admin dashboard
*   An AI startup landing page
*   A template marketplace dashboard
*   A grid of 12 identical cards
*   Excessive glassmorphism or gradients
*   Purple/blue AI gradients everywhere
*   Giant rounded rectangles or excessive shadows
*   Decorative blobs or unnecessary illustrations

**It SHOULD feel:**
*   Calm
*   Editorial
*   Modern
*   Information-dense
*   Intentional
*   Human-designed
*   Approachable
*   Sophisticated

## Visual Personality

*   **Character:** Clean, structured, warm-neutral, with purposeful color accents.
*   **Typography-first:** Information hierarchy is established through typography, not decoration or boxes.
*   **Whitespace:** Generous but not wasteful. Content sections must breathe, but dense data views remain compact.
*   **Depth:** Flat design with subtle depth cues. Do not use shadows everywhere.
*   **Invisible UI:** The UI should disappear; the content *is* the interface.
*   **Inspiration:** Think Linear, Notion, Things 3, Craft, Arc Browser design sensibility (without directly copying).

## Typography Principles

*   **Stack:** System font stack (Inter or Geist as primary, system fallbacks).
*   **Scale:** Strict type scale. Do not use arbitrary sizes.
*   **Hierarchy:**
    *   Page Title: 24px / 600 weight / tight line-height
    *   Section Title: 18px / 600 weight / tight line-height
    *   Card Title: 15px / 500 weight / normal line-height
    *   Body: 14px / 400 weight / relaxed line-height (1.6)
    *   Caption: 12px / 400 weight / normal line-height
    *   Label: 12px / 500 weight / normal line-height / uppercase tracking
    *   Code: 13px / monospace / 400 weight
*   **Weights:** Limit to 400 (regular), 500 (medium), and 600 (semibold). Never use bold overkill (700+).
*   **Line Heights:** Tight (1.2) for headings, relaxed (1.6) for body text.
*   **Letter Spacing:** Slightly tight (-0.01em) for large headings, normal for body text.
*   **Monospace:** Use for numbers in data displays, codes, and tabular numerical data.

## Color Philosophy

*   **Neutral-First:** Most of the UI is grayscale/neutral.
*   **Purpose:** Color is used for MEANING, never merely for decoration.
*   **Subject Colors:** A curated palette of 10 muted, distinguishable colors for subject tagging. These must work in both light and dark mode:
    1. `#3b82f6` (Blue)
    2. `#10b981` (Emerald)
    3. `#f59e0b` (Amber)
    4. `#ef4444` (Red)
    5. `#8b5cf6` (Violet)
    6. `#ec4899` (Pink)
    7. `#06b6d4` (Cyan)
    8. `#f97316` (Orange)
    9. `#6366f1` (Indigo)
    10. `#84cc16` (Lime)
*   **Semantic Colors:**
    *   Success: Green (muted)
    *   Warning: Amber (muted)
    *   Error: Red (muted)
    *   Info: Blue (muted)
*   **Accent Color:** ONE primary accent color (e.g., a sophisticated teal, indigo, or warm blue). Never use startup purple.
*   **Dark Mode:** True dark (not pure black), with warm undertones and reduced contrast to reduce eye strain.
*   **Absolute Don'ts:** Never use gradients for backgrounds. Never use color just for the sake of adding color.

## Spacing Philosophy

*   **Base Unit:** 4px grid.
*   **Scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
*   **Consistency:** Maintain consistent spacing within and between components.
*   **Density:** Dense data views (tables, lists) use tighter spacing. Content sections should breathe. Sidebar is compact but not cramped.
*   **Card Padding:** Consistent (either 16px or 20px). Never mix padding values within the same card type.

## Component Philosophy

*   **Foundation:** shadcn/ui. Customize it, don't fight it.
*   **Purpose:** Every component must earn its place. No decorative wrappers.
*   **Buttons:**
    *   Primary: Solid
    *   Secondary: Outline
    *   Tertiary: Ghost
*   **Cards:** Subtle border (not shadow-heavy). Consistent border radius (8px). No excessive rounding (never 16px+).
*   **Inputs:** Clean, properly labeled, with inline validation.
*   **Tables:** Clean lines, proper alignment, sortable headers.
*   **Badges/Tags:** Small, muted, informational—not decorative.
*   **Modals:** Use sparingly. Sheet/Drawer for forms. Dialog for confirmations.
*   **Empty States:** Helpful text + single action. No decorative illustrations.
*   **Loading:** Skeleton screens that match the content layout. Never spinners.

## Responsive Principles

*   **Desktop-First:** Design for desktop, responsive down to tablet (768px min). Mobile is usable but not optimized (future mobile app consideration).
*   **Sidebar:** Collapses to icon-only on smaller screens.
*   **Tables:** Become cards/lists on mobile.
*   **Command Palette:** Full-width on mobile.
*   **Scrolling:** NO horizontal scrolling ever.

## Accessibility Principles

*   **Semantic HTML:** Always use proper tags (`nav`, `main`, `section`, `article`, `button`). Never use `div` with `onclick`.
*   **Keyboard:** Full keyboard navigation for all interactive elements.
*   **Focus Indicators:** Visible and styled (not the browser default blue).
*   **Contrast:** WCAG AA minimum.
*   **Aria:** `aria-labels` required for icon-only buttons. Screen reader announcements for dynamic content.
*   **Motion:** Respect `prefers-reduced-motion`.
*   **Forms:** Form labels must always be visible, not placeholder-only.

## Motion Principles

*   **Purpose:** Motion is functional, not decorative.
*   **Transitions:**
    *   Page transitions: subtle fade (150-200ms)
    *   Element enter/exit: slide + fade (200-300ms)
    *   Hover states: instant color change, no delay
    *   Loading transitions: smooth skeleton shimmer
    *   List reordering: spring-based animation (via Motion)
*   **Never:** Bouncy animations, long delays, attention-seeking motion.
*   **Duration Scale:** Micro (100ms), Small (150ms), Medium (200ms), Large (300ms).
*   **Easing:** ease-out for entrances, ease-in for exits, spring for interactive.

## Information Hierarchy

*   **Focus:** Every screen has ONE primary focus.
    *   *Dashboard:* Today's agenda is primary, stats are secondary.
    *   *Tasks:* Task list is primary, filters are secondary.
    *   *Schedule:* Weekly grid is primary, day detail is secondary.
*   **Method:** Use size, weight, color, and position (not borders and boxes) to create hierarchy.
*   **Data:** Data-heavy views use tables with proper column priorities.
*   **Disclosure:** Progressive disclosure—show summary first, expand for detail.

## Anti-patterns (Things to NEVER do)

*   Don't add decorative elements that don't convey information.
*   Don't use icons without purpose.
*   Don't use hover effects that change layout.
*   Don't use tooltips for essential information.
*   Don't use hamburger menus on desktop.
*   Don't animate everything.
*   Don't use placeholder text as labels.
*   Don't use more than 2-3 colors on any single screen.
*   Don't add shadows to everything.
*   Don't use different border radius values in the same view.
*   Don't add gradient backgrounds.
*   Don't create walls of identically-sized cards.
*   Don't sacrifice information density for 'clean' aesthetics.

## Dashboard Design Rules

*   **Concept:** The dashboard is a daily briefing, NOT a metrics wall.
*   **Top Section:** Today's date, greeting, and quick summary sentence.
*   **Primary:** Today's schedule (next class, remaining classes).
*   **Secondary:** Pending tasks (due today, overdue, upcoming).
*   **Tertiary:** Quick stats (attendance %, this week's study hours, pending assignments count).
*   **NO:** Large charts, decorative widgets, motivational quotes, weather widgets.
*   **Layout:** Asymmetric and prioritized—not a 2x3 card grid.

## Sidebar Design Rules

*   **Behavior:** Fixed position, collapsible.
*   **Top:** Logo/brand mark (minimal).
*   **Navigation:** Icon + label. Active state indicated via background highlight (not color change).
*   **Bottom:** Settings, user avatar.
*   **Collapsed State:** Icons only with tooltips.
*   **Width:** ~240px expanded, ~64px collapsed.
*   **Hierarchy:** No nested navigation in MVP.
