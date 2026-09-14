/**
 * The facts that live outside the content collections: org identity,
 * outbound links, contacts, the MLH badge, and the hero video config.
 * Edit here, not in components.
 *
 * Anything marked `placeholder: true` is wired and working but points at an
 * address that has NOT been confirmed. Verify each one before launch and
 * delete the flag.
 */

export const site = {
  name: 'HackHCC',
  domain: 'hackhcc.org',
  url: 'https://hackhcc.org',
  organizer: 'Computer Science Association',
  organizerShort: 'CSA',
  institution: 'Houston City College',
  tagline: "Houston City College's own 24-hour hackathon.",
  description:
    'HackHCC is the hackathon run by the Computer Science Association at Houston City College: 24 hours of building, workshops that assume nothing, free food and merch, and first-timers welcome.',
} as const;

/**
 * Hero background video.
 *
 * Default path: a muted, looping SEGMENT of a YouTube video via the official
 * IFrame Player API. `startSeconds` / `endSeconds` bound the loop — ADJUST
 * them freely to pick a calmer or busier stretch of footage (current default
 * ~8s–38s).
 *
 * RIGHTS: `yEq0ao1ci5Y` is PrimoMedia – Chris Biela's "Houston Night and Day
 * by drone, Texas | 4K video" — NOT ours. Embedding is licensed; downloading
 * the file and re-serving it from our domain is not. See CONTENT.md.
 *
 * PREFERRED SWAP: drop an owned or properly licensed clip at `public/hero.mp4`
 * and the hero renders a native `<video autoplay muted loop playsinline>`
 * instead of the YouTube embed (checked at build time). Encode it with
 * `npm run hero:encode`. Do this as soon as such footage exists — it removes
 * the third-party embed, and the third-party dependency, entirely.
 */
export const heroVideo = {
  youtubeId: 'yEq0ao1ci5Y',
  startSeconds: 8, // loop start (seconds) — adjustable
  endSeconds: 38, // loop end (seconds) — adjustable
  /** Local override path, served from `public/`. */
  localHeroVideo: '/hero.mp4',
} as const;

/**
 * The MLH Trust Badge — the page's only MLH presence. Hotlinked from MLH's
 * own asset host, linking to mlh.io, never copied, redrawn, recolored, or
 * filtered. Bump `season` once a year and verify the asset resolves:
 *
 *   curl -sI "https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-white.svg" | head -1
 *
 * `white` is the colourway MLH draws for dark grounds.
 */
export const mlh = {
  season: '2026',
  variant: 'white' as 'white' | 'black' | 'blue' | 'red' | 'gray',
  get badgeSrc() {
    return `https://s3.amazonaws.com/logged-assets/trust-badge/${this.season}/mlh-trust-badge-${this.season}-${this.variant}.svg`;
  },
  get href() {
    return `https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=${this.season}-season&utm_content=${this.variant}`;
  },
  get alt() {
    return `Major League Hacking ${this.season} Hackathon Season`;
  },
} as const;

/**
 * Confirmed handles, mirrored from the Code Runners edition site's footer.
 * Instagram + LinkedIn only, by decision (no Discord / X / GitHub presence).
 */
export const socials = [
  { label: 'Instagram', handle: '@hackhcc', href: 'https://www.instagram.com/hackhcc/', icon: 'instagram' },
  { label: 'LinkedIn', handle: 'compscia', href: 'https://www.linkedin.com/company/compscia/', icon: 'linkedin' },
] as const;

/** PLACEHOLDER addresses: confirm before launch. */
export const contact = {
  general: 'hello@hackhcc.org',
  sponsor: 'sponsor@hackhcc.org',
} as const;

export const ctas = {
  /**
   * PLACEHOLDER: the primary CTA. Swap `href` for the real interest-form URL
   * (Google Form / Typeform) when it exists; until then it opens email so the
   * button genuinely works.
   */
  interest: {
    label: 'Interest Form',
    href: `mailto:${contact.general}?subject=${encodeURIComponent('Tell me when the next HackHCC is announced')}`,
    placeholder: true,
  },
  sponsor: {
    label: 'Get in Touch',
    href: `mailto:${contact.sponsor}?subject=${encodeURIComponent('Sponsoring HackHCC')}`,
  },
} as const;

export const anchors = [
  { id: 'mission', label: 'Our Mission' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'team', label: 'Meet the Team' },
  { id: 'support', label: 'Support Us' },
  { id: 'sponsors', label: 'Sponsors' },
] as const;
