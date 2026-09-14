# hackhcc.org

**HackHCC** — the hackathon run by the Computer Science Association at
Houston City College. This is the production site: a dark, hackutd.co-style
single page with a video hero, edition carousel, officer roster, and
sponsor wall.

Built with [Astro](https://astro.build) (static output) and Tailwind CSS v4.

## Quick start

```bash
npm install
npm run dev     # Astro prints its port (default 4321); stop with `npx astro dev stop`
npm run build   # static build into dist/ — deploys anywhere (Cloudflare Pages / Vercel / Netlify)
```

## Editing content

**See [CONTENT.md](CONTENT.md).** Routine updates — announcing an edition,
changing officers, fixing links, bumping the MLH badge season, tuning the
hero video loop — are JSON/config edits in `src/content/` and
`src/data/site.ts`. No Astro knowledge required.

Full-page reference screenshots live in `screenshots/`.

An alternate from-scratch design (nixie-tube counter world) exists at
`../hackhcc-landing-page` with its own docs; this repo is the one that ships.
