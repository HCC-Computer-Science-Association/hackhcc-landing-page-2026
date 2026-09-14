#!/usr/bin/env node
/**
 * Turn a source clip into `public/hero.mp4` — the self-hosted hero background.
 *
 *   npm run hero:encode -- <source> [--start 0] [--duration 16] [--crf 30]
 *
 * The output is tuned for what this asset actually is: a silent, looping,
 * decorative backdrop sitting behind a 55% black scrim (see Hero.astro). That
 * budget is nothing like a video you actually watch, so we spend accordingly —
 *
 *   720p       the scrim eats fine detail; 4K here is pure waste
 *   no audio   the <video> is muted and loops; the track is dead weight
 *   CRF ~30    aggressive, but invisible under the scrim
 *   faststart  moov atom up front so it streams instead of buffering whole
 *   yuv420p    the pixel format every browser can actually decode
 *
 * Aim for under ~2 MB. Anything heavier and the hero costs more than it gives;
 * re-run with a shorter --duration or a higher --crf.
 *
 * RIGHTS: whatever you pass in gets served from hackhcc.org, so it has to be
 * ours or licensed for that. Our own event footage is first choice. Stock
 * under a license that permits commercial redistribution is fine. A video
 * pulled off someone else's YouTube channel is not — embedding is the only
 * thing their upload licenses us to do.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../public/hero.mp4', import.meta.url));

const argv = process.argv.slice(2);
const FLAGS = ['start', 'duration', 'crf'];
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
/** First bare token that isn't a flag or a flag's value. */
const source = argv.find(
  (a, i) => !a.startsWith('--') && !FLAGS.some((f) => argv[i - 1] === `--${f}`),
);

if (!source) {
  console.error('Usage: npm run hero:encode -- <source.mp4> [--start 0] [--duration 16] [--crf 30]');
  process.exit(1);
}
if (!existsSync(source)) {
  console.error(`No such file: ${source}`);
  process.exit(1);
}

const start = flag('start', '0');
const duration = flag('duration', '16');
const crf = flag('crf', '30');

const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(2);

console.log(`source   ${source} (${mb(source)} MB)`);
console.log(`segment  ${start}s → +${duration}s · CRF ${crf} · 720p · silent\n`);

execFileSync(
  'ffmpeg',
  [
    '-y',
    '-ss', start,
    '-i', source,
    '-t', duration,
    // Fit inside 1280x720 without upscaling; keep both dimensions even for H.264.
    '-vf', "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2",
    '-an',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-preset', 'veryslow',
    '-crf', crf,
    '-pix_fmt', 'yuv420p',
    // Keyframe every ~2s so the loop restarts without a long seek.
    '-g', '48',
    '-movflags', '+faststart',
    OUT,
  ],
  { stdio: ['ignore', 'ignore', 'inherit'] },
);

const size = Number(mb(OUT));
console.log(`\nwrote    public/hero.mp4 (${size} MB)`);
console.log(
  size > 2
    ? '\n⚠  Over the ~2 MB budget. Re-run with a shorter --duration or a higher --crf.'
    : '\nHero.astro picks this up automatically on the next build — the YouTube\nembed drops out and the native <video> takes over.',
);
