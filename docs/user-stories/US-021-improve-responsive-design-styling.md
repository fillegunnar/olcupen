# US-021: Improve Responsive Design & Styling

## Story

As a **visitor**,
I want the website to have a modern, professional appearance with better styling and responsive design,
so that I have a better user experience across all devices and the site reflects the tournament's quality.

## Context

- The current site has basic styling that needs modernization using TailwindCSS.
- The design should be mobile-first and responsive, working well on phones, tablets, and desktops.
- Improvements include better color scheme, typography, spacing, visual hierarchy, and component consistency.
- This is Phase 2a work: styling and polish of the _static_ site before backend integration.

## Acceptance criteria

- [ ] Given I visit the site on a mobile device (375px width), when I navigate through pages, then all content is readable and interactive elements are appropriately sized.
- [ ] Given I visit the site on a tablet (768px width), when I scroll and interact, then the layout adapts gracefully without horizontal scrolling.
- [ ] Given I visit the site on a desktop (1440px width), when I view the page, then the layout leverages the screen space with proper alignment and spacing.
- [ ] Given I view the navigation bar, when I view it on mobile, then it includes a hamburger menu that collapses navigation items.
- [ ] Given I scroll through any page, when I reach the footer, then it displays contact info, links, and branding consistently across all pages.
- [ ] Given I interact with buttons, links, and form inputs, when I hover or focus on them, then they have visible feedback (color change, underline, shadow).
- [ ] Given I view headings and body text, when I read the content, then typography is clear with appropriate font sizes, weights, and line spacing.
- [ ] Given I visit the site, when I view any page, then the color scheme is cohesive, professional, and uses a consistent palette across all components.

## Notes

- Use TailwindCSS for styling to ensure consistency and rapid development.
- Consider accessibility: WCAG AA compliance for color contrast, keyboard navigation, and screen reader support.
- Establish a reusable component library (buttons, cards, modals, etc.) that can be carried forward to React migration.
