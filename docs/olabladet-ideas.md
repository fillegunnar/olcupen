# Ölabladet — Feature Ideas

## View Modes

1. **Årskrönika (Year Chronicle)** ✅ IMPLEMENTED
   Group stories by tournament year with large year dividers. Each year is a collapsible section. Combined with timeline visual (gold line + dots).

2. **Kategorier (Categories)**
   Add a category column to the sheet (e.g. `matchreferat`, `rekord`, `minnen`, `kuriosa`) and render filter chips above the story list. Lets readers browse by interest rather than time.

3. **Rekordtavla (Records Dashboard)**
   A dedicated stats-first view that surfaces all `<an>` and `<sb>` widgets across stories into a single dashboard. Most goals in a match, longest winning streak, etc. — no article text, just the numbers.

4. **"Denna dag" (On This Day)**
   A small callout card at the top that highlights any story whose `eventSort` matches today's date in a previous year. Nostalgia trigger, zero effort once built.

## Layout & Visual Ideas

5. **Newspaper Front Page (Hero Card)** ✅ IMPLEMENTED
   In "latest" mode, the newest story renders as a large hero card (bigger headline, full body visible, gold accent border) and the rest as compact cards below.

6. **Pull Quotes**
   Add a `<pq;text>` tag in the sheet for dramatic one-liners. Rendered as large italic gold text in the middle of an article. E.g. *"Det var den vildaste finalen i Ölcupens historia."*

7. **Edition Header**
   A small line under the masthead like *"Upplaga 14 · Grundad 2013 · 47 artiklar"* — reinforces the newspaper identity and shows the archive is alive.

8. **Image Support**
   Add an optional image URL column to the sheet. Render as a banner at the top of expanded stories. Even one photo per story adds a lot of life.

## Content-Driven Widgets (Sheet Tags)

9. **Comparison Block `<vs;Team A;3;Team B;1;Final 2022>`**
   Renders a head-to-head score card. Perfect for match recaps.

10. **Quiz/Trivia `<quiz;question;answer>`**
    Tap-to-reveal fact. Fun for the `kuriosa` category.

11. **Table Block `<tbl;H1,H2,H3;r1c1,r1c2,r1c3;...>`**
    Simple data tables for group standings snapshots or historical results embedded in stories.
