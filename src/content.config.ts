import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Editions of HackHCC. Exactly the facts; nothing here may be invented.
 * status: past (happened, archived) · announced (has a public site and logo;
 *         dates may still be TBA) · upcoming (known to exist, nothing
 *         announced — the gap state).
 *
 * The newest edition with a `siteUrl` is the one the hero features; its
 * `cover` (logo) sits in the hero chip and its `preview` (a screenshot of its
 * site) in the hero card. The carousel lists every edition, newest first.
 */
const events = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      edition: z.string(),
      ordinal: z.string(),
      status: z.enum(['past', 'announced', 'upcoming']),
      venue: z.string().optional(),
      siteUrl: z.string().url().optional(),
      cover: image().optional(),
      /** Screenshot of the edition's site, for the hero card. */
      preview: image().optional(),
      blurb: z.string(),
      mlhMember: z.boolean().default(false),
      /** Only true, confirmed figures. A missing stat stays missing. */
      stats: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .default([]),
      order: z.number(),
    }),
});

/** The officers who run it. One file per seat, `order` sets the rail. */
const officers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/officers' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      photo: image().optional(),
      order: z.number(),
    }),
});

export const collections = { events, officers };
