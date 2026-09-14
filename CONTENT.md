# Updating hackhcc.org

You do not need to know Astro to update this site. Everything routine lives
in two places:

- `src/content/` — JSON files for events and officers
- `src/data/site.ts` — links, emails, the hero video loop, the MLH badge

Edit a file, commit, and the site rebuilds.

---

## Announcing the next hackathon

1. Open `src/content/events/2027-control-z.json` (or the next edition's file).
2. Set `"status": "announced"` and fill in what is now public (venue,
   `siteUrl`, blurb). After the event happens, set `"status": "past"` and add
   the **real** stat chips — only numbers you actually counted:

```json
"stats": [
  { "value": "120+", "label": "Hackers" },
  { "value": "24", "label": "Hours" }
]
```

3. Add a JSON file for the edition after it, `"status": "upcoming"`, so the
   carousel always knows more is coming.

| `status` | Renders as |
| --- | --- |
| `past` | Full card: art, chips, link to its site |
| `announced` | Card with public details and a live link |
| `upcoming` | "Under wraps" card — no invented details |

**Never invent a number.** Code Runners' chips (100+ Hackers, 24 Hours, 28
Projects, 14 Sponsors) are confirmed figures; only add a stat once you have
the real count.

---

## Officers

`src/content/officers/` — one file per seat, `order` sets the carousel
position. Officers turn over annually; update after elections.

The roster mirrors the CSA site's board: `csa-website/src/content/team.yaml`
is the source of truth for **names, roles, and `order`**. When a seat changes
there, mirror it here. LinkedIn/GitHub links are richer on this site — keep
them when re-syncing. (Known divergence: this site spells the Assistant
Marketing & Communications Director **Iskandar**, matching her LinkedIn
handle; csa-website still says "Iskander".)

```json
{
  "name": "Full Name",
  "role": "Website & Tech",
  "linkedin": "https://linkedin.com/in/username",
  "github": "https://github.com/username",
  "order": 3,
  "photo": "../../assets/officers/full-name.jpg"
}
```

Photos: square JPEG, 800×800, dropped in `src/assets/officers/`. Astro
optimizes at build time and renders them at 480×480. Never upscale — two
headshots (`william-oyouha`, `khizar-ahmed`) ship at their native 709px and
754px because that is the largest original that exists. Omit `photo` if you
don't have one.

The leadership block in `src/components/Team.astro` (John Pierre & Nelson
Aviles, President & VP) still holds a **placeholder quote and photo** — swap
in a real note when they write one. Never invent a quote for a real person.
Officers without a headshot render a dashed "headshot pending" footprint;
seats without a person yet are listed as "Name TBA".

---

## The hero video

`src/data/site.ts` → `heroVideo`:

- `youtubeId` — currently `yEq0ao1ci5Y`
- `startSeconds` / `endSeconds` — the loop segment (currently 8–38). Adjust
  until the loop lands on footage you like.

**Whose footage this is.** `yEq0ao1ci5Y` is "Houston Night and Day by drone,
Texas | 4K video" by PrimoMedia – Chris Biela. It is **not ours.** The embed
is fine: that is what the creator's upload licenses anyone to do, and the
IFrame API is the sanctioned path. Downloading the file and re-serving it
from hackhcc.org is **not** — that is redistributing their work without a
licence, and it is what the checklist item below is guarding against. Do not
"just download it to be safe."

**Going self-hosted.** Drop a clip at `public/hero.mp4` and the build swaps
the YouTube embed for a native muted `<video>` automatically — lighter, and
no third-party request. Only ship footage we own or have licensed for
commercial redistribution. Encode it with:

```bash
npm run hero:encode -- path/to/clip.mp4 --start 0 --duration 16
```

That produces a silent 720p H.264 file with the moov atom up front, tuned for
a backdrop sitting behind a 55% scrim (`--crf` defaults to 30). Budget is
~2 MB; the script warns if you blow it. A 4K source with audio typically
lands well under 1 MB.

With reduced motion or no JS the hero shows a plain dark poster — that's
intentional. So does a YouTube video that has been removed, blocked, or had
embedding switched off: `Hero.astro` listens for the player's `onError` and
pulls the iframe, so YouTube's own "Video unavailable" card can never appear
behind the hero copy. That check is deliberately error-driven and not a
timeout — muted autoplay can sit unstarted for a long time on a slow or
backgrounded tab, and a timer would strip a video that was about to play.

---

## Links, emails, and the MLH badge

All in `src/data/site.ts`. Socials are **confirmed** (mirrored from the Code
Runners site footer): Instagram `@hackhcc` and LinkedIn `company/compscia` —
the only two, by decision. Anything marked `placeholder: true` is wired but
**unconfirmed** — verify before launch and delete the flag:

- `hello@hackhcc.org` / `sponsor@hackhcc.org`
- the Interest Form (currently opens email; swap `ctas.interest.href` for the
  real form URL)

**MLH badge:** bump `mlh.season` once a year (line ~54). The badge is
hotlinked from MLH's own asset host and is never copied, redrawn, recolored,
or filtered. Verify the new season's asset exists before shipping:

```bash
curl -sI "https://s3.amazonaws.com/logged-assets/trust-badge/2027/mlh-trust-badge-2027-white.svg" | head -1
```

`200` = live. Anything else = leave the previous season in place.

---

## Sponsors

`src/components/Sponsors.astro` renders the real Code Runners 2026 sponsors
(all 14, in the edition site's tier order) inside the original
placeholder-style tiles on the light panel, with logo files in
`src/assets/sponsors/`. Google and Nexos are text marks (no light-ground
logo asset exists) and Nexos has no URL — mirroring the edition site. To add
or change a sponsor, edit the `sponsors` array and drop the logo file in
`src/assets/sponsors/`.

---

## Campus photo (team-section parallax)

The band behind Meet the Team uses the campus photo in `src/assets/campus/`
(referenced from `src/components/Team.astro`). The current file is small
(457×609) and ships with a blur to compensate — **swap in a high-resolution
landscape campus photo** (≥2000px wide) when one exists and remove/reduce the
blur.

---

## Before-launch checklist

- [ ] Real Interest Form URL (`src/data/site.ts` → `ctas.interest`)
- [ ] Confirm both emails; delete `placeholder` flags (socials already confirmed)
- [ ] Logo artwork → replace the "HackHCC logo" text slot in `src/components/Nav.astro`
- [x] Mission photo → officers group shot from Code Runners
- [ ] Leadership photo + real quote → `src/components/Team.astro`
- [ ] "More about us" link target (`Mission.astro`, currently `#`)
- [ ] Hero footage: current embed is a third party's (see above). Self-host at
      `public/hero.mp4` only with owned or licensed footage — `npm run hero:encode`
- [ ] Hi-res campus photo for the parallax band
- [ ] `og:image` for social sharing (`src/layouts/`)
- [ ] Pick a deploy target — `dist/` is platform-agnostic static

---

## Running locally

```bash
npm install
npm run dev    # prints its port; stop with `npx astro dev stop`
npm run build  # fails loudly (file + field) if a content JSON is malformed
```
