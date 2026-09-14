import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Editions of HackHCC. Exactly the facts; nothing here may be invented.
 * status: past (happened, archived) · announced (public dates, featured)
 *       · upcoming (known to exist, nothing announced — the gap state).
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
