# Emerson Ng

Personal site: music, sport, projects, work, travel and the moments in between. Built with [Astro](https://astro.build), static, deployed free to GitHub Pages at <https://emersongideon.github.io>.

## Run it locally

Needs Node 22.23.4+ (`.nvmrc` pins it).

```bash
nvm use            # or: nvm install
npm install
npm run dev        # http://localhost:4321, add --host to open it on your phone
```

`npm run build` writes the static site to `dist/`.

## Deploy

Push to `main`. The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and publishes; the site is live in about a minute. No manual step.

## Where things live

- **Content** is in `src/data/*.json`. Edit these to change the site; you never touch layout.
- **Photos** are in `src/assets/<page>/` and go through Astro's image pipeline (AVIF/WebP, responsive, lazy). Never commit video files.
- **Pages** are in `src/pages/`, shared pieces in `src/components/`.

## Adding things

Each change below is a data edit, then (for photos) a file drop. Commit and push to publish.

### A photo

1. Downsize it first: `npm run downsize` (shrinks everything in `src/assets` to a 2400px max edge, keeping the repo small).
2. Drop it in the page's folder, e.g. `src/assets/music/collage/` for the Music board, or `src/assets/life/` for a Life moment.
3. For specific photos (gigs, trips, Life rows), set the filename in the matching JSON, e.g. `"photo": "fopx-2019.jpg"`. The Music, Photography and Gaming hero boards pick up anything dropped in their `collage/` folder automatically and repack on each build.

### A video

Videos are never committed; they are referenced by id or URL.

- **YouTube** (default): put the id in the data file, e.g. Calefare `"yt": "dQw4w9WgXcQ"`, plus `"start"` in seconds to jump to your moment. Loads only on click.
- **Facebook**: put the full video URL in a `"fb"` field (used by Music jams, the Thailand clip in Countries, wushu in Sports).

### A life event

Add an object to `events` in `src/data/life.json`:

```json
{ "year": "2019", "cat": "church", "title": "Baptised", "note": "One line about it.", "photo": "baptism.jpg" }
```

`cat` must match a category `id` in the same file. Mission trips can set `"anchor"` to link to the matching country.

### A country

Add an object to `places` in `src/data/countries.json`:

```json
{ "name": "Japan", "when": "2019", "why": "Snowboarding", "region": "East Asia",
  "lon": 139, "lat": 37, "photos": ["niseko.jpg"], "clip": { "fb": "https://..." } }
```

`lon`/`lat` place the map marker. `why: "Mission trip"` gives it the terracotta diamond marker and a link to Life.

## Scripts

- `scripts/downsize-photos.mjs` - photo resizer (`npm run downsize`).
- `scripts/fetch-fpl.py` - pulls an FPL team's history into `src/data/fpl.json`. Runs in a terminal (`FPL_ENTRY_ID=123456 python scripts/fetch-fpl.py`) or Google Colab (set `ENTRY_ID` at the top). Standard library only.

## Not built yet

The friends-only section (the two `???` tiles on Home are its future entrance). No private content is in this repo; it will be protected separately later.
