# US-024: Ölbladet — Tournament Newspaper & Timeline

## Story

As a **visitor**,
I want to browse "Ölbladet" — a newspaper-style page of tournament stories, records, and memorable moments — and switch between reading the latest stories first or exploring them on a historical timeline,
so that I can stay up to date with new content or relive the tournament's history in chronological order.

## Context

- "Ölbladet" is a newspaper-themed page that publishes stories about the tournament: records, fun facts, memorable moments, milestones, and behind-the-scenes observations.
- The newspaper format means content doesn't need to be added all at once — stories are published over time, each with a headline, a publish date, and an event date (when the event actually happened in tournament history).
- Two view modes let visitors choose how they want to browse:
  - **Latest stories** — ordered by publish date (newest first), like reading today's paper.
  - **Historical timeline** — ordered by event date, so visitors can walk through tournament history from earliest to most recent.
- Stories vary in length: most are a headline with a paragraph or two, but some may be longer feature pieces.
- The first batch of stories will be hardcoded/static content. Dynamic content management via an admin API is a future enhancement.
- This is Phase 2a work: a new content page that adds personality, engagement, and a sense of living history to the site.

## Acceptance criteria

- [ ] Given I navigate to "Ölbladet", when the page loads, then I see a newspaper-styled page with a collection of published stories.
- [ ] Given I view the page, when I look at the default view, then stories are shown in "Latest stories" order (newest publish date first).
- [ ] Given I'm viewing "Latest stories", when I switch to "Historical timeline" mode, then stories reorder by event date (earliest first) and are presented along a visual timeline.
- [ ] Given I'm viewing the historical timeline, when I switch back to "Latest stories" mode, then stories return to publish-date order (newest first).
- [ ] Given I view a story, when I read it, then I see a headline, a publish date, an event date (e.g., "Happened: Summer 2019"), and the story body text.
- [ ] Given I view a short story (1–2 paragraphs), when I read it, then it is displayed inline without unnecessary whitespace or empty sections.
- [ ] Given I view a longer feature story, when I read it, then the layout accommodates the full text comfortably with clear readability.
- [ ] Given I'm on the page, when I look at the main navigation, then there is a clear link to "Ölbladet".
- [ ] Given I view the page on a mobile device, when I browse stories in either mode, then the layout is responsive, readable, and requires no horizontal scrolling.
- [ ] Given I view the page, when I look at the overall design, then it has a newspaper/editorial feel (typography, layout, and visual style evoke a newspaper or gazette).

## Notes

- Each story has at minimum: headline, publish date, event date, and body text. Optionally an image or icon.
- Publish date = when the story was added to the site. Event date = when the thing actually happened (used for timeline ordering).
- The newspaper aesthetic should feel playful and match the tournament's casual, fun vibe — think local sports gazette rather than formal broadsheet.
- Stories vary from short blurbs ("Most goals in a single match: 12 — Summer 2021") to multi-paragraph features.
- **Future enhancements** (potential follow-up stories):
  - Admin API for organizers to add, edit, and remove stories without code changes.
  - Visitor story tip submission — visitors can suggest facts or stories for the editors to review.
  - Subscription/notification — visitors can subscribe to be notified when new stories are published.
