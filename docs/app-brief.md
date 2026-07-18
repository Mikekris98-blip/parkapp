# TrailStamp — App Build Brief

A mobile app for tracking Ontario Provincial Parks visited, with photos, notes,
and tiered membership. This document is the full spec. A clickable HTML
prototype (`trailstamp-prototype.html`) is attached alongside this brief —
use it as the visual and interaction reference; this document is the source
of truth for feature logic and data.

**Instructions for Claude Code:** Please read this whole brief first, then
open and inspect `trailstamp-prototype.html` to see the exact screens, colors,
fonts, and flows. Build the real app to match the prototype's look and
interactions, using the tech stack below. Build in stages (see "Suggested
build order" at the end) rather than everything at once, and check in after
each stage before moving to the next.

## Tech stack

- **Framework:** React Native via Expo (so it runs on iOS and Android from one codebase)
- **Backend:** Firebase — Authentication, Firestore (database), Storage (photos)
- **Payments:** not required for the initial free-tier launch; Membership/Premium
  billing can be added later via RevenueCat or native in-app purchases

## Design language (see prototype for exact values)

- Aesthetic: national-park-passport / trail-stamp theme
- Colors: deep pine green primary, moss green secondary, rust orange accent,
  warm canvas/parchment background, gold accent for badges and progress fills
- Fonts: condensed uppercase display font for headers (park-signage feel),
  clean humanist sans for body text, monospace for stats/dates/tags
- Signature motif: a circular dashed "stamp" shape, used for park icons,
  achievement badges, and the yearly patch

## Membership tiers

**Free**
- Track 3–5 parks (hard cap, enforced when marking a park visited)
- Add photos and notes per park
- Basic progress tracker

**Membership** (paid, price TBD)
- Everything in Free
- Unlimited park tracking
- View campsite and trail details per park
- Photos/notes can be marked public or private

**Premium** (paid, higher tier, price TBD)
- Everything in Membership
- A set number of "treasure trail" scavenger-hunt-style electronic hikes
  (admin-curated content, not user-generated — clue-based hikes with checkpoints)
- A set number of choosable "community fun guides" (admin-curated, themed
  lists like "Best Sunset Overlooks" — user picks which ones they want)
- A physical membership patch/sticker mailed each year on renewal (this
  needs a shipping address field on Premium accounts and a fulfillment
  process — treat as a manual/admin process for launch, not automated)

## Core screens

1. **Welcome / Sign up / Log in**
2. **Home** — progress ring (parks visited vs. free cap or total), upgrade
   banner (Free only), list of the user's visited parks
3. **Log a park** — search the parks database and select one (preferred
   path), or "Add manually" for parks not in the database; free-tier cap
   enforced here
4. **Park detail** — photos, notes, location info for one visited park
5. **Discover** — progress bar toward visiting all Ontario Parks, search,
   entry point to the full Parks Database, Treasure Trails list (Premium),
   Community Fun Guides (Premium, user selects which guides they want)
6. **Parks Database (full)** — alphabetical list of every park, with search
   and a list/map view toggle. Each park expands to show:
   - **Free:** name, address, an illustrative map showing its location,
     a short description, amenities list
   - **Membership/Premium:** all of the above, plus a clickable grid of
     numbered campsites — tapping a site opens a place for the user's own
     notes and photos specific to that site
7. **Profile** — user photo (uploadable), editable display name, membership
   level, an "Upgrade" button, a progress tracker graphic, yearly patch
   collection, and an expandable "camp diary" — one entry per visited park,
   expanding to show that park's photos and notes
8. **Upgrade / paywall** — compares Free / Membership / Premium, triggered
   from any locked feature

## Data model

- **User:** name, photo, email/auth id, tier (free/membership/premium),
  renewal date, shipping address (Premium only)
- **Park (master database):** name, region/address, coordinates, description,
  amenities list, campsite count, trail count — admin-managed, seeded from
  the Ontario Provincial Parks list (see below)
- **Visit:** user id, park id, date(s), notes, photos, public/private flag
- **Site note:** user id, park id, site number, notes, photos (Membership+)
- **Treasure Trail:** name, description, checkpoints/clues — admin-created
- **Fun Guide:** title, theme, content — admin-created; users select which
  ones they've unlocked
- **Patch/Sticker order:** user id, year, shipping status

## Parks database

Launch with the full official list of Ontario Provincial Parks (340+).
The prototype is seeded with 15 real parks as a working sample — treat that
list as a starting point, not the full set. Real park data (address,
coordinates, amenities) will need to be sourced or entered by hand; Ontario
Parks may publish usable data, otherwise plan for manual data entry as part
of launch prep.

## Suggested build order

1. Project setup (Expo + Firebase connected)
2. Sign-up / login
3. Parks database screen with search (start with the 15-park sample data)
4. Log-a-park flow + Home progress tracking, with the free-tier cap
5. Park detail + Profile (photo upload, editable name, camp diary)
6. Discover screen (progress bar, Treasure Trails/Fun Guides as locked
   placeholders — real content comes later since it's admin-curated)
7. Paywall / upgrade screens (UI only — real billing comes after launch)
8. Full Parks Database screen (alphabetical list, expand, map view)

Ship stages 1–5 as the Free-tier MVP first; the rest can follow once that's
solid.
