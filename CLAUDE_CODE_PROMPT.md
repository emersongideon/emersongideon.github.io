# Prompt for Claude Code

Copy everything below the line into Claude Code, run from inside this folder.

---

I'm building my personal website: a record of my life (music, sport, projects, work, travel and the moments in between). It will be hosted for free on GitHub Pages. The design is finished; your job is to turn it into a real, fast, mobile-friendly site that's easy for me to keep adding photos, videos and stories to.

## What's in this folder

- `index.html`: the **finished, working home page** (desktop and mobile). Treat it as the source of truth for the look and the scroll behaviour. Port it faithfully; don't redesign it.
- `design-reference/*.html`: the designed version of every other page. Static ones open directly in a browser. `life.html` and `countries.html` are interactive and use a template syntax (`{{...}}`, `<sc-for>`, `<sc-if>`) plus a logic class at the bottom; read them as specs and rebuild them in plain HTML/JS.
- `design-reference/friends-*-hidden.html`: a future friends-only section. **Do not build these yet.**

## Stack

- **Astro**, static output, deployed to GitHub Pages with the official `withastro/action` GitHub Actions workflow. Set `site` and `base` correctly for GitHub Pages.
- Ship as little JavaScript as possible: plain `<script>` per page; no React unless a page truly needs it.
- Keep all content in data files (`src/data/*.json` or Astro content collections) so I can add things without touching layout code: home tiles, life events, countries/trips, gigs, sports, videos, Calefare clips, Hojiakbo favourites, PRs.

## Routes

`/` home · `/music/` · `/gym/` · `/sports/` · `/photography/` · `/gaming/` · `/projects/` (anchors `#cmdtempo`, `#fpl`, `#arsenal`) · `/calefare/` · `/hojiakbo/` · `/work/` · `/education/` · `/life/` · `/countries/`

Photography and Gaming have no design yet: build them with the same pattern as Music (photo collage hero, then a short story, then content) and tell me so I can review.

## Design rules (keep these)

- Palette: background `#EEECE7`, surface `#F8F7F4`, ink `#2B2A27`, secondary text `#3C3A35`, muted `#6B6861`, lines `#DAD6CE`, accent slate `#4F6D8A`. Tile tints: love `#E9DFD6`, made `#DCE2E8`, work `#DCE3D9`, life `#E0DDE8`. Subtle film-grain overlay (already in `index.html`).
- Type: Newsreader (serif) for headings, Archivo for everything else. JetBrains Mono only for small counters like `06 / 14`.
- No italics in body copy or taglines. Sentence case. Don't use `·` (middle dot) separators in UI text; use commas or line breaks. Replace any you find in the references.
- Photos with captions: caption sits on the photo itself (white text over a soft dark gradient), not below it like a polaroid.
- Every page: breadcrumb back to home, and a "Copy link" button (use `navigator.clipboard`). Work and Education also get "Download PDF": add a clean print stylesheet and use `window.print()`, or generate a static PDF at build time.

## Page behaviours to get right

1. **Home**: port `index.html` exactly: the sticky "pick a part of my life" screen driven by scroll, hover selects on desktop, tap selects on mobile (and scrolls to that step), the bottom tile strip on mobile that keeps the active tile centred. Each tile gets an optional photo (`img` field).
2. **Music collage**: a tight board of photos edge to edge with thin seams and no gaps. Read each image's aspect ratio at build time and assign grid spans (wide, tall, square, big) so it packs itself whatever photos I drop in; shuffle the order on each build.
3. **Life**: filter chips (Family, Church life, Mission trips, School & work, Injuries, Phones I've used, Milestones). Compact one-line rows. On desktop, hovering a row swaps the photo in one fixed panel on the right; the panel takes the photo's natural shape. On mobile, tapping a row expands its photo and note inline.
4. **Countries**: Map/List toggle. Map uses `d3-geo` with `world-atlas` TopoJSON; visited countries are filled, mission-trip countries get a distinct marker and link to the matching Life entry. List view shows the same data as rows. Clicking either opens that trip's photos.
5. **Projects, Arsenal piece**: scrollytelling with Scrollama + D3: text steps on one side, a sticky chart that redraws per step.
6. **Gym**: PR cards plus a small D3 line chart of lifts over time from a JSON file.
7. **FPL**: write a small Python script (it should also run in Google Colab) that pulls my team's history from the public FPL API and writes `src/data/fpl.json`; the page charts it.

## Images and video (important: GitHub Pages limits)

GitHub Pages sites can be at most 1 GB published, with a soft bandwidth limit of 100 GB/month, and GitHub rejects any single file over 100 MB. So:

- **Photos** live in the repo under `src/assets/` and go through Astro's `<Image>`/`<Picture>`: AVIF/WebP, responsive `srcset`, lazy loading, width/height set to avoid layout shift. Add a script or README step that downsizes originals to max ~2400px before committing, so the repo stays small.
- **Videos default to YouTube.** I'll upload every video people actually watch (snowboard edits, gig and service recordings, the MV, the competition entry, Calefare clips, Hojiakbo) to my YouTube channel, most of them as **unlisted**. In the data files a video is just a YouTube ID plus a title (and optional start time, e.g. "me at 0:12" for Calefare). Embed with a click-to-load facade (`lite-youtube-embed`) instead of raw iframes so pages with many videos stay fast, and use `youtube-nocookie.com` with `rel=0` so end-screen suggestions stay on my own channel.
- **Never commit video files to the repo.**
- **Optional, later: Cloudflare R2** (free tier: 10 GB storage, free egress) only for short, muted, auto-looping clips used as "moving photos" (e.g. inside the Music collage or a home tile), where a YouTube player doesn't fit. Support it in the data model (a `src` URL instead of a YouTube ID, played with `<video muted autoplay loop playsinline preload="none" poster="…">`, H.264 MP4, base URL in one config value), but don't set up R2 now; just make it easy to add.
- Unlisted YouTube videos are not private (anyone with the link can watch), so nothing for the future friends-only section should use them.

## Quality bar

Test at 390×844 and 1440×900. Touch targets at least 44px, safe-area insets on phones, visible keyboard focus, `prefers-reduced-motion` respected, real alt text fields in the data, Lighthouse 90+ on mobile.

## Not now

The friends-only section (the two `???` locked tiles on Home are its future entrance). Don't put any private content in the repo. Later we'll protect it properly (encrypting those pages at build time, or putting the site behind Cloudflare Access).

## How to work

Start by showing me a short plan and the folder structure. Then go in this order: scaffold and deploy an empty site to GitHub Pages, port Home, then one page at a time, pausing after each for me to look. Finish with a README explaining how I add a photo, a video, a life event and a country.
