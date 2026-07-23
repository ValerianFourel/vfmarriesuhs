# Wedding Website — 3 April 2027 · Seoul

A small, fast, **trilingual (EN · FR · DE)** static site with everything guests need:
the date, the venue, how to get there, where to stay, and what to wear.

Plain HTML + CSS + vanilla JavaScript. No framework, no build step — just serve the files.

```
Wedding/
├── index.html                  # page structure (English fallback text baked in)
├── styles.css                  # all styling
├── i18n.js                     # language detection + switcher logic
├── i18n/
│   ├── en.json                 # ← all English copy (source of truth)
│   ├── fr.json                 # ← all French copy
│   └── de.json                 # ← all German copy
├── assets/
│   ├── placeholder-couple.svg  # swap for a real photo of you two
│   └── placeholder-venue.svg   # swap for a photo of the venue
└── README.md
```

## Preview locally

The translations are loaded with `fetch()`, so the site must be served over HTTP
(opening `index.html` by double-clicking will show the built-in English text only).

From this folder, run **one** of:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
npx serve                       # then open the URL it prints
```

(Or use the VS Code "Live Server" extension.)

## Edit your details (the placeholders)

All couple-specific values live at the **top of each locale file**, in the `couple`
block, in **all three** files — `i18n/en.json`, `i18n/fr.json`, `i18n/de.json`.

Already filled in: the names (Hyunseo Um & Valerian Fourel), the ceremony time
(5:00 PM / 17 h 00 / 17:00 Uhr), the RSVP date (28 February 2027, via the
Paperless Post invitation or a message), the contact links (WhatsApp
+43 660 3977537 and valerian.fourel@gmail.com — the links live in `index.html`),
and the gifts text (the Korean cash-gift custom, explained for Western guests,
in `know.gifts`).

Still a placeholder — edit it in all three files:

| Key | Currently | Example |
|---|---|---|
| `groupCode` | `[CODE]` | `WED0403` |

Anywhere the rest of the copy says `{bride}`, `{groupCode}`, etc., the value is filled
in automatically from that block — so you type each name/date/code **once per language**.

Notes:

- **Every other sentence** on the site also lives in these three JSON files, grouped by
  section (`hero`, `day`, `location`, `stay`, `dress`, `know`, `footer`). Edit freely,
  but keep the **same keys in all three files**.
- Proper nouns and hard data (hotel names, the Korean address, booking URLs, map
  coordinates) live directly in `index.html` so they can't drift between languages.
- `index.html` also contains the English text as a **no-JavaScript fallback**. If you
  change a sentence in `en.json`, mirroring it in `index.html` keeps the fallback in
  sync (optional — visitors with JavaScript always see the JSON version).

## How the languages work

- First visit: the browser language is detected — French and German browsers get FR/DE,
  everyone else gets EN.
- Clicking **EN · FR · DE** (header or footer) switches instantly and remembers the
  choice in `localStorage`.
- `<html lang>` is updated on every switch, and the Korean address is tagged `lang="ko"`.
- A native speaker can proofread by editing `i18n/fr.json` / `i18n/de.json` only —
  no HTML knowledge needed. (French strings use non-breaking spaces before `:` `?` `!`,
  which is intentional.)

## Add photos

Two tasteful placeholders are included:

1. **Couple photo** (below the hero) — replace `assets/placeholder-couple.svg`
2. **Venue photo** (next to the map) — replace `assets/placeholder-venue.svg`

Either overwrite those files with your own images (keeping the names), or drop in e.g.
`assets/us.jpg` and update the `src` in `index.html`. Landscape ~3:2, around 1600 px
wide and compressed (< 400 KB) is ideal. The alt texts are translated automatically via
the `photos.*` keys in the JSON files.

## Deploy

### GitHub Pages

```bash
git init
git add .
git commit -m "Wedding site"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: "Deploy from a branch" → `main` / `(root)`**.
The site appears at `https://<you>.github.io/<repo>/` after a minute or two.
(All paths are relative, so it works fine in a sub-path.)

### Netlify

Drag this folder onto <https://app.netlify.com/drop> — done.

### Vercel

Run `npx vercel` in this folder, or import the GitHub repo at <https://vercel.com/new>.
No build settings needed — it's detected as a static site.

## Accessibility & performance notes

- Semantic HTML, skip-to-content link, keyboard-focusable language switcher with
  `aria-pressed` state, visible focus rings, translated `alt`/`aria-label` text.
- Colour contrast meets WCAG AA; decorative artwork is pure CSS/SVG (no image
  libraries) and is hidden from screen readers.
- All animation (drifting petals, scroll reveals, smooth scroll) is disabled for
  visitors with "reduce motion" enabled.
- Only external requests: two Google Fonts families and the embedded Google Map.
