# US-023: Tournament History

## Story

As a **visitor**,
I want to view a history page with past tournament editions, results, and key statistics,
so that I can understand the tournament's evolution and browse historical data.

## Context

- The history page serves as an archive of past tournament editions with match results and standings.
- This allows visitors to explore previous years' competitions and understand tournament traditions.
- Data can be hardcoded initially (as a static page), later integrated with backend when tournament editions are managed dynamically.
- This is Phase 2a work: a new static page to enhance historical documentation.

## Acceptance criteria

- [ ] Given I navigate to the tournament history page, when the page loads, then I see a list or timeline of past tournament editions.
- [ ] Given I view the history list, when I look at each entry, then it displays the tournament year/edition and a summary (number of teams, winner, or key highlights).
- [ ] Given I click on or view a specific edition, when I interact with it, then I can see more details such as final standings, match results, or participant list.
- [ ] Given I view the history on a mobile device, when I scroll, then the timeline or list is easy to read without horizontal scrolling.
- [ ] Given I'm on the history page, when I view the navigation, then there's a clear link from the main menu or footer to reach this page.
- [ ] Given I view a past edition entry, when I look at the styling, then it's visually distinct and easy to scan (cards, timeline visual, etc.).

## Notes

- Design could use a timeline layout for a chronological view, or cards/rows for a list view.
- Each edition can link to detailed results, standings, and participant rosters once backend is in place.
- Consider numbering editions for easy reference (e.g., "Ölcupen I", "Ölcupen II").
