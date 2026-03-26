You are a senior product designer working on OrientIA, an AI-powered 
student career orientation platform (Vite + React + Tailwind + shadcn/ui).

Design the SEARCH RESULTS PAGE for the portal.

——————————————————————————————————————
CONTEXT
——————————————————————————————————————
The student typed a query in the global search bar on the portal home 
(e.g. "designer", "médecin", "intelligence artificielle", "inclusion").
This page is the full results view that opens after they submit.

The tone stays warm and empowering — not a cold directory listing.
Results feel curated and intelligent, not just a keyword dump.

——————————————————————————————————————
PAGE STRUCTURE — FUNCTIONAL REQUIREMENTS
——————————————————————————————————————

SEARCH HEADER
- Persist the search bar at the top, pre-filled with the current query
- Show the number of results found and the query label
  e.g. "47 résultats pour « designer »"
- Allow the student to clear or modify the query inline

FILTERS & SORTING BAR
- Filter by result type (at minimum):
    · Métiers  · Simulateurs  · Professionnels  
    · Entreprises  · Ressources IA
- A secondary filter for sector / domain (e.g. tech, santé, art...)
- A sort option: Pertinence / Popularité / Nouveauté
- Show active filters as removable chips/tags
- A "Tout effacer" reset button when filters are active

RESULTS AREA — MIXED CONTENT TYPES
Results are not all the same type. The page must visually 
differentiate between:

  TYPE A — Career result
  A job/career that matches the query.
  Must show: job title, sector, short description (2 lines),
  an AI-generated match score or tag (e.g. "Très proche de ton profil"),
  and a quick-action to save or explore.

  TYPE B — Simulator result
  An interactive job simulation available on the platform.
  Must show: simulation title, estimated duration, difficulty level,
  a thumbnail or visual preview area, and a "Lancer" CTA.

  TYPE C — Professional profile
  A real professional available for mentoring or Q&A.
  Must show: avatar, name, job title, company, availability indicator,
  and a "Contacter" or "Voir le profil" CTA.

  TYPE D — Entreprise engagée
  A company with diversity/inclusion actions.
  Must show: company logo placeholder, company name, sector,
  1–2 active labels (e.g. "Label Diversité", "Index égalité 92/100"),
  and a "Voir les actions" CTA.

  TYPE E — Ressource IA
  An article, tool, or analysis about AI and job resilience.
  Must show: title, source tag, reading time, a resilience score 
  indicator, and a "Lire" CTA.

LAYOUT OPTIONS FOR RESULTS
You may choose: list view, card grid, or a mixed editorial layout.
Consider: a "featured" top result (AI-highlighted best match) 
before the full list, with a slightly different visual treatment.

AI ASSISTANT STRIP
A persistent subtle panel or inline message from the OrientIA AI 
that contextualizes the results:
e.g. "Basé sur ton profil, les métiers créatifs semblent te correspondre.
      Veux-tu affiner avec un quiz ?"
It should feel like a smart assistant nudge, not a banner ad.

EMPTY STATE
Design an empty results state when no results match:
- Friendly illustration area (no stock photos)
- Message explaining no results were found
- 3 suggested alternative queries
- A CTA to go back to the portal home

PAGINATION OR INFINITE SCROLL
Choose and design whichever pattern fits better.
If pagination: show page numbers + prev/next.
If infinite scroll: show a loading skeleton state.

——————————————————————————————————————
STATES TO DESIGN
——————————————————————————————————————
- Default results state (mixed content, filters inactive)
- Filtered state (1–2 active filters, reduced results)
- Loading / skeleton state (while results are fetching)
- Empty state (no results found)
- Saved/bookmarked result state (after clicking save)

——————————————————————————————————————
PAGES TO DELIVER IN FIGMA
——————————————————————————————————————
1. Search results — desktop 1440px (default state)
2. Search results — desktop 1440px (filtered state)
3. Search results — mobile 390px
4. Empty state — desktop
5. Component frame: all 5 result card types extracted as components

——————————————————————————————————————
DEVELOPER HANDOFF
——————————————————————————————————————
Stack: Vite + React + Tailwind CSS + shadcn/ui
- Use Auto Layout on all components (4px base unit = Tailwind spacing)
- Filter chips → shadcn/ui Badge component
- Search input → shadcn/ui Input component
- CTAs → shadcn/ui Button (variant: default / outline / ghost)
- Result cards → custom Card components with typed props
- Name all layers in English, group by component

DO NOT design a search engine results page (no blue links, no ads).
DO NOT make all result types look the same.
DO NOT use Lorem Ipsum — use realistic French career-related copy.